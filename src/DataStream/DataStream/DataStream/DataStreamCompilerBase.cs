// <copyright file="DataStreamCompilerBase.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Linq.Expressions;
using System.Reflection;

namespace DataStream;

internal abstract class DataStreamCompilerBase
{
    protected class PropertyMetadata
    {
        private readonly PropertyInfo _property;
        private string _streamName;
        private bool _internable;
        private bool _ignore;

        public PropertyMetadata(PropertyInfo property)
        {
            _property = property;
            PropertyAttribute? propertyAttribute = property.GetCustomAttribute<PropertyAttribute>();
            _streamName = propertyAttribute?.Name ?? property.Name;
            _internable = property.PropertyType == typeof(string) && (propertyAttribute?.Internable ?? false);
            _ignore = property.GetCustomAttribute<IgnoreAttribute>() != null;
        }

        public bool Ignore => _ignore;

        public PropertyInfo Property => _property;

        public string StreamName => _streamName;

        public bool Internable => _internable;

        public bool IsNullable() => Property.PropertyType.IsNullable();

        public bool IsBinary() => Property.PropertyType == typeof(byte[]);

        public bool IsSimple() => Property.PropertyType.IsScalar() || Property.PropertyType == typeof(Guid);
    }


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
