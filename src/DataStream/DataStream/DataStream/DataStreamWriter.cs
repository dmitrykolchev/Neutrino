// <copyright file="DataStreamWriter.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;

namespace DataStream;

public enum DataStreemTypeTag : byte
{
    Null,
    False,
    True,
    Byte,
    Int16,
    Int32,
    Int64,
    Double,
    Single,
    String,
    DateTime,
    ArrayOf,
    Object,
    PropertyName,
    PropertyIndex
}

public class DataStreamWriter
{
    private readonly Stream _stream;
    private readonly BinaryWriter _writer;

    public DataStreamWriter(Stream stream)
    {
        _stream = stream ?? throw new ArgumentNullException(nameof(stream));
        _writer = new BinaryWriter(stream, Encoding.UTF8, false);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WritePropertyName(string propertyName)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.PropertyName);
        _writer.Write(propertyName);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WritePropertyIndex(int propertyIndex)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.PropertyIndex);
        _writer.Write7BitEncodedInt(propertyIndex);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteNull()
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Null);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(byte[] item)
    {
        if (item is null)
        {
            _stream.WriteByte((byte)DataStreemTypeTag.Null);
        }
        else
        {
            _stream.WriteByte((byte)DataStreemTypeTag.ArrayOf);
            _stream.WriteByte((byte)DataStreemTypeTag.Byte);
            _writer.Write7BitEncodedInt(item.Length);
            _stream.Write(item, 0, item.Length);
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(bool item)
    {
        _stream.WriteByte(item ? (byte)DataStreemTypeTag.True : (byte)DataStreemTypeTag.False);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(byte item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Byte);
        _stream.WriteByte(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(short item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Int16);
        _stream.Write(MemoryMarshal.AsBytes(MemoryMarshal.CreateSpan(ref item, 1)));
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(int item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Int32);
        _writer.Write7BitEncodedInt(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(long item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Int64);
        _writer.Write7BitEncodedInt64(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(double item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Double);
        _writer.Write(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(float item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Single);
        _writer.Write(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(DateTime item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.DateTime);
        _writer.Write(item.ToBinary());
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(string? item)
    {
        if (item is null)
        {
            _stream.WriteByte((byte)DataStreemTypeTag.Null);
        }
        else
        {
            _stream.WriteByte((byte)DataStreemTypeTag.String);
            _writer.Write(item);
        }
    }
}

