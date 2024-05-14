// <copyright file="DataStreamResolver.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace DataStream;

public class DataStreamResolver
{
    private readonly ConcurrentDictionary<(Type, bool), Delegate> _writers = new();
    private readonly ConcurrentDictionary<Type, Delegate> _readers = new();

    public Delegate GetOrAddSerializer(Type type, DataStreamSerializerContext context)
    {
        ArgumentNullException.ThrowIfNull(type);
        ArgumentNullException.ThrowIfNull(context);

        var key = (type, context.Options.SerializeNulls);
        if (!_writers.TryGetValue(key, out Delegate? writer))
        {
            writer = _writers.GetOrAdd(key, t => CreateSerializerWriter(t.Item1, context));
        }
        return writer;
    }

    public Delegate GetOrAddDeserializer(Type type, DataStreamSerializerContext context)
    {
        ArgumentNullException.ThrowIfNull(type);
        ArgumentNullException.ThrowIfNull(context);

        if (!_readers.TryGetValue(type, out Delegate? reader))
        {
            reader = _readers.GetOrAdd(type, t => CreateDeserializerReader(t, context));
        }
        return reader;
    }

    private Delegate CreateDeserializerReader(Type type, DataStreamSerializerContext context)
    {
        var readerParameter = Expression.Parameter(typeof(DataStreamReader), "reader");

        Expression body = GetDeserializationExpression(type, readerParameter, context);

        LambdaExpression lambda = Expression.Lambda(body, readerParameter);
        return lambda.Compile();
    }

    private Expression GetDeserializationExpression(
        Type type, 
        Expression readerExpression, 
        DataStreamSerializerContext context)
    {
        throw new NotImplementedException();
    }

    private Delegate CreateSerializerWriter(Type type, DataStreamSerializerContext context)
    {
        var writerParameter = Expression.Parameter(typeof(DataStreamWriter), "writer");
        var itemParameter = Expression.Parameter(type, "item");
        
        Dictionary<string, int> propertyMap = new ();
        BlockExpression body = GetSerializationExpression(type, itemParameter, writerParameter, context, propertyMap);

        LambdaExpression lambda = Expression.Lambda(body, writerParameter, itemParameter);
        return lambda.Compile();
    }

    private BlockExpression GetSerializationExpression(
        Type itemType,
        Expression item,
        ParameterExpression writerParameter,
        DataStreamSerializerContext context,
        Dictionary<string,int> propertyMap)
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
                Expression writePropertyNameExpression = WritePropertyNameExpression(
                    property, 
                    propertyMap, 
                    writerParameter);

                Expression itemPropertyExpression = Expression.Property(item, property.Name);
                Type propertyType = property.PropertyType;

                if (IsScalar(propertyType))
                {
                    expressions.Add(Expression.Block(
                        writePropertyNameExpression,
                        WriteScalarPropertyExpression(
                            writerParameter,
                            itemPropertyExpression,
                            propertyType)));
                }
                else if(propertyType == typeof(byte[]))
                {
                    if (context.Options.SerializeNulls)
                    {
                        expressions.Add(
                            Expression.Block(
                                writePropertyNameExpression,
                                Expression.IfThenElse(
                                    Expression.NotEqual(itemPropertyExpression, Expression.Constant(null)),
                                    WriteScalarPropertyExpression(
                                        writerParameter,
                                        itemPropertyExpression,
                                        propertyType),
                                    Call<DataStreamWriter>(
                                        nameof(DataStreamWriter.WriteNull),
                                        [],
                                        writerParameter)
                                )
                        ));
                    }
                    else
                    {
                        expressions.Add(
                            Expression.IfThen(
                                Expression.NotEqual(itemPropertyExpression, Expression.Constant(null)),
                                Expression.Block(
                                    writePropertyNameExpression,
                                    WriteScalarPropertyExpression(
                                        writerParameter,
                                        itemPropertyExpression,
                                        propertyType)
                                )
                        ));
                    }
                }
                else if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                {
                    if (IsScalar(propertyType.GetGenericArguments()[0]))
                    {
                        if (context.Options.SerializeNulls)
                        {
                            expressions.Add(Expression.Block(
                                writePropertyNameExpression,
                                Expression.IfThenElse(
                                    Expression.NotEqual(itemPropertyExpression, Expression.Constant(null)),
                                    WriteScalarPropertyExpression(
                                        writerParameter,
                                        Expression.Property(itemPropertyExpression, "Value"),
                                        propertyType.GetGenericArguments()[0]
                                    ),
                                    Call<DataStreamWriter>(
                                        nameof(DataStreamWriter.WriteNull),
                                        [],
                                        writerParameter))
                                ));
                        }
                        else
                        {
                            expressions.Add(Expression.IfThen(
                                Expression.NotEqual(itemPropertyExpression, Expression.Constant(null)),
                                Expression.Block(
                                    writePropertyNameExpression,
                                    WriteScalarPropertyExpression(
                                        writerParameter,
                                        Expression.Property(itemPropertyExpression, "Value"),
                                        propertyType.GetGenericArguments()[0]))
                                ));
                        }
                    }
                    else
                    {
                        throw new InvalidOperationException($"cannot serialize {propertyType}");
                    }
                }
                else
                {
                    if (context.Options.SerializeNulls)
                    {
                        expressions.Add(
                            Expression.Block(
                                writePropertyNameExpression,
                                Expression.IfThenElse(
                                    Expression.NotEqual(itemPropertyExpression, Expression.Constant(null)),
                                    Expression.Block(
                                        Call<DataStreamWriter>(
                                            nameof(DataStreamWriter.WriteStartOfObject),
                                            Array.Empty<Type>(),
                                            writerParameter),
                                        GetSerializationExpression(
                                            propertyType,
                                            itemPropertyExpression,
                                            writerParameter,
                                            context,
                                            propertyMap),
                                        Call<DataStreamWriter>(
                                            nameof(DataStreamWriter.WriteEndOfObject),
                                            Array.Empty<Type>(),
                                            writerParameter)),
                                    Call<DataStreamWriter>(
                                        nameof(DataStreamWriter.WriteNull),
                                        [],
                                        writerParameter)
                                    )));
                    }
                    else
                    {
                        expressions.Add(Expression.IfThen(
                            Expression.NotEqual(itemPropertyExpression, Expression.Constant(null)),
                            Expression.Block(
                                writePropertyNameExpression,
                                Call<DataStreamWriter>(
                                    nameof(DataStreamWriter.WriteStartOfObject),
                                    Array.Empty<Type>(),
                                    writerParameter),
                                GetSerializationExpression(
                                    propertyType,
                                    itemPropertyExpression,
                                    writerParameter,
                                    context,
                                    propertyMap),
                                Call<DataStreamWriter>(
                                    nameof(DataStreamWriter.WriteEndOfObject),
                                    Array.Empty<Type>(),
                                    writerParameter)
                            )));
                    }
                }
            }
        }

        return Expression.Block(expressions);
    }

    private Expression WritePropertyNameExpression(
        PropertyInfo property,
        Dictionary<string, int> propertyNameMap,
        Expression writerParameter)
    {
        if (!propertyNameMap.TryGetValue(property.Name, out int propertyNameIndex))
        {
            propertyNameIndex = propertyNameMap.Count;
            propertyNameMap.Add(property.Name, propertyNameIndex);
            return Call<DataStreamWriter>(
                nameof(DataStreamWriter.WritePropertyName),
                [typeof(byte[])],
                writerParameter,
                Expression.Constant(Encoding.UTF8.GetBytes(property.Name)));
        }
        return Call<DataStreamWriter>(
            nameof(DataStreamWriter.WritePropertyIndex),
            [typeof(int)],
            writerParameter,
            Expression.Constant(propertyNameIndex));
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
            getPropertyValueExpression = Expression.Convert(
                getPropertyValueExpression,
                propertyType);
        }
        writePropertyValueExpression = Call<DataStreamWriter>(
                nameof(DataStreamWriter.Write),
                [propertyType],
                writerParameter,
                getPropertyValueExpression);
        return writePropertyValueExpression;
    }

    private MethodCallExpression Call<T>(
        string methodName,
        Type[] parameterTypes,
        Expression? instance,
        params Expression[] parameters)
    {
        MethodInfo? method = typeof(T).GetMethod(
            methodName,
            BindingFlags.Public | BindingFlags.Instance,
            parameterTypes) ?? throw new ArgumentException("undefined method", nameof(methodName));
        if (instance is null)
        {
            return Expression.Call(
                method,
                parameters);
        }
        return Expression.Call(
            instance,
            method,
            parameters);
    }

    private bool IsScalar(Type type)
    {
        return Type.GetTypeCode(type) switch
        {
            TypeCode.Int32 or
            TypeCode.Int16 or
            TypeCode.Boolean or
            TypeCode.String or
            TypeCode.DateTime or
            TypeCode.Byte or
            TypeCode.Int64 or
            TypeCode.Decimal or
            TypeCode.Double or
            TypeCode.Single => true,
            _ => false
        };
    }
}
