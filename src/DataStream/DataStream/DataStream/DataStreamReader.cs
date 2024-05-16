// <copyright file="DataStreamReader.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;
using System.Text;

namespace DataStream;

internal class DataStreamReader
{
    private SequenceReader _sequence;
    private readonly Encoding _encoding;
    private readonly PropertyMap _propertyMap = new();

    private DataStreamElementType _elementType;
    private int _propertyIndex = -1;

    public DataStreamReader(SequenceReader sequence)
    {
        ArgumentNullException.ThrowIfNull(sequence);
        _sequence = sequence;
        _encoding = Encoding.UTF8;
    }

    public DataStreamElementType ElementType => _elementType;

    public int PropertyIndex => _propertyIndex;

    public string? PropertyName => _propertyMap.FromStreamIndex(PropertyIndex);

    internal PropertyMap PropertyMap => _propertyMap;

    public int Add(string property)
    {
        return _propertyMap.Add(property);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public DataStreamElementType ReadElementType()
    {
        _elementType = (DataStreamElementType)_sequence.ReadByte();
        return _elementType;
    }

    public int ReadProperty()
    {
        if (ElementType == DataStreamElementType.PropertyIndex)
        {
            _propertyIndex = PropertyMap.GetStreamIndex(_sequence.Read7BitEncodedInt32());
        }
        else if (ElementType == DataStreamElementType.PropertyName)
        {
            _propertyIndex = PropertyMap.GetStreamIndex(_sequence.ReadString());
        }
        else
        {
            throw new FormatException("unexpected tag");
        }
        return _propertyIndex;
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
        return _sequence.ReadByte();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int ReadInt16()
    {
        if (ElementType != DataStreamElementType.Int16 &&
            ElementType != (DataStreamElementType.Enum | DataStreamElementType.Int16))
        {
            throw new FormatException();
        }
        return _sequence.ReadInt16BigEndian();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int ReadInt32()
    {
        if (ElementType != DataStreamElementType.Int32 &&
            ElementType != (DataStreamElementType.Enum | DataStreamElementType.Int32))
        {
            throw new FormatException();
        }
        return _sequence.Read7BitEncodedInt32();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public long ReadInt64()
    {
        if (ElementType != DataStreamElementType.Int64)
        {
            throw new FormatException();
        }
        return _sequence.Read7BitEncodedInt64();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public double ReadDouble()
    {
        if (ElementType != DataStreamElementType.Double)
        {
            throw new FormatException();
        }
        return _sequence.ReadDoubleBigEndian();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public double ReadSingle()
    {
        if (ElementType != DataStreamElementType.Single)
        {
            throw new FormatException();
        }
        return _sequence.ReadSingleBigEndian();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public DateTime ReadDateTime()
    {
        if (ElementType != DataStreamElementType.DateTime)
        {
            throw new FormatException();
        }
        long value = _sequence.ReadInt64BigEndian();
        return DateTime.FromBinary(value);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Guid ReadGuid()
    {
        if (ElementType != DataStreamElementType.Guid)
        {
            throw new FormatException();
        }
        return _sequence.ReadGuid();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public decimal ReadDecimal()
    {
        if (ElementType != DataStreamElementType.Decimal)
        {
            throw new FormatException();
        }
        return _sequence.ReadDecimal();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] ReadBinary()
    {
        if (ElementType != (DataStreamElementType.ArrayOf | DataStreamElementType.Byte))
        {
            throw new FormatException();
        }
        int length = _sequence.Read7BitEncodedInt32();
        byte[] buffer = new byte[length];
        _sequence.Read(buffer, 0, length);
        return buffer;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public string ReadString()
    {
        if (ElementType != DataStreamElementType.String)
        {
            throw new FormatException();
        }
        return _sequence.ReadString();
    }
}
