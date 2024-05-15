// <copyright file="DataStreamReaderCompiler.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;

namespace DataStream;

internal class DataStreamReaderCompiler : DataStreamCompilerBase
{
    private readonly ConcurrentDictionary<Type, Delegate> _readers = new();

    public Delegate GetOrAdd(Type type, DataStreamSerializerContext context)
    {
        ArgumentNullException.ThrowIfNull(type);
        ArgumentNullException.ThrowIfNull(context);

        if (!_readers.TryGetValue(type, out Delegate? reader))
        {
            reader = _readers.GetOrAdd(type, t => Create(t, context));
        }
        return reader;
    }

    private Delegate Create(Type type, DataStreamSerializerContext context)
    {

        ParameterExpression readerParameter = Expression.Parameter(typeof(DataStreamReader), "reader");

        Expression body = GetExpression(type, readerParameter, context);

        LambdaExpression lambda = Expression.Lambda(body, readerParameter);
        return lambda.Compile();
    }

    private Expression GetExpression(
        Type type,
        Expression readerExpression,
        DataStreamSerializerContext context)
    {
        Expression readElementType = ReadElementTypeExpression(readerExpression);

        ParameterExpression result = Expression.Variable(type, "root");

        Expression elementType = Expression.Property(readerExpression, nameof(DataStreamReader.ElementType));

        Expression checkStartOfStream = Expression.IfThen(
                Expression.NotEqual(elementType, Expression.Constant(DataStreamElementType.StartOfStream)),
                Expression.Throw(Expression.New(typeof(FormatException)))
            );

        Expression readObject = Expression.Assign(
            result,
            ReadObjectExpression(type, readerExpression, context)
        );

        Expression checkEndOfStream = Expression.IfThen(
                Expression.NotEqual(elementType, Expression.Constant(DataStreamElementType.EndOfStream)),
                Expression.Throw(Expression.New(typeof(FormatException)))
            );

        return Expression.Block(
            [result],
            readElementType,
            checkStartOfStream,
            readObject,
            checkEndOfStream,
            result
        );
    }

    private Expression ReadObjectExpression(
        Type type,
        Expression readerExpression,
        DataStreamSerializerContext context)
    {
        PropertyInfo[] properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.SetProperty);

        ParameterExpression result = Expression.Variable(type, "inner");
        Expression newInstance = Expression.Assign(
            result,
            Expression.New(type)
        );
        Expression readElementType = ReadElementTypeExpression(readerExpression);
        Expression elementType = Expression.Property(readerExpression, nameof(DataStreamReader.ElementType));

        Expression checkEndOfObject = Expression.IfThen(
                Expression.AndAlso(
                    Expression.NotEqual(elementType, Expression.Constant(DataStreamElementType.EndOfStream)),
                    Expression.NotEqual(elementType, Expression.Constant(DataStreamElementType.EndOfObject))
                ),
                Expression.Throw(Expression.New(typeof(FormatException)))
            );

        return Expression.Block(
            [result],
            newInstance,
            readElementType,
            checkEndOfObject,
            result
        );
    }

    private Expression ReadElementTypeExpression(Expression readerExpression)
    {
        return Call<DataStreamReader>(
            nameof(DataStreamReader.ReadElementType),
            Array.Empty<Type>(),
            readerExpression);
    }
}
