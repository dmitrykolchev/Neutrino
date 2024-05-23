// <copyright file="PropertyMap.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Runtime.CompilerServices;

namespace DataStream;

internal class PropertyMap
{
    public static readonly PropertyMap Instance = new ();

    private readonly object _sync = new();

    private readonly Dictionary<Utf8String, int> _propertyToIndex;
    private readonly List<Utf8String> _indexToProperty;

    private PropertyMap()
    {
        _propertyToIndex = new();
        _indexToProperty = new();
    }

    public int Count => _propertyToIndex.Count;

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public bool TryAdd(in Utf8String propertyName, out int index)
    {
        lock (_sync)
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
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetIndex(in Utf8String property)
    {
        return _propertyToIndex[property];
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Utf8String GetProperty(int index)
    {
        return _indexToProperty[index - 1];
    }

    public string? FindProperty(int index)
    {
        Utf8String entry = _propertyToIndex.Where(t => t.Value == index).Select(t => t.Key).FirstOrDefault();
        return entry.ToString();
    }
}
