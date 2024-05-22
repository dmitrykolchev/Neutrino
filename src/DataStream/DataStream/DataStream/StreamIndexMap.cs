// <copyright file="SourceIndexMap.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;

namespace DataStream;

internal class StreamIndexMap
{
    private readonly PropertyMap _propertyMap;
    private int[] _streamIndex;

    public StreamIndexMap(PropertyMap propertyMap)
    {
        _propertyMap = propertyMap;
        _streamIndex = new int[_propertyMap.Count + 1];
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Utf8String GetProperty(int index)
    {
        return _propertyMap.GetProperty(GetInternalIndex(index));
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public bool Allocate(int index)
    {
        if (index > _streamIndex.Length)
        {
            Array.Resize<int>(ref _streamIndex, (index + 31) & ~0x1F);
        }
        if (_streamIndex[index] == 0)
        {
            _streamIndex[index] = index;
            return true;
        }
        return false;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(in Utf8String property, int index)
    {
        if (_streamIndex[index] == 0)
        {
            _streamIndex![index] = _propertyMap.GetIndex(property);
        }
        return _streamIndex[index];
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(int index)
    {
        return _streamIndex![index];
    }
}
