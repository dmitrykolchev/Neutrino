// <copyright file="DataStreamReader.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Buffers;
using System.Buffers.Binary;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;

namespace DataStream;

internal class DataStreamReader
{
    private readonly Stream _stream;
    private readonly Encoding _encoding;
    private readonly Dictionary<string, int> _nameToIndex = new();
    private readonly Dictionary<int, string> _indexToName = new();
    private readonly PropertyMap _propertyMap = new PropertyMap();

    private DataStreamElementType _elementType;
    private string? _propertyName;

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

    public string? PropertyName => _propertyName;

    internal PropertyMap PropertyMap => _propertyMap;

    public string ReadProperty()
    {
        return ReadProperty(out _);
    }

    public string ReadProperty(out int propertyIndex)
    {
        if (ElementType == DataStreamElementType.PropertyIndex)
        {
            propertyIndex = Read7BitEncodedInt32();
            _propertyName = _indexToName[propertyIndex];
        }
        else if (ElementType == DataStreamElementType.PropertyName)
        {
            _propertyName = ReadStringInternal();
            propertyIndex = _nameToIndex.Count;
            _nameToIndex.Add(_propertyName, propertyIndex);
            _indexToName.Add(propertyIndex, _propertyName);
        }
        else
        {
            throw new FormatException("unexpected tag");
        }
        return _propertyName;
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
        if (ElementType != DataStreamElementType.Byte &&
            ElementType != (DataStreamElementType.Enum | DataStreamElementType.Byte))
        {
            throw new FormatException();
        }
        return InternalReadByte();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int ReadInt16()
    {
        if (ElementType != DataStreamElementType.Int16 &&
            ElementType != (DataStreamElementType.Enum | DataStreamElementType.Int16))
        {
            throw new FormatException();
        }
        Span<byte> buffer = stackalloc byte[sizeof(short)];
        ReadExactly(buffer);
        return BinaryPrimitives.ReadInt16BigEndian(buffer);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int ReadInt32()
    {
        if (ElementType != DataStreamElementType.Int32 &&
            ElementType != (DataStreamElementType.Enum | DataStreamElementType.Int32))
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
        ReadExactly(buffer);
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
        ReadExactly(buffer);
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
        ReadExactly(buffer);
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
        ReadExactly(buffer);
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
        int[] buffer = ArrayPool<int>.Shared.Rent(4);
        try
        {
            Span<byte> span = MemoryMarshal.AsBytes(buffer.AsSpan());
            ReadExactly(span.Slice(0, sizeof(int) * 4));
            data[0] = BinaryPrimitives.ReadInt32BigEndian(span.Slice(sizeof(int) * 0, sizeof(int)));
            data[1] = BinaryPrimitives.ReadInt32BigEndian(span.Slice(sizeof(int) * 1, sizeof(int)));
            data[2] = BinaryPrimitives.ReadInt32BigEndian(span.Slice(sizeof(int) * 2, sizeof(int)));
            data[3] = BinaryPrimitives.ReadInt32BigEndian(span.Slice(sizeof(int) * 3, sizeof(int)));
            return new decimal(data);
        }
        finally
        {
            ArrayPool<int>.Shared.Return(buffer);
        }
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
        Read(buffer, 0, length);
        return buffer;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public string ReadString()
    {
        if (ElementType != DataStreamElementType.String)
        {
            throw new FormatException();
        }
        return ReadStringInternal();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private string ReadStringInternal()
    {
        int length = Read7BitEncodedInt32();
        byte[] buffer = ArrayPool<byte>.Shared.Rent(length);
        try
        {
            Read(buffer, 0, length);
            return _encoding.GetString(buffer, 0, length);
        }
        finally
        {
            ArrayPool<byte>.Shared.Return(buffer);
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    // Inlined to avoid some method call overhead with InternalRead.
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

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private void Read(byte[] buffer, int offset, int count)
    {
        int readBytes = _stream.Read(buffer, offset, count);
        if (readBytes != count)
        {
            throw new EndOfStreamException();
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private void ReadExactly(Span<byte> buffer)
    {
        _stream.ReadExactly(buffer);
    }
}
