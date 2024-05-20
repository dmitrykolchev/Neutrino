// <copyright file="PropertyMap.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;

namespace DataStream;

internal class PropertyMap
{
    internal struct PropertyNameEntry
    {
        private byte[] _data;
        private int _hashValue;

        public byte[] Data => _data;

        public PropertyNameEntry(byte[] data)
        {
            _data = data;
            _hashValue = HashProvider.ComputeHash32(data, HashProvider.DefaultSeed);
        }

        public override int GetHashCode()
        {
            return _hashValue;
        }

        public override bool Equals(object? obj)
        {
            if (obj is PropertyNameEntry that)
            {
                return _hashValue == that._hashValue && _data.SequenceEqual(that._data);
            }
            return false;
        }

        public override string ToString()
        {
            if (_data != null)
            {
                return DataStreamSerializer.UTF8.GetString(_data);
            }
            return string.Empty;
        }
    }

    private readonly Dictionary<PropertyNameEntry, int> _propertyIndex;
    private readonly int[]? _streamIndex;

    public PropertyMap()
    {
        _propertyIndex = new();
    }

    private PropertyMap(PropertyMap source)
    {
        _propertyIndex = source._propertyIndex;
        _streamIndex = new int[_propertyIndex.Count];
    }

    public bool TryAdd(byte[] propertyName, out int index)
    {
        PropertyNameEntry entry = new(propertyName);

        if (!_propertyIndex.TryGetValue(entry, out index))
        {
            index = _propertyIndex.Count;
            _propertyIndex.Add(entry, index);
            return true;
        }
        return false;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetIndex(byte[] propertyName)
    {
        PropertyNameEntry entry = new(propertyName);
        return _propertyIndex[entry];
    }

    public byte[]? FindProperty(int index)
    {
        PropertyNameEntry entry = _propertyIndex.Where(t => t.Value == index).Select(t => t.Key).FirstOrDefault();
        return entry.Data;
    }

    public string? FromIndex(int index)
    {
        byte[]? data = FindProperty(index);
        if (data != null)
        {
            return DataStreamSerializer.UTF8.GetString(data);
        }
        return null;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(byte[] property, int streamIndex)
    {
        PropertyNameEntry entry = new(property);
        int internalIndex = _propertyIndex[entry];
        _streamIndex![streamIndex] = internalIndex;
        return internalIndex;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(int streamIndex)
    {
        return _streamIndex![streamIndex];
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public PropertyMap Clone()
    {
        return new PropertyMap(this);
    }
}
