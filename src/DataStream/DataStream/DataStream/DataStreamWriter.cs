// <copyright file="DataStreamWriter.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;
using System.Text;
using System.Xml;

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
    Object
}

public class DataStreamWriter
{
    private Stream _stream;
    private BinaryWriter _writer;

    public DataStreamWriter(Stream stream)
    {
        _stream = stream ?? throw new ArgumentNullException(nameof(stream));
        _writer = new BinaryWriter(stream, Encoding.UTF8, false);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WritePropertyName(DataStreamWriterContext context, string propertyName)
    {
        if (context.PropertyNameMap.TryGetValue(propertyName, out int value))
        {
            _writer.Write(value);
        }
        else
        {
            context.PropertyNameMap.Add(propertyName, context.PropertyNameMap.Count);
            _writer.Write(propertyName);
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(bool item)
    {
        _writer.Write(item ? (byte)DataStreemTypeTag.True : (byte)DataStreemTypeTag.False);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(byte item)
    {
        _writer.Write((byte)DataStreemTypeTag.Byte);
        _writer.Write(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(short item)
    {
        _writer.Write((byte)DataStreemTypeTag.Int16);
        _writer.Write(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(int item)
    {
        _writer.Write((byte)DataStreemTypeTag.Int32);
        _writer.Write7BitEncodedInt(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(long item)
    {
        _writer.Write((byte)DataStreemTypeTag.Int64);
        _writer.Write7BitEncodedInt64(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(double item)
    {
        _writer.Write((byte)DataStreemTypeTag.Double);
        _writer.Write(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(float item)
    {
        _writer.Write((byte)DataStreemTypeTag.Single);
        _writer.Write(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(DateTime item)
    {
        string text = XmlConvert.ToString(item, XmlDateTimeSerializationMode.Utc);
        _writer.Write((byte)DataStreemTypeTag.DateTime);
        _writer.Write7BitEncodedInt(text.Length);
        _writer.Write(text.AsSpan());
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(string? item)
    {
        if (item is null)
        {
            _writer.Write((byte)DataStreemTypeTag.Null);
        }
        else
        {
            _writer.Write((byte)DataStreemTypeTag.String);
            _writer.Write7BitEncodedInt(item.Length);
            _writer.Write(item.AsSpan());
        }
    }
}

