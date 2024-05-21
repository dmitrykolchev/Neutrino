// <copyright file="DataStreamResolver.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Linq.Expressions;
using static System.Linq.Expressions.Expression;
using System.Reflection;
using System.Text;
using System.Collections;

namespace DataStream;

internal class DataStreamWriterCompiler: DataStreamCompilerBase
{
    private readonly ConcurrentDictionary<Type, Action<DataStreamWriter, object>> _writers = new();

    public DataStreamWriterCompiler()
    {
    }

    public Action<DataStreamWriter, object> GetOrAdd(Type type, DataStreamSerializerContext context)
    {
        ArgumentNullException.ThrowIfNull(type);
        ArgumentNullException.ThrowIfNull(context);

        if (!_writers.TryGetValue(type, out Action<DataStreamWriter, object>? writer))
        {
            writer = _writers.GetOrAdd(type, t => Create(t, context));
        }
        return writer;
    }

    public Action<DataStreamWriter, object> Get(Type type)
    {
        ArgumentNullException.ThrowIfNull(type);
        return _writers[type];
    }

    private Action<DataStreamWriter, object> Create(Type type, DataStreamSerializerContext context)
    {
        ParameterExpression writer = Parameter(typeof(DataStreamWriter), "writer");
        ParameterExpression item = Parameter(typeof(object), "item");

        BlockExpression body = Block(
            Call<DataStreamWriter>(
                nameof(DataStreamWriter.WriteStartOfStream),
                Array.Empty<Type>(),
                writer),
            GetExpression(type, Convert(item, type), writer, context),
            Call<DataStreamWriter>(
                nameof(DataStreamWriter.WriteEndOfStream),
                Array.Empty<Type>(),
                writer)
        );
        LambdaExpression lambda = Lambda(body, writer, item);
        return (Action<DataStreamWriter, object>)lambda.Compile();
    }

    private Expression GetArrayExpression(
        Type itemType,
        Expression item,
        ParameterExpression writer,
        DataStreamSerializerContext context)
    {
        if(typeof(IEnumerable).IsAssignableFrom(itemType))
        {
            return Call<DataStreamWriter>(
                    nameof(DataStreamWriter.Write),
                    [typeof(IEnumerable)],
                    writer,
                    item);
        }
        return GetExpression(itemType, item, writer, context);
    }

    private BlockExpression GetExpression(
        Type itemType,
        Expression item,
        ParameterExpression writer,
        DataStreamSerializerContext context)
    {
        PropertyInfo[] properties = itemType.GetProperties(
            BindingFlags.Public |
            BindingFlags.Instance);

        List<Expression> expressions = new();

        for (int index = 0; index < properties.Length; ++index)
        {
            PropertyInfo property = properties[index];

            if (property.GetCustomAttribute<IgnoreAttribute>() == null)
            {
                Expression writePropertyNameExpression;
                byte[] propertyNameUtf8 = Encoding.UTF8.GetBytes(property.Name);
                context.PropertyMap.TryAdd(propertyNameUtf8, out int streamIndex);
                writePropertyNameExpression = Call<DataStreamWriter>(
                    nameof(DataStreamWriter.WriteProperty),
                    [typeof(int)],
                    writer,
                    Constant(streamIndex));

                Expression itemPropertyExpression = Property(item, property.Name);
                Type propertyType = property.PropertyType;

                if (IsScalar(propertyType) || propertyType == typeof(Guid))
                {
                    expressions.Add(Block(
                        writePropertyNameExpression,
                        WriteScalarPropertyExpression(
                            writer,
                            itemPropertyExpression,
                            propertyType)));
                }
                else if (propertyType == typeof(byte[]))
                {
                    expressions.Add(
                        Block(
                            writePropertyNameExpression,
                            IfThenElse(
                                NotEqual(itemPropertyExpression, Constant(null)),
                                WriteScalarPropertyExpression(
                                    writer,
                                    itemPropertyExpression,
                                    propertyType),
                                Call<DataStreamWriter>(
                                    nameof(DataStreamWriter.WriteNull),
                                    [],
                                    writer)
                            )
                    ));
                }
                else if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                {
                    Type genericArgumentType = propertyType.GetGenericArguments()[0];
                    if (IsScalar(genericArgumentType) || genericArgumentType == typeof(Guid))
                    {
                        expressions.Add(Block(
                            writePropertyNameExpression,
                            IfThenElse(
                                NotEqual(itemPropertyExpression, Constant(null)),
                                WriteScalarPropertyExpression(
                                    writer,
                                    Property(itemPropertyExpression, "Value"),
                                    genericArgumentType
                                ),
                                Call<DataStreamWriter>(
                                    nameof(DataStreamWriter.WriteNull),
                                    [],
                                    writer))
                            ));
                    }
                    else
                    {
                        throw new InvalidOperationException($"cannot serialize {propertyType}");
                    }
                }
                else
                {
                    expressions.Add(
                        Block(
                            writePropertyNameExpression,
                            IfThenElse(
                                NotEqual(itemPropertyExpression, Constant(null)),
                                Block(
                                    Call<DataStreamWriter>(
                                        nameof(DataStreamWriter.WriteStartOfObject),
                                        Array.Empty<Type>(),
                                        writer),
                                    GetExpression(
                                        propertyType,
                                        itemPropertyExpression,
                                        writer,
                                        context),
                                    Call<DataStreamWriter>(
                                        nameof(DataStreamWriter.WriteEndOfObject),
                                        Array.Empty<Type>(),
                                        writer)),
                                Call<DataStreamWriter>(
                                    nameof(DataStreamWriter.WriteNull),
                                    [],
                                    writer)
                            )
                    ));
                }
            }
        }

        return Block(expressions);
    }

    private Expression WriteScalarPropertyExpression(
        ParameterExpression writerParameter,
        Expression getPropertyValueExpression,
        Type propertyType)
    {
        Expression writePropertyValueExpression;
        if (propertyType.IsEnum)
        {
            propertyType = propertyType.GetEnumUnderlyingType();
            getPropertyValueExpression = Convert(
                getPropertyValueExpression,
                propertyType);
            writePropertyValueExpression = Call<DataStreamWriter>(
                    nameof(DataStreamWriter.WriteEnum),
                    [propertyType],
                    writerParameter,
                    getPropertyValueExpression);
        }
        else
        {
            writePropertyValueExpression = Call<DataStreamWriter>(
                    nameof(DataStreamWriter.Write),
                    [propertyType],
                    writerParameter,
                    getPropertyValueExpression);
        }
        return writePropertyValueExpression;
    }

}
