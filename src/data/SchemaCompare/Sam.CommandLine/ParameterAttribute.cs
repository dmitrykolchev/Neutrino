// <copyright file="ParameterAttribute.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Sam.CommandLine;

[AttributeUsage(AttributeTargets.Property)]
public class ParameterAttribute : Attribute
{
    public bool Required { get; set; }

    public string? Name { get; set; }

    public string? ShortName { get; set; }

    public bool HasValue { get; set; } = true;

    public bool Multiple { get; set; }
}
