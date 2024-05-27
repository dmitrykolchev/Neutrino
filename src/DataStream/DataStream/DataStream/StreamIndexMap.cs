// <copyright file="SourceIndexMap.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Buffers;
using System.Collections.Concurrent;
using System.Runtime.CompilerServices;

namespace DataStream;

internal class StreamIndexMap
{
    private static readonly ConcurrentStack<StreamIndexMap> s_streamIndexPool = new();

    public const int InvalidPropertyIndex = 0;

    private int[] _streamIndex;

    private StreamIndexMap()
    {
        _streamIndex = ArrayPool<int>.Shared.Rent(32);
        Reset();
    }

    private void Reset()
    {
        Array.Clear(_streamIndex, 0, _streamIndex.Length);
    }

    public static StreamIndexMap Rent()
    {
        if(s_streamIndexPool.TryPop(out StreamIndexMap? result))
        {
            result.Reset();
            return result;
        }
        return new StreamIndexMap();
    }

    public static void Return(StreamIndexMap streamIndexMap)
    {
        s_streamIndexPool.Push(streamIndexMap);
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
            int[] buffer = ArrayPool<int>.Shared.Rent((streamIndex + 32) & ~0x1F);
            Array.Clear(buffer, _streamIndex.Length, buffer.Length - _streamIndex.Length);
            Array.Copy(_streamIndex, 0, buffer, 0, _streamIndex.Length);
            ArrayPool<int>.Shared.Return(_streamIndex);
            _streamIndex = buffer;
        }
    }
}
