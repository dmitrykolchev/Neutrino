// <copyright file="TypeInfoExtensions.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Reflection;

namespace DataStream;

internal static class TypeInfoExtensions
{
    public static bool IsScalar(this Type type)
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

    public static bool IsNullable(this Type type)
    {
        return type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>);
    }

    public static Type FindElementType(this Type type)
    {
        if(type.IsArray)
        {
            return type.GetElementType()!;
        }
        foreach (Type interfaceType in type.GetInterfaces())
        {
            Type genericType = type.GetGenericTypeDefinition();
            if (genericType == typeof(IList<>) || genericType == typeof(IEnumerable<>))
            {
                return type.GetGenericArguments()[0];
            }
        }
        throw new InvalidOperationException($"unsupported collection type {type}");
    }
}
