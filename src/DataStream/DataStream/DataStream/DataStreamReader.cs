// <copyright file="DataStreamReader.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;

namespace DataStream;

internal class DataStreamReader
{
    private readonly ISequenceReader _reader;
    private readonly DataStreamSerializerContext _context;

    private DataStreamElementType _elementType;
    private int _propertyIndex = -1;

    public DataStreamReader(SequenceReaderLittleEndian sequence, DataStreamSerializerContext context)
    {
        _reader = sequence;
        _context = context;
    }

    public DataStreamElementType ElementType => _elementType;

    public int PropertyIndex => _propertyIndex;

    public string? PropertyName => PropertyMap.FromStreamIndex(PropertyIndex);

    internal PropertyMap PropertyMap => _context.PropertyMap!;

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public DataStreamElementType ReadElementType()
    {
        _elementType = (DataStreamElementType)_reader.ReadByte();
        return _elementType;
    }

    /// <summary>
    /// Returns internal property index
    /// </summary>
    /// <returns></returns>
    /// <exception cref="FormatException"></exception>
    public int ReadProperty()
    {
        if (_elementType == DataStreamElementType.PropertyIndex)
        {
            _propertyIndex = PropertyMap.GetInternalIndex(_reader.Read7BitEncodedInt32());
        }
        else if (_elementType == DataStreamElementType.PropertyName)
        {
            _propertyIndex = PropertyMap.GetInternalIndex(_reader.ReadBinary());
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
        return _elementType switch
        {
            DataStreamElementType.True => true,
            DataStreamElementType.False => false,
            _ => throw new FormatException()
        };
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte ReadByte()
    {
        if ((_elementType & DataStreamElementType.EnumTypeMask) != DataStreamElementType.Byte)
        {
            throw new FormatException();
        }
        return _reader.ReadByte();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int ReadInt16()
    {
        if ((_elementType & DataStreamElementType.EnumTypeMask) != DataStreamElementType.Int16)
        {
            throw new FormatException();
        }
        return _reader.ReadInt16();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int ReadInt32()
    {
        if ((_elementType & DataStreamElementType.EnumTypeMask) != DataStreamElementType.Int32)
        {
            throw new FormatException();
        }
        return _reader.Read7BitEncodedInt32();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public long ReadInt64()
    {
        if ((_elementType & DataStreamElementType.EnumTypeMask) != DataStreamElementType.Int64)
        {
            throw new FormatException();
        }
        return _reader.Read7BitEncodedInt64();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public double ReadDouble()
    {
        if (_elementType != DataStreamElementType.Double)
        {
            throw new FormatException();
        }
        return _reader.ReadDouble();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public double ReadSingle()
    {
        if (_elementType != DataStreamElementType.Single)
        {
            throw new FormatException();
        }
        return _reader.ReadSingle();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public DateTime ReadDateTime()
    {
        if (_elementType != DataStreamElementType.DateTime)
        {
            throw new FormatException();
        }
        long value = _reader.ReadInt64();
        return DateTime.FromBinary(value);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Guid ReadGuid()
    {
        if (_elementType != DataStreamElementType.Guid)
        {
            throw new FormatException();
        }
        return _reader.ReadGuid();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public decimal ReadDecimal()
    {
        if (_elementType != DataStreamElementType.Decimal)
        {
            throw new FormatException();
        }
        return _reader.ReadDecimal();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] ReadBinary()
    {
        if (_elementType != (DataStreamElementType.ArrayOf | DataStreamElementType.Byte))
        {
            throw new FormatException();
        }
        int length = _reader.Read7BitEncodedInt32();
        byte[] buffer = new byte[length];
        _reader.Read(buffer, 0, length);
        return buffer;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public string ReadString()
    {
        if (_elementType != DataStreamElementType.String)
        {
            throw new FormatException();
        }
        return _reader.ReadString();
    }
}
