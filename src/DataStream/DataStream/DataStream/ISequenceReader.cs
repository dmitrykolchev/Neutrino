// <copyright file="ISequenceReader.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;

namespace DataStream;

internal interface ISequenceReader
{
    int Position { get; }
    byte ReadByte();
    void Read(byte[] buffer, int offset, int count);
    short ReadInt16();
    int ReadInt32();
    long ReadInt64();
    double ReadDouble();
    float ReadSingle();
    Guid ReadGuid();
    decimal ReadDecimal();
    string ReadString();
    string ReadStringIntern();
    Utf8String ReadProperty();
    byte[] ReadBinary();
    int Read7BitEncodedInt32();
    long Read7BitEncodedInt64();
}
