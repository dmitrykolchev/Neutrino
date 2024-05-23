// <copyright file="SourceIndexMap.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;

namespace DataStream;

internal class StreamIndexMap
{
    public const int InvalidPropertyIndex = 0;

    private int[] _streamIndex;

    public StreamIndexMap()
    {
        _streamIndex = new int[32];
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public bool Allocate(int streamIndex)
    {
        VerifyStreamIndex(streamIndex);
        if (_streamIndex[streamIndex] == InvalidPropertyIndex)
        {
            _streamIndex[streamIndex] = streamIndex;
            return true;
        }
        return false;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(in Utf8String property, int streamIndex)
    {
        VerifyStreamIndex(streamIndex);
        if (_streamIndex[streamIndex] == InvalidPropertyIndex)
        {
            return _streamIndex![streamIndex] = PropertyMap.Instance.GetIndex(property);
        }
        return _streamIndex[streamIndex];
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public int GetInternalIndex(int streamIndex)
    {
        return _streamIndex![streamIndex];
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private void VerifyStreamIndex(int streamIndex)
    {
        if (streamIndex > _streamIndex.Length)
        {
            Array.Resize<int>(ref _streamIndex, (streamIndex + 32) & ~0x1F);
        }
    }
}
