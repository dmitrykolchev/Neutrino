// <copyright file="DataStreamWriter.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Buffers;
using System.Buffers.Binary;
using System.Runtime.CompilerServices;
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
    Decimal,
    ArrayOf,
    StartOfObject,
    EndOfObject,
    PropertyName,
    PropertyIndex
}

public class DataStreamWriter
{
    private const int MaxArrayPoolRentalSize = 64 * 1024; // try to keep rentals to a reasonable size

    private readonly Stream _stream;
    private readonly Encoding _encoding;

    public DataStreamWriter(Stream stream)
    {
        _stream = stream ?? throw new ArgumentNullException(nameof(stream));
        _encoding = Encoding.UTF8;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WritePropertyName(byte[] propertyName)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.PropertyName);
        Write7BitEncodedInt(propertyName.Length);
        _stream.Write(propertyName, 0, propertyName.Length);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WritePropertyIndex(int propertyIndex)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.PropertyIndex);
        Write7BitEncodedInt(propertyIndex);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteNull()
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Null);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteStartOfObject()
    {
        _stream.WriteByte((byte)DataStreemTypeTag.StartOfObject);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteEndOfObject()
    {
        _stream.WriteByte((byte)DataStreemTypeTag.EndOfObject);
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
            Write7BitEncodedInt(item.Length);
            _stream.Write(item, 0, item.Length);
        }
    }

    public void Write(Guid item)
    {
        Span<byte> data = stackalloc byte[16];
        if (!item.TryWriteBytes(data, true, out int bytesWritten))
        {
            throw new InvalidOperationException();
        }
        _stream.Write(data);
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
        ushort uitem = (ushort)item;
        _stream.WriteByte((byte)(uitem & 0xFF));
        uitem >>= 8;
        _stream.WriteByte((byte)(uitem & 0xFF));
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(int item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Int32);
        Write7BitEncodedInt(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(long item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Int64);
        Write7BitEncodedInt64(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(decimal item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Decimal);
        Span<int> data = stackalloc int[4];
        decimal.GetBits(item, data);
        Span<byte> buffer = stackalloc byte[sizeof(int)];
        BinaryPrimitives.WriteInt32BigEndian(buffer, data[0]);
        _stream.Write(buffer);
        BinaryPrimitives.WriteInt32BigEndian(buffer, data[1]);
        _stream.Write(buffer);
        BinaryPrimitives.WriteInt32BigEndian(buffer, data[2]);
        _stream.Write(buffer);
        BinaryPrimitives.WriteInt32BigEndian(buffer, data[3]);
        _stream.Write(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(double item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Double);
        Span<byte> buffer = stackalloc byte[sizeof(double)];
        BinaryPrimitives.WriteDoubleBigEndian(buffer, item);
        _stream.Write(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(float item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.Single);
        _stream.WriteByte((byte)DataStreemTypeTag.Double);
        Span<byte> buffer = stackalloc byte[sizeof(float)];
        BinaryPrimitives.WriteSingleBigEndian(buffer, item);
        _stream.Write(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(DateTime item)
    {
        _stream.WriteByte((byte)DataStreemTypeTag.DateTime);
        Span<byte> buffer = stackalloc byte[sizeof(long)];
        BinaryPrimitives.WriteInt64BigEndian(buffer, item.ToBinary());
        _stream.Write(buffer);
    }

    public void Write(string? value)
    {
        if (value is null)
        {
            _stream.WriteByte((byte)DataStreemTypeTag.Null);
        }
        else
        {
            _stream.WriteByte((byte)DataStreemTypeTag.String);

            if (value.Length <= 127 / 3)
            {
                // Max expansion: each char -> 3 bytes, so 127 bytes max of data, +1 for length prefix
                Span<byte> buffer = stackalloc byte[128];
                int actualByteCount = _encoding.GetBytes(value, buffer.Slice(1));
                buffer[0] = (byte)actualByteCount; // bypass call to Write7BitEncodedInt
                _stream.Write(buffer.Slice(0, actualByteCount + 1 /* length prefix */));
            }
            else if (value.Length <= MaxArrayPoolRentalSize / 3)
            {
                byte[] rented = ArrayPool<byte>.Shared.Rent(value.Length * 3); // max expansion: each char -> 3 bytes
                int actualByteCount = _encoding.GetBytes(value, rented);
                Write7BitEncodedInt(actualByteCount);
                _stream.Write(rented, 0, actualByteCount);
                ArrayPool<byte>.Shared.Return(rented);
            }
            else
            {
                int actualBytecount = _encoding.GetByteCount(value);
                Write7BitEncodedInt(actualBytecount);
                // We're dealing with an enormous amount of data, so acquire an Encoder.
                // It should be rare that callers pass sufficiently large inputs to hit
                // this code path, and the cost of the operation is dominated by the transcoding
                // step anyway, so it's ok for us to take the allocation here.
                byte[] rented = ArrayPool<byte>.Shared.Rent(MaxArrayPoolRentalSize);
                Encoder encoder = _encoding.GetEncoder();
                bool completed;

                ReadOnlySpan<char> chars = value;
                do
                {
                    encoder.Convert(chars, rented, flush: true, out int charsConsumed, out int bytesWritten, out completed);
                    if (bytesWritten != 0)
                    {
                        _stream.Write(rented, 0, bytesWritten);
                    }
                    chars = chars.Slice(charsConsumed);
                } while (!completed);
                ArrayPool<byte>.Shared.Return(rented);
            }
        }
    }

    private void Write7BitEncodedInt(int value)
    {
        uint uValue = (uint)value;

        // Write out an int 7 bits at a time. The high bit of the byte,
        // when on, tells reader to continue reading more bytes.
        //
        // Using the constants 0x7F and ~0x7F below offers smaller
        // codegen than using the constant 0x80.

        while (uValue > 0x7Fu)
        {
            _stream.WriteByte((byte)(uValue | ~0x7Fu));
            uValue >>= 7;
        }

        _stream.WriteByte((byte)uValue);
    }

    private void Write7BitEncodedInt64(long value)
    {
        ulong uValue = (ulong)value;

        // Write out an int 7 bits at a time. The high bit of the byte,
        // when on, tells reader to continue reading more bytes.
        //
        // Using the constants 0x7F and ~0x7F below offers smaller
        // codegen than using the constant 0x80.

        while (uValue > 0x7Fu)
        {
            _stream.WriteByte((byte)((uint)uValue | ~0x7Fu));
            uValue >>= 7;
        }

        _stream.WriteByte((byte)uValue);
    }
}

