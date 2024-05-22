// <copyright file="PropertyMap.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Buffers;
using System.Collections.Concurrent;
using System.Runtime.CompilerServices;

namespace DataStream;

internal class PropertyMap : IDisposable
{
    private static readonly ConcurrentDictionary<Type, PropertyMap> s_propertyMaps = new();

    private readonly Dictionary<Utf8String, int> _propertyToIndex;
    private readonly List<Utf8String> _indexToProperty;
    private readonly int[] _streamIndex = null!;

    private PropertyMap()
    {
        _propertyToIndex = new();
        _indexToProperty = new();
    }

    public static PropertyMap GetInstance(Type itemType)
    {
        return s_propertyMaps.GetOrAdd(itemType, (_) =>
        {
            return new();
        });
    }

    private PropertyMap(PropertyMap source)
    {
        _propertyToIndex = source._propertyToIndex;
        _indexToProperty = source._indexToProperty;
        _streamIndex = ArrayPool<int>.Shared.Rent(_propertyToIndex.Count + 1);
        Array.Clear(_streamIndex, 0, _propertyToIndex.Count + 1);
    }

    public void Dispose()
    {
        ArrayPool<int>.Shared.Return(_streamIndex);
    }

    public bool TryAdd(Utf8String propertyName, out int index)
    {
        if (!_propertyToIndex.TryGetValue(propertyName, out index))
        {
            index = _propertyToIndex.Count + 1;
            _propertyToIndex.Add(propertyName, index);
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
        return _indexToProperty[streamIndex - 1].Value;
    }

    public string? FindProperty(int index)
    {
        Utf8String entry = _propertyToIndex.Where(t => t.Value == index).Select(t => t.Key).FirstOrDefault();
        return DataStreamSerializer.UTF8.GetString(entry.Value);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(in Utf8String property, int streamIndex)
    {
        if (_streamIndex[streamIndex] == 0)
        {
            _streamIndex![streamIndex] = _propertyToIndex[property];
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
