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

    public void Add(IEnumerable<PropertyInfo> properties)
    {
        foreach (PropertyInfo property in properties)
        {
            Add(property.Name);
        }
    }

    public void Add(string propertyName)
    {
        _properties.Add(propertyName, _properties.Count);
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
}
