// <copyright file="IgnoreAttribute.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace DataStream;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
public class IgnoreAttribute : Attribute
{
}
