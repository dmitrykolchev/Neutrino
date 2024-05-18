// <copyright file="PropertyMap.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;

namespace DataStream;

internal class PropertyMap
{
    private struct Entry
    {
        private readonly byte[] _key;
        private readonly int _hashCode;

        public Entry(byte[] key)
        {
            _key = key;
            _hashCode = HashProvider.ComputeHash32(key, HashProvider.DefaultSeed);
        }

        public byte[] Key => _key;

        public override int GetHashCode()
        {
            return _hashCode;
        }

        public override bool Equals([NotNullWhen(true)] object? obj)
        {
            if (obj is Entry e)
            {
                return Enumerable.SequenceEqual(_key, e._key);
            }
            return false;
        }

        public override string ToString()
        {
            return DataStreamSerializer.UTF8.GetString(_key);
        }
    }

    private readonly Dictionary<Entry, int> _properties;
    private readonly List<Entry> _entries;
    private readonly List<int> _propertyIndex;

    public PropertyMap()
    {
        _properties = new();
        _entries = new();
        _propertyIndex = new();
    }

    private PropertyMap(PropertyMap source)
    {
        _properties = source._properties;
        _entries = source._entries;
        _propertyIndex = new(_entries.Count);
    }

    public int Add(byte[] propertyName)
    {
        Entry entry = new(propertyName);
        if (!_properties.TryGetValue(entry, out int internalIndex))
        {
            internalIndex = _properties.Count;
            _entries.Add(entry);
            _properties.Add(entry, internalIndex);
        }
        return internalIndex;
    }

    public int Count => _entries.Count;

    public byte[] this[int internalIndex] => _entries[internalIndex].Key;

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public bool GetStreamIndex(int internalIndex, out int streamIndex)
    {
        if (internalIndex == _propertyIndex.Count)
        {
            _propertyIndex.Add(internalIndex);
            streamIndex = _propertyIndex[internalIndex];
            return true;
        }
        streamIndex = _propertyIndex[internalIndex];
        return false;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(byte[] propertyName)
    {
        Entry entry = new(propertyName);
        int internalIndex = _properties[entry];
        _propertyIndex.Add(internalIndex);
        return internalIndex;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(int propertyStreamIndex)
    {
        return _propertyIndex[propertyStreamIndex];
    }

    public string? FromStreamIndex(int streamIndex)
    {
        int index = _propertyIndex[streamIndex];
        Entry entry = _properties.Where(t => t.Value == index).Select(t => t.Key).First();
        return DataStreamSerializer.UTF8.GetString(entry.Key);
    }

    internal PropertyMap Clone()
    {
        return new PropertyMap(this);
    }
}
