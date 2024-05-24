// <copyright file="PropertyAttribute.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace DataStream;

[AttributeUsage(AttributeTargets.Property)]
public class PropertyAttribute : Attribute
{
    public PropertyAttribute()
    {

    }

    /// <summary>
    /// Property name
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Internable string property
    /// </summary>
    public bool Internable { get; set; }
}
