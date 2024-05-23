// <copyright file="DataStreamWriterCompiler.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using static System.Linq.Expressions.Expression;

namespace DataStream;

internal class DataStreamWriterCompiler : DataStreamCompilerBase
{
    private readonly ConcurrentDictionary<Type, Action<DataStreamWriter, object>> _writers = new();

    public DataStreamWriterCompiler()
    {
    }

    public Action<DataStreamWriter, object> GetOrAdd(Type type)
    {
        ArgumentNullException.ThrowIfNull(type);
        return _writers.GetOrAdd(type, Create);
    }

    private Action<DataStreamWriter, object> Create(Type type)
    {
        ParameterExpression writer = Parameter(typeof(DataStreamWriter), "writer");
        ParameterExpression item = Parameter(typeof(object), "item");

        Expression body = GetExpression(type, Convert(item, type), writer);

        LambdaExpression lambda = Lambda(body, writer, item);
        return (Action<DataStreamWriter, object>)lambda.Compile();
    }

    private BlockExpression GetExpression(
        Type itemType,
        Expression item,
        ParameterExpression writer)
    {
        PropertyInfo[] properties = itemType.GetProperties(
            BindingFlags.Public |
            BindingFlags.Instance);

        List<Expression> expressions = new();

        PropertyMap propertyMap = PropertyMap.Instance;
        for (int index = 0; index < properties.Length; ++index)
        {
            PropertyInfo property = properties[index];

            if (property.GetCustomAttribute<IgnoreAttribute>() == null)
            {
                Expression writePropertyNameExpression;
                ReadOnlySpan<byte> span = Encoding.UTF8.GetBytes(property.Name);
                Utf8String propertyNameUtf8 = Utf8String.Intern(span);
                propertyMap.TryAdd(propertyNameUtf8, out int internalIndex);
                writePropertyNameExpression = Call<DataStreamWriter>(
                    nameof(DataStreamWriter.WriteProperty),
                    [typeof(int)],
                    writer,
                    Constant(internalIndex));

                Expression itemPropertyExpression = Property(item, property.Name);
                Type propertyType = property.PropertyType;

                if (propertyType.IsScalar() || propertyType == typeof(Guid))
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
                else if (propertyType.IsNullable())
                {
                    Type genericArgumentType = propertyType.GetGenericArguments()[0];
                    if (genericArgumentType.IsScalar() || genericArgumentType == typeof(Guid))
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
                                Call<DataStreamSerializer>(
                                    nameof(DataStreamSerializer.Serialize),
                                    [typeof(DataStreamWriter), typeof(object)],
                                    null,
                                    writer, itemPropertyExpression),
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
