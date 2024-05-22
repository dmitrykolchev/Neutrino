// <copyright file="BinaryStringCache.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace BinaryString;

internal class Utf8StringCache
{
    private readonly ConcurrentDictionary<int, BinaryWeakHandle> _entriesByHashCode;
    private const int _initialCapacity = 503;
    private int _scavengeThreshold = _initialCapacity;

    private class BinaryWeakHandle
    {
        public GCHandle WeakHandle;

        public bool IsUsed => WeakHandle.Target != null;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public byte[]? GetValue(in InternableUtf8String internable)
        {
            if (WeakHandle.IsAllocated && WeakHandle.Target is byte[] value)
            {
                if (internable.Equals(value))
                {
                    return value;
                }
            }
            return null;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public byte[]? GetValue(in ReadOnlySpan<byte> internable)
        {
            if (WeakHandle.IsAllocated && WeakHandle.Target is byte[] value)
            {
                if (InternableUtf8String.Equals(internable, value))
                {
                    return value;
                }
            }
            return null;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void SetValue(byte[] value)
        {
            if (!WeakHandle.IsAllocated)
            {
                WeakHandle = GCHandle.Alloc(value, GCHandleType.Weak);
            }
            else
            {
                WeakHandle.Target = value;
            }
        }

        public void Free()
        {
            WeakHandle.Free();
        }
    }

    public Utf8StringCache()
    {
        _entriesByHashCode = new(Environment.ProcessorCount, _initialCapacity);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] GetOrCreateEntry(in InternableUtf8String internable)
    {
        int hashCode = internable.GetHashCode();
        byte[]? result;

        if (_entriesByHashCode.TryGetValue(hashCode, out BinaryWeakHandle? handle))
        {
            lock (handle)
            {
                result = handle.GetValue(internable);
                if (result != null)
                {
                    return result;
                }
                result = internable.ToArray();
                handle.SetValue(result);
                return result;
            }
        }

        result = internable.ToArray();
        handle = new();
        handle.SetValue(result);
        _entriesByHashCode.TryAdd(hashCode, handle);
        // Remove unused handles if our heuristic indicates that it would be productive.

        int scavengeThreshold = _scavengeThreshold;
        if (_entriesByHashCode.Count >= scavengeThreshold)
        {
            // Before we start scavenging set _scavengeThreshold to a high value to effectively lock other threads from
            // running Scavenge at the same time.
            if (Interlocked.CompareExchange(ref _scavengeThreshold, int.MaxValue, scavengeThreshold) == scavengeThreshold)
            {
                try
                {
                    // Get rid of unused handles.
                    Scavenge();
                }
                finally
                {
                    // And do this again when the number of handles reaches double the current after-scavenge number.
                    _scavengeThreshold = _entriesByHashCode.Count * 2;
                }
            }
        }
        return result;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] GetOrCreateEntry(in ReadOnlySpan<byte> internable, int hashCode)
    {
        byte[]? result;

        if (_entriesByHashCode.TryGetValue(hashCode, out BinaryWeakHandle? handle))
        {
            lock (handle)
            {
                result = handle.GetValue(internable);
                if (result != null)
                {
                    return result;
                }
                result = internable.ToArray();
                handle.SetValue(result);
                return result;
            }
        }

        result = internable.ToArray();
        handle = new();
        handle.SetValue(result);
        _entriesByHashCode.TryAdd(hashCode, handle);
        // Remove unused handles if our heuristic indicates that it would be productive.

        int scavengeThreshold = _scavengeThreshold;
        if (_entriesByHashCode.Count >= scavengeThreshold)
        {
            // Before we start scavenging set _scavengeThreshold to a high value to effectively lock other threads from
            // running Scavenge at the same time.
            if (Interlocked.CompareExchange(ref _scavengeThreshold, int.MaxValue, scavengeThreshold) == scavengeThreshold)
            {
                try
                {
                    // Get rid of unused handles.
                    Scavenge();
                }
                finally
                {
                    // And do this again when the number of handles reaches double the current after-scavenge number.
                    _scavengeThreshold = _entriesByHashCode.Count * 2;
                }
            }
        }
        return result;
    }

    public void Scavenge()
    {
        foreach (KeyValuePair<int, BinaryWeakHandle> entry in _entriesByHashCode)
        {
            // We can safely dereference entry.Value as the caller guarantees that Scavenge runs only on one thread.
            if (!entry.Value.IsUsed && _entriesByHashCode.TryRemove(entry.Key, out BinaryWeakHandle? removedHandle))
            {
                lock (removedHandle)
                {
                    // Note that the removed handle may be different from the one we got from the enumerator so check again
                    // and try to put it back if it's still in use.
                    if (!removedHandle.IsUsed || !_entriesByHashCode.TryAdd(entry.Key, removedHandle))
                    {
                        removedHandle.Free();
                    }
                }
            }
        }
    }

}
