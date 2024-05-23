// <copyright file="DataStreamCompilerBase.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Linq.Expressions;
using System.Reflection;

namespace DataStream;

internal abstract class DataStreamCompilerBase
{
    protected DataStreamCompilerBase()
    {
    }

    protected MethodCallExpression Call<T>(
        string methodName,
        Type[] parameterTypes,
        Expression? instance,
        params Expression[] parameters)
    {
        MethodInfo? method = typeof(T).GetMethod(
            methodName,
            BindingFlags.Public | 
            BindingFlags.NonPublic | 
            (instance == null ? BindingFlags.Static : BindingFlags.Instance),
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

}
