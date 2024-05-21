// <copyright file="DataStreamElementType.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace DataStream;

[Flags]
public enum DataStreamElementType : byte
{
    /// <summary>
    /// Control tags
    /// </summary>
    StartOfStream = 0b0000_0001,
    EndOfStream = 0b0000_0010,
    StartOfObject = 0b0000_0011,
    EndOfObject = 0b0000_0100,
    PropertyName = 0b0000_0101,
    PropertyIndex = 0b0000_0110,
    EndOfArray = 0b0000_0111,
    /// <summary>
    /// Scalar type tags
    /// </summary>
    Null = 0b0001_0000,
    False = 0b0001_0001,
    True = 0b0001_0010,
    Byte = 0b0001_0011,
    Int16 = 0b0001_0100,
    Int32 = 0b0001_0101,
    Int64 = 0b0001_0110,
    Double = 0b0001_0111,
    Single = 0b0001_1000,
    String = 0b0001_1001,
    DateTime = 0b0001_1010,
    Decimal = 0b0001_1011,
    Guid = 0b0001_1100,
    Object = 0b0001_1101,
    Boolean = 0b0001_1110,
    /// <summary>
    /// Enum flag
    /// </summary>
    Enum = 0b0010_0000,
    /// <summary>
    /// Array flag
    /// </summary>
    ArrayOf = 0b0100_0000,
    ElementTypeMask = 0b0001_1111,
    EnumTypeMask = 0b0001_1111
}

