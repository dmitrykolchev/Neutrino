// <copyright file="PropertyMapper.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Reflection;

namespace DataStream;

internal class PropertyMap
{
    private readonly Dictionary<string, int> _properties = new();
    private readonly List<int> _propertyIndex = new();

    public int Add(string propertyName)
    {
        if (!_properties.TryGetValue(propertyName, out int index))
        {
            index = _properties.Count;
            _properties.Add(propertyName, index);
        }
        return index;
    }

    public int GetInternalIndex(string propertyName)
    {
        return _properties[propertyName];
    }

    public int GetStreamIndex(string propertyName)
    {
        int propertyIndex = _properties[propertyName];
        _propertyIndex.Add(propertyIndex);
        return propertyIndex;
    }

    public int GetStreamIndex(int propertyIndex)
    {
        return _propertyIndex[propertyIndex];
    }

    public string? FromStreamIndex(int streamIndex)
    {
        return _properties.Where(t => t.Value == _propertyIndex[streamIndex]).Select(t => t.Key).First();
    }
}
