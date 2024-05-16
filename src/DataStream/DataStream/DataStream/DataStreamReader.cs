// <copyright file="DataStreamReader.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Buffers;
using System.Buffers.Binary;
using System.Runtime.CompilerServices;
using System.Text;

namespace DataStream;

internal class DataStreamReader
{
    private readonly Stream _stream;
    private readonly Encoding _encoding;
    private readonly Dictionary<string, int> _nameToIndex = new();
    private readonly Dictionary<int, string> _indexToName = new();
    private DataStreamElementType _elementType;

    public DataStreamReader(Stream stream)
    {
        ArgumentNullException.ThrowIfNull(stream);
        _stream = stream ?? throw new ArgumentNullException(nameof(stream));
        _encoding = Encoding.UTF8;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public DataStreamElementType ReadElementType()
    {
        _elementType = (DataStreamElementType)InternalReadByte();
        return _elementType;
    }

    public DataStreamElementType ElementType => _elementType;

    public string ReadProperty()
    {
        return ReadProperty(out _);
    }

    public string ReadProperty(out int propertyIndex)
    {
        if (ElementType == DataStreamElementType.PropertyIndex)
        {
            propertyIndex = ReadInt32();
            return _indexToName[propertyIndex];
        }
        else if (ElementType == DataStreamElementType.PropertyName)
        {
            string propertyName = ReadString();
            propertyIndex = _nameToIndex.Count;
            _nameToIndex.Add(propertyName, propertyIndex);
            _indexToName.Add(propertyIndex, propertyName);
            return propertyName;
        }
        else
        {
            throw new FormatException("unexpected tag");
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public bool ReadBoolean()
    {
        return ElementType switch
        {
            DataStreamElementType.True => true,
            DataStreamElementType.False => false,
            _ => throw new FormatException()
        };
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte ReadByte()
    {
        if(ElementType != DataStreamElementType.Byte)
        {
            throw new FormatException();
        }
        return InternalReadByte();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int ReadInt16()
    {
        if (ElementType != DataStreamElementType.Int16)
        {
            throw new FormatException();
        }
        Span<byte> buffer = stackalloc byte[sizeof(short)];
        _stream.ReadExactly(buffer);
        return BinaryPrimitives.ReadInt16BigEndian(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int ReadInt32()
    {
        if (ElementType != DataStreamElementType.Int32)
        {
            throw new FormatException();
        }
        return Read7BitEncodedInt32();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public long ReadInt64()
    {
        if (ElementType != DataStreamElementType.Int64)
        {
            throw new FormatException();
        }
        return Read7BitEncodedInt64();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public double ReadDouble()
    {
        if (ElementType != DataStreamElementType.Double)
        {
            throw new FormatException();
        }
        Span<byte> buffer = stackalloc byte[sizeof(double)];
        _stream.ReadExactly(buffer);
        return BinaryPrimitives.ReadDoubleBigEndian(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public double ReadSingle()
    {
        if (ElementType != DataStreamElementType.Single)
        {
            throw new FormatException();
        }
        Span<byte> buffer = stackalloc byte[sizeof(float)];
        _stream.ReadExactly(buffer);
        return BinaryPrimitives.ReadDoubleBigEndian(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public DateTime ReadDateTime()
    {
        if (ElementType != DataStreamElementType.DateTime)
        {
            throw new FormatException();
        }
        Span<byte> buffer = stackalloc byte[sizeof(long)];
        _stream.ReadExactly(buffer);
        long value = BinaryPrimitives.ReadInt64BigEndian(buffer);
        return DateTime.FromBinary(value);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Guid ReadGuid()
    {
        if (ElementType != DataStreamElementType.Guid)
        {
            throw new FormatException();
        }
        Span<byte> buffer = stackalloc byte[16];
        _stream.ReadExactly(buffer);
        return new Guid(buffer, true);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public decimal ReadDecimal()
    {
        if (ElementType != DataStreamElementType.Decimal)
        {
            throw new FormatException();
        }
        Span<int> data = stackalloc int[4];

        Span<byte> buffer = stackalloc byte[sizeof(int)];
        _stream.ReadExactly(buffer);
        data[0] = BinaryPrimitives.ReadInt32BigEndian(buffer);
        _stream.ReadExactly(buffer);
        data[1] = BinaryPrimitives.ReadInt32BigEndian(buffer);
        _stream.ReadExactly(buffer);
        data[2] = BinaryPrimitives.ReadInt32BigEndian(buffer);
        _stream.ReadExactly(buffer);
        data[3] = BinaryPrimitives.ReadInt32BigEndian(buffer);
        return new decimal(data);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] ReadBinary()
    {
        if (ElementType != (DataStreamElementType.ArrayOf | DataStreamElementType.Byte))
        {
            throw new FormatException();
        }
        int length = Read7BitEncodedInt32();
        byte[] buffer = new byte[length];
        _stream.ReadExactly(buffer);
        return buffer;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public string ReadString()
    {
        if (ElementType != DataStreamElementType.String)
        {
            throw new FormatException();
        }
        int length = Read7BitEncodedInt32();
        byte[] buffer = ArrayPool<byte>.Shared.Rent(length);
        _stream.ReadExactly(buffer, 0, length);
        return _encoding.GetString(buffer, 0, length);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)] // Inlined to avoid some method call overhead with InternalRead.
    private byte InternalReadByte()
    {
        int b = _stream.ReadByte();
        if (b == -1)
        {
            throw new InvalidOperationException("unexpected end of stream reached");
        }
        return (byte)b;
    }

    private int Read7BitEncodedInt32()
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
            byteReadJustNow = InternalReadByte();
            result |= (byteReadJustNow & 0x7Fu) << shift;

            if (byteReadJustNow <= 0x7Fu)
            {
                return (int)result; // early exit
            }
        }

        // Read the 5th byte. Since we already read 28 bits,
        // the value of this byte must fit within 4 bits (32 - 28),
        // and it must not have the high bit set.

        byteReadJustNow = InternalReadByte();
        if (byteReadJustNow > 0b_1111u)
        {
            throw new FormatException("bad 7-bit integer");
        }

        result |= (uint)byteReadJustNow << (MaxBytesWithoutOverflow * 7);
        return (int)result;
    }

    private long Read7BitEncodedInt64()
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
            byteReadJustNow = InternalReadByte();
            result |= (byteReadJustNow & 0x7Ful) << shift;

            if (byteReadJustNow <= 0x7Fu)
            {
                return (long)result; // early exit
            }
        }

        // Read the 10th byte. Since we already read 63 bits,
        // the value of this byte must fit within 1 bit (64 - 63),
        // and it must not have the high bit set.

        byteReadJustNow = InternalReadByte();
        if (byteReadJustNow > 0b_1u)
        {
            throw new FormatException("bad 7-bit integer");
        }

        result |= (ulong)byteReadJustNow << (MaxBytesWithoutOverflow * 7);
        return (long)result;
    }
}
