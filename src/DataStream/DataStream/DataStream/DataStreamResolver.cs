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
    private readonly ConcurrentDictionary<Type, Delegate> _writers = new();
    private readonly ConcurrentDictionary<Type, Delegate> _readers = new();

    public Delegate GetOrAddWriter(Type type, DataStreamWriterContext context)
    {
        ArgumentNullException.ThrowIfNull(type);
        if (!_writers.TryGetValue(type, out Delegate? writer))
        {
            writer = _writers.GetOrAdd(type, t => CreateWriter(t, context));
        }
        return writer;
    }

    public DataStreamReader GetOrAddReader(Type type)
    {
        ArgumentNullException.ThrowIfNull(type);
        throw new NotImplementedException();
    }

    private Delegate CreateWriter(Type type, DataStreamWriterContext context)
    {
        PropertyInfo[] properties = type.GetProperties(
            BindingFlags.Public |
            BindingFlags.Instance |
            BindingFlags.GetProperty);

        var writerParameter = Expression.Parameter(typeof(DataStreamWriter), "writer");
        var contextParameter = Expression.Parameter(typeof(DataStreamWriterContext), "context");
        var itemParameter = Expression.Parameter(type, "item");

        List<Expression> expressions = new();

        for (int index = 0; index < properties.Length; ++index)
        {
            PropertyInfo property = properties[index];

            if (property.GetCustomAttribute<IgnoreAttribute>() == null)
            {
                if (!context.PropertyNameMap.TryGetValue(property.Name, out int propertyNameIndex))
                {
                    propertyNameIndex = context.PropertyNameMap.Count;
                    context.PropertyNameMap.Add(property.Name, propertyNameIndex);
                    MethodCallExpression writePropertyNameExpression = Call<DataStreamWriter>(
                        nameof(DataStreamWriter.WritePropertyName),
                        [typeof(string)],
                        writerParameter,
                        Expression.Constant(property.Name));
                    expressions.Add(writePropertyNameExpression);
                }

                MethodCallExpression writePropertyIndexExpression = Call<DataStreamWriter>(
                    nameof(DataStreamWriter.WritePropertyIndex),
                    [typeof(int)],
                    writerParameter,
                    Expression.Constant(propertyNameIndex));

                expressions.Add(writePropertyIndexExpression);

                Expression getPropertyValueExpression = Expression.Property(itemParameter, property.Name);
                Type propertyType = property.PropertyType;
                Expression writePropertyValueExpression;

                if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                {
                    if (IsScalar(propertyType.GetGenericArguments()[0]))
                    {
                        writePropertyValueExpression = WriteNullableScalarPropertyExpression(
                            writerParameter,
                            getPropertyValueExpression,
                            propertyType);
                    }
                    else
                    {
                        throw new InvalidOperationException($"cannot serialize {propertyType}");
                    }
                }
                else if(IsScalar(propertyType) || propertyType == typeof(byte[]))
                {
                    writePropertyValueExpression = WriteScalarPropertyExpression(
                        writerParameter, 
                        getPropertyValueExpression, 
                        propertyType);
                }
                else
                {
                    throw new NotImplementedException();
                }
                expressions.Add(writePropertyValueExpression);
            }
        }
        BlockExpression body = Expression.Block(expressions);
        LambdaExpression lambda = Expression.Lambda(body, writerParameter, contextParameter, itemParameter);
        return lambda.Compile();
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

    private Expression WriteNullableScalarPropertyExpression(
        ParameterExpression writerParameter, 
        Expression getPropertyValueExpression, 
        Type propertyType)
    {
        Expression writePropertyValueExpression;
        propertyType = propertyType.GetGenericArguments()[0];
        Expression hasValueExpression = Expression.Property(getPropertyValueExpression, "HasValue");
        getPropertyValueExpression = Expression.Property(getPropertyValueExpression, "Value");
        if (propertyType.IsEnum)
        {
            propertyType = propertyType.GetEnumUnderlyingType();
            getPropertyValueExpression = Expression.Convert(
                getPropertyValueExpression,
                propertyType);
        }
        writePropertyValueExpression = Expression.IfThenElse(
            hasValueExpression,
            Call<DataStreamWriter>(
                nameof(DataStreamWriter.Write),
                [propertyType],
                writerParameter,
                getPropertyValueExpression),
            Call<DataStreamWriter>(
                nameof(DataStreamWriter.WriteNull),
                [],
                writerParameter)
        );
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
            TypeCode.Double or
            TypeCode.Single => true,
            _ => false
        };
    }
}
