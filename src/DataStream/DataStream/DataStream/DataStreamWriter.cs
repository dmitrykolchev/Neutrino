// <copyright file="DataStreamWriter.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Buffers;
using System.Collections;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;

namespace DataStream;

internal partial class DataStreamWriter : IDisposable
{
    private const int MaxArrayPoolRentalSize = 64 * 1024; // try to keep rentals to a reasonable size

    private readonly BinaryBuffer _stream;
    private readonly byte[] _buffer;
    private readonly DataStreamSerializerContext _context;

    public DataStreamWriter(Stream stream, DataStreamSerializerContext context)
    {
        ArgumentNullException.ThrowIfNull(stream);
        _buffer = ArrayPool<byte>.Shared.Rent(4096);
        _stream = new BinaryBuffer(stream, _buffer);
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public void Dispose()
    {
        _stream.Flush();
        ArrayPool<byte>.Shared.Return(_buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteProperty(int streamIndex)
    {
        if (_context.PropertyMap.UseIndex(streamIndex))
        {
            _stream.WriteByte((byte)DataStreamElementType.PropertyName);
            Write7BitEncodedInt32(streamIndex);
            Utf8String propertyName = _context.PropertyMap.Get(streamIndex);
            Write7BitEncodedInt32(propertyName.Length);
            _stream.Write(propertyName.AsSpan());
        }
        else
        {
            _stream.WriteByte((byte)DataStreamElementType.PropertyIndex);
            Write7BitEncodedInt32(streamIndex);
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteNull()
    {
        _stream.WriteByte((byte)DataStreamElementType.Null);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteStartOfStream()
    {
        _stream.WriteByte((byte)DataStreamElementType.StartOfStream);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteEndOfStream()
    {
        _stream.WriteByte((byte)DataStreamElementType.EndOfStream);
    }


    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteStartOfObject()
    {
        _stream.WriteByte((byte)DataStreamElementType.StartOfObject);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteEndOfObject()
    {
        _stream.WriteByte((byte)DataStreamElementType.EndOfObject);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(byte[] item)
    {
        if (item is null)
        {
            _stream.WriteByte((byte)DataStreamElementType.Null);
        }
        else
        {
            _stream.WriteByte((byte)(DataStreamElementType.ArrayOf | DataStreamElementType.Byte));
            Write7BitEncodedInt32(item.Length);
            _stream.Write(item, 0, item.Length);
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(Guid item)
    {
        _stream.WriteByte((byte)DataStreamElementType.Guid);
        Span<byte> buffer = stackalloc byte[16];
        if (!item.TryWriteBytes(buffer, true, out int bytesWritten))
        {
            throw new InvalidOperationException();
        }
        _stream.Write(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(bool item)
    {
        _stream.WriteByte(item ? (byte)DataStreamElementType.True : (byte)DataStreamElementType.False);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteEnum(byte item)
    {
        Span<byte> buffer = stackalloc byte[2];
        buffer[0] = (byte)(DataStreamElementType.Byte | DataStreamElementType.Enum);
        buffer[1] = item;
        _stream.Write(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteEnum(short item)
    {
        _stream.WriteByte((byte)(DataStreamElementType.Int16 | DataStreamElementType.Enum));
        _stream.Write(MemoryMarshal.AsBytes(MemoryMarshal.CreateSpan(ref item, 1)));
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void WriteEnum(int item)
    {
        _stream.WriteByte((byte)(DataStreamElementType.Int32 | DataStreamElementType.Enum));
        Write7BitEncodedInt32(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(byte item)
    {
        Span<byte> buffer = stackalloc byte[2];
        buffer[0] = (byte)DataStreamElementType.Byte;
        buffer[1] = item;
        _stream.Write(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(short item)
    {
        _stream.WriteByte((byte)DataStreamElementType.Int16);
        _stream.Write(MemoryMarshal.AsBytes(MemoryMarshal.CreateSpan(ref item, 1)));
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(int item)
    {
        _stream.WriteByte((byte)DataStreamElementType.Int32);
        Write7BitEncodedInt32(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(long item)
    {
        _stream.WriteByte((byte)DataStreamElementType.Int64);
        Write7BitEncodedInt64(item);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(decimal item)
    {
        _stream.WriteByte((byte)DataStreamElementType.Decimal);
        Span<int> data = stackalloc int[4];
        decimal.GetBits(item, data);
        _stream.Write(MemoryMarshal.AsBytes(data));
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(double item)
    {
        _stream.WriteByte((byte)DataStreamElementType.Double);
        _stream.Write(MemoryMarshal.AsBytes(MemoryMarshal.CreateSpan(ref item, 1)));
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(float item)
    {
        _stream.WriteByte((byte)DataStreamElementType.Single);
        _stream.Write(MemoryMarshal.AsBytes(MemoryMarshal.CreateSpan(ref item, 1)));
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Write(DateTime item)
    {
        _stream.WriteByte((byte)DataStreamElementType.DateTime);
        long data = item.ToBinary();
        _stream.Write(MemoryMarshal.AsBytes(MemoryMarshal.CreateSpan(ref data, 1)));
    }

    public void Write(string? value)
    {
        if (value is null)
        {
            _stream.WriteByte((byte)DataStreamElementType.Null);
        }
        else
        {
            _stream.WriteByte((byte)DataStreamElementType.String);

            if (value.Length <= 127 / 3)
            {
                // Max expansion: each char -> 3 bytes, so 127 bytes max of data, +1 for length prefix
                Span<byte> buffer = stackalloc byte[128];
                int actualByteCount = DataStreamSerializer.UTF8.GetBytes(value, buffer.Slice(1));
                buffer[0] = (byte)actualByteCount; // bypass call to Write7BitEncodedInt
                _stream.Write(buffer.Slice(0, actualByteCount + 1 /* length prefix */));
            }
            else if (value.Length <= MaxArrayPoolRentalSize / 3)
            {
                byte[] rented = ArrayPool<byte>.Shared.Rent(value.Length * 3); // max expansion: each char -> 3 bytes
                int actualByteCount = DataStreamSerializer.UTF8.GetBytes(value, rented);
                Write7BitEncodedInt32(actualByteCount);
                _stream.Write(rented, 0, actualByteCount);
                ArrayPool<byte>.Shared.Return(rented);
            }
            else
            {
                int actualBytecount = DataStreamSerializer.UTF8.GetByteCount(value);
                Write7BitEncodedInt32(actualBytecount);
                // We're dealing with an enormous amount of data, so acquire an Encoder.
                // It should be rare that callers pass sufficiently large inputs to hit
                // this code path, and the cost of the operation is dominated by the transcoding
                // step anyway, so it's ok for us to take the allocation here.
                byte[] rented = ArrayPool<byte>.Shared.Rent(MaxArrayPoolRentalSize);
                Encoder encoder = DataStreamSerializer.UTF8.GetEncoder();
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

    private void Write7BitEncodedInt32(int value)
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

    public void Write(IEnumerable? value)
    {
        if(value is null)
        {
            WriteNull();
        }
        else
        {
            Write((byte)DataStreamElementType.ArrayOf);
            Write((byte)DataStreamElementType.Object);
            foreach (object item in value)
            {
                DataStreamSerializer.Serialize(this, item, _context);
            }
            Write((byte)DataStreamElementType.EndOfArray);
        }
    }
}
