// <copyright file="PropertyMap.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Buffers;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;

namespace DataStream;

internal class PropertyMap: IDisposable
{
    internal class PropertyNameEntry
    {
        internal readonly byte[] _data;
        internal readonly int _hashValue;

        public PropertyNameEntry(byte[] data)
        {
            _data = data;
            _hashValue = HashProvider.ComputeHash32(data, HashProvider.DefaultSeed);
        }

        public override int GetHashCode()
        {
            return _hashValue;
        }

        public override string ToString()
        {
            if (_data != null)
            {
                return DataStreamSerializer.UTF8.GetString(_data.ToArray());
            }
            return string.Empty;
        }
    }

    private class PropertyNameEntryComparer : IEqualityComparer<PropertyNameEntry>
    {
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool Equals(PropertyNameEntry? x, PropertyNameEntry? y)
        {
            return x!._hashValue == y!._hashValue && x._data.SequenceEqual(y._data);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public int GetHashCode([DisallowNull] PropertyNameEntry obj)
        {
            return obj._hashValue;
        }
    }

    private static readonly PropertyNameEntryComparer DefaultComparer = new ();
    private readonly Dictionary<PropertyNameEntry, int> _propertyToIndex;
    private readonly List<byte[]> _indexToProperty;
    private int[] _streamIndex = null!;

    public PropertyMap()
    {
        _propertyToIndex = new(DefaultComparer);
        _indexToProperty = new();
    }

    public PropertyMap(PropertyMap source)
    {
        _propertyToIndex = source._propertyToIndex;
        _indexToProperty = source._indexToProperty;
        _streamIndex = ArrayPool<int>.Shared.Rent(_propertyToIndex.Count + 1);
    }

    public void Dispose()
    {
        ArrayPool<int>.Shared.Return(_streamIndex);
    }

    public bool TryAdd(byte[] propertyName, out int index)
    {
        PropertyNameEntry entry = new(propertyName);

        if (!_propertyToIndex.TryGetValue(entry, out index))
        {
            index = _propertyToIndex.Count + 1;
            _propertyToIndex.Add(entry, index);
            _indexToProperty.Add(propertyName);
            return true;
        }
        return false;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public bool UseIndex(int streamIndex)
    {
        if (_streamIndex[streamIndex] == 0)
        {
            _streamIndex[streamIndex] = streamIndex;
            return true;
        }
        return false;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] Get(int streamIndex)
    {
        return _indexToProperty[streamIndex - 1];
    }

    public string? FindProperty(int index)
    {
        PropertyNameEntry? entry = _propertyToIndex.Where(t => t.Value == index).Select(t => t.Key).FirstOrDefault();
        return entry?.ToString();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(byte[] property, int streamIndex)
    {
        if (_streamIndex[streamIndex] == 0)
        {
            PropertyNameEntry entry = new(property);
            _streamIndex![streamIndex] = _propertyToIndex[entry];
        }
        return _streamIndex[streamIndex];
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(int streamIndex)
    {
        return _streamIndex![streamIndex];
    }

    public PropertyMap Clone()
    {
        return new(this);
    }
}
