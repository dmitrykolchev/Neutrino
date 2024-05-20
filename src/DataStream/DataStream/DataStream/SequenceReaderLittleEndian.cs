// <copyright file="SequenceReaderLittleEndian.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace DataStream;

internal struct SequenceReaderLittleEndian : ISequenceReader
{
    private readonly ArraySegment<byte> _data;
    private int _position;

    public SequenceReaderLittleEndian(ArraySegment<byte> data)
    {
        _data = data;
        _position = 0;
    }

    public readonly int Position => _position;

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte ReadByte()
    {
        return _data[_position++];
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public void Read(byte[] buffer, int offset, int count)
    {
        _data.Slice(_position, count).CopyTo(buffer, offset);
        _position += count;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public short ReadInt16()
    {
        short value = MemoryMarshal.Read<short>(_data.Slice(_position, sizeof(short)));
        _position += sizeof(short);
        return value;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int ReadInt32()
    {
        int value = MemoryMarshal.Read<int>(_data.Slice(_position, sizeof(int)));
        _position += sizeof(int);
        return value;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public long ReadInt64()
    {
        long value = MemoryMarshal.Read<long>(_data.Slice(_position, sizeof(long)));
        _position += sizeof(long);
        return value;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public double ReadDouble()
    {
        double value = MemoryMarshal.Read<double>(_data.Slice(_position, sizeof(double)));
        _position += sizeof(double);
        return value;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public float ReadSingle()
    {
        float value = MemoryMarshal.Read<float>(_data.Slice(_position, sizeof(float)));
        _position += sizeof(float);
        return value;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Guid ReadGuid()
    {
        Guid value = new(_data.Slice(_position, 16), true);
        _position += 16;
        return value;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public decimal ReadDecimal()
    {
        Span<int> data = stackalloc int[4];
        _data.Slice(_position, sizeof(int) * 4).AsSpan().CopyTo(MemoryMarshal.AsBytes(data));
        _position += sizeof(int) * 4;
        return new decimal(data);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public string ReadString()
    {
        int length = Read7BitEncodedInt32();
        string value = DataStreamSerializer.UTF8.GetString(_data.Slice(_position, length));
        _position += length;
        return value;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] ReadBinary8()
    {
        int length = _data[_position];
        byte[] value = new byte[length];
        _data.Slice(_position + 1, length).CopyTo(value);
        _position += length + 1;
        return value;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] ReadBinary()
    {
        int length = Read7BitEncodedInt32();
        byte[] value = new byte[length];
        _data.Slice(_position, length).CopyTo(value);
        _position += length;
        return value;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int Read7BitEncodedInt32()
    {
        // Unlike writing, we can't delegate to the 64-bit read on
        // 64-bit platforms. The reason for this is that we want to
        // stop consuming bytes if we encounter an integer overflow.

        uint result = 0;
        byte byteReadJustNow;

        // Read the integer 7 bits at a time. The high bit
        // of the byte when on means to continue reading more bytes.
        //
        // There are two failure cases: we've read more than 5 bytes,
        // or the fifth byte is about to cause integer overflow.
        // This means that we can read the first 4 bytes without
        // worrying about integer overflow.

        const int MaxBytesWithoutOverflow = 4;
        for (int shift = 0; shift < MaxBytesWithoutOverflow * 7; shift += 7)
        {
            // ReadByte handles end of stream cases for us.
            byteReadJustNow = _data[_position++];
            result |= (byteReadJustNow & 0x7Fu) << shift;

            if (byteReadJustNow <= 0x7Fu)
            {
                return (int)result; // early exit
            }
        }

        // Read the 5th byte. Since we already read 28 bits,
        // the value of this byte must fit within 4 bits (32 - 28),
        // and it must not have the high bit set.

        byteReadJustNow = _data[_position++];
        if (byteReadJustNow > 0b_1111u)
        {
            throw new FormatException("bad 7-bit integer");
        }

        result |= (uint)byteReadJustNow << (MaxBytesWithoutOverflow * 7);
        return (int)result;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public long Read7BitEncodedInt64()
    {
        ulong result = 0;
        byte byteReadJustNow;

        // Read the integer 7 bits at a time. The high bit
        // of the byte when on means to continue reading more bytes.
        //
        // There are two failure cases: we've read more than 10 bytes,
        // or the tenth byte is about to cause integer overflow.
        // This means that we can read the first 9 bytes without
        // worrying about integer overflow.

        const int MaxBytesWithoutOverflow = 9;
        for (int shift = 0; shift < MaxBytesWithoutOverflow * 7; shift += 7)
        {
            // ReadByte handles end of stream cases for us.
            byteReadJustNow = _data[_position++];
            result |= (byteReadJustNow & 0x7Ful) << shift;

            if (byteReadJustNow <= 0x7Fu)
            {
                return (long)result; // early exit
            }
        }

        // Read the 10th byte. Since we already read 63 bits,
        // the value of this byte must fit within 1 bit (64 - 63),
        // and it must not have the high bit set.

        byteReadJustNow = _data[_position++];
        if (byteReadJustNow > 0b_1u)
        {
            throw new FormatException("bad 7-bit integer");
        }

        result |= (ulong)byteReadJustNow << (MaxBytesWithoutOverflow * 7);
        return (long)result;
    }
}
