// <copyright file="BinaryString.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using System.Text;
using BinaryString;

namespace DataStream;

public struct Utf8String : IEquatable<Utf8String>
{
    private readonly byte[] _value;
    private readonly int _hashCode;

    private Utf8String(byte[] value, int hashCode)
    {
        _value = value;
        _hashCode = hashCode;
    }

    public int Length => _value.Length;

    public ReadOnlySpan<byte> AsSpan() => _value.AsSpan();

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static Utf8String Intern(in ReadOnlySpan<byte> value)
    {
        byte[] data = Utf8StringCacheInterner.Instance.Intern(value, out int hashCode);
        return new Utf8String(data, hashCode);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public override bool Equals([NotNullWhen(true)] object? obj)
    {
        if (obj is Utf8String s)
        {
            return Equals(s);
        }
        return false;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public override int GetHashCode()
    {
        return _hashCode;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public bool Equals(Utf8String other)
    {
        if (object.ReferenceEquals(_value, other._value))
        {
            return true;
        }
        byte[] left = _value;
        byte[] right = other._value;
        if (left.Length != right.Length)
        {
            return false;
        }
        for (int i = 0, len = right.Length; i < len; ++i)
        {
            if (left[i] != right[i])
            {
                return false;
            }
        }
        return true;
    }

    public override string ToString()
    {
        return Encoding.UTF8.GetString(_value);
    }
}
