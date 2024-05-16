// <copyright file="DataStreamResolver.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Linq.Expressions;
using static System.Linq.Expressions.Expression;
using System.Reflection;
using System.Text;

namespace DataStream;

internal class DataStreamWriterCompiler: DataStreamCompilerBase
{
    private readonly ConcurrentDictionary<Type, Delegate> _writers = new();

    public Delegate GetOrAdd(Type type, DataStreamSerializerContext context)
    {
        ArgumentNullException.ThrowIfNull(type);
        ArgumentNullException.ThrowIfNull(context);

        if (!_writers.TryGetValue(type, out Delegate? writer))
        {
            writer = _writers.GetOrAdd(type, t => Create(t, context));
        }
        return writer;
    }

    private Delegate Create(Type type, DataStreamSerializerContext context)
    {
        ParameterExpression writerParameter = Parameter(typeof(DataStreamWriter), "writer");
        ParameterExpression itemParameter = Parameter(type, "item");

        Dictionary<string, int> propertyMap = new();
        BlockExpression body = Block(
            Call<DataStreamWriter>(
                nameof(DataStreamWriter.WriteStartOfStream),
                Array.Empty<Type>(),
                writerParameter),
            GetExpression(type, itemParameter, writerParameter, context, propertyMap),
            Call<DataStreamWriter>(
                nameof(DataStreamWriter.WriteEndOfStream),
                Array.Empty<Type>(),
                writerParameter)
        );
        LambdaExpression lambda = Lambda(body, writerParameter, itemParameter);
        return lambda.Compile();
    }

    private BlockExpression GetExpression(
        Type itemType,
        Expression item,
        ParameterExpression writer,
        DataStreamSerializerContext context,
        Dictionary<string, int> propertyMap)
    {
        PropertyInfo[] properties = itemType.GetProperties(
            BindingFlags.Public |
            BindingFlags.Instance |
            BindingFlags.GetProperty);

        List<Expression> expressions = new();

        for (int index = 0; index < properties.Length; ++index)
        {
            PropertyInfo property = properties[index];

            if (property.GetCustomAttribute<IgnoreAttribute>() == null)
            {
                Expression writePropertyNameExpression;

                if (!propertyMap.TryGetValue(property.Name, out int propertyNameIndex))
                {
                    propertyNameIndex = propertyMap.Count;
                    propertyMap.Add(property.Name, propertyNameIndex);
                    writePropertyNameExpression = Call<DataStreamWriter>(
                        nameof(DataStreamWriter.WritePropertyName),
                        [typeof(byte[])],
                        writer,
                        Constant(Encoding.UTF8.GetBytes(property.Name)));
                }
                else
                {
                    writePropertyNameExpression = Call<DataStreamWriter>(
                        nameof(DataStreamWriter.WritePropertyIndex),
                        [typeof(int)],
                        writer,
                        Constant(propertyNameIndex));
                }

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
                                        context,
                                        propertyMap),
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
