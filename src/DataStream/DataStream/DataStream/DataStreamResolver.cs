// <copyright file="DataStreamResolver.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;

namespace DataStream;

public class DataStreamResolver
{
    private readonly ConcurrentDictionary<Type, Delegate> _writers = new();
    private readonly ConcurrentDictionary<Type, Delegate> _readers = new();

    public Delegate GetOrAddWriter(Type type)
    {
        ArgumentNullException.ThrowIfNull(type);
        if (!_writers.TryGetValue(type, out Delegate? writer))
        {
            writer = _writers.GetOrAdd(type, t => CreateWriter(t));
        }
        return writer;
    }

    public DataStreamReader GetOrAddReader(Type type)
    {
        ArgumentNullException.ThrowIfNull(type);
        throw new NotImplementedException();
    }

    private Delegate CreateWriter(Type type)
    {
        return CreateCustomWriter(type);
        //TypeCode code = Type.GetTypeCode(type);
        //return code switch
        //{
        //    TypeCode.Boolean => BooleanWriter,
        //    TypeCode.Byte => ByteWriter,
        //    TypeCode.Int16 => Int16Writer,
        //    TypeCode.Int32 => Int32Writer,
        //    TypeCode.Int64 => Int64Writer,
        //    TypeCode.Double => DoubleWriter,
        //    TypeCode.Single => SingleWriter,
        //    TypeCode.DateTime => DateTimeWriter,
        //    TypeCode.String => StringWriter,
        //    _ => CreateCustomWriter(type)
        //};
    }

    private Delegate CreateCustomWriter(Type type)
    {
        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
        {
            return CreateNullableTypeWriter(type.GetGenericArguments()[0]);
        }
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
                MethodInfo? writePropertyNameMethod = typeof(DataStreamWriter).GetMethod(
                    nameof(DataStreamWriter.WritePropertyName),
                    BindingFlags.Public | BindingFlags.Instance,
                    [typeof(DataStreamWriterContext), typeof(string)]);
                MethodCallExpression writePropertyNameExpression = Expression.Call(
                    writerParameter,
                    writePropertyNameMethod!,
                    contextParameter,
                    Expression.Constant(property.Name));
                expressions.Add(writePropertyNameExpression);

                Expression getPropertyValueExpression;
                Type underlyingType;
                if (property.PropertyType.IsEnum)
                {
                    underlyingType = property.PropertyType.GetEnumUnderlyingType();
                    getPropertyValueExpression = Expression.Convert(
                        Expression.Property(itemParameter, property.Name),
                        underlyingType);
                }
                else
                {
                    underlyingType = property.PropertyType;
                    getPropertyValueExpression = Expression.Property(itemParameter, property.Name);
                }
                MethodInfo? method = typeof(DataStreamWriter).GetMethod(
                    "Write",
                    BindingFlags.Instance | BindingFlags.Public,
                    [underlyingType]);
                MethodCallExpression writePropertyValueExpression = Expression.Call(
                    writerParameter,
                    method!,
                    getPropertyValueExpression);
                expressions.Add(writePropertyValueExpression);
            }
        }
        BlockExpression body = Expression.Block(expressions);
        LambdaExpression lambda = Expression.Lambda(body, writerParameter, contextParameter, itemParameter);
        return lambda.Compile();
    }

    private Delegate CreateNullableTypeWriter(Type type)
    {
        throw new NotImplementedException();
    }
}
