// <copyright file="BinaryStringCacheInterner.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;

namespace BinaryString;

internal class Utf8StringCacheInterner
{
    public static readonly Utf8StringCacheInterner Instance = new();

    private readonly Utf8StringCache _cache = new();

    //[MethodImpl(MethodImplOptions.AggressiveInlining)]
    //public byte[] Intern(in InternableUtf8String candidate)
    //{
    //    return _cache.GetOrCreateEntry(candidate);
    //}

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] Intern(in ReadOnlySpan<byte> candidate, out int hashCode)
    {
        hashCode = InternableUtf8String.HashByteArray(candidate);
        return _cache.GetOrCreateEntry(candidate, hashCode);
    }
}
