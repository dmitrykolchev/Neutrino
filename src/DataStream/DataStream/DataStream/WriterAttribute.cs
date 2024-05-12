// <copyright file="WriterAttribute.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace DataStream;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
public class WriterAttribute : Attribute
{
    public WriterAttribute(Type writerType)
    {
        Type = writerType;
    }

    public Type Type { get; }
}
