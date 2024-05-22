// <copyright file="InternableBinaryString.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;

namespace BinaryString;

internal ref struct InternableUtf8String
{
    private readonly ReadOnlySpan<byte> _value;
    private readonly int _hashCode;

    public InternableUtf8String(in ReadOnlySpan<byte> value)
    {
        _value = value;
        _hashCode = HashByteArray(_value);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public override int GetHashCode()
    {
        return _hashCode;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public bool Equals(byte[] value)
    {
        return Equals(_value, value);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static bool Equals(in ReadOnlySpan<byte> left, byte[] right)
    {
        // the smaller length of two arrays
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

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public byte[] ToArray()
    {
        return _value.ToArray();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static int HashByteArray(in ReadOnlySpan<byte> rgbValue)
    {
        int length = rgbValue.Length;

        if (length <= 0)
        {
            return 0;
        }

        int ulValue = 0;
        int ulHi;

        // Size of CRC window (hashing bytes, ssstr, sswstr, numeric)
        const int x_cbCrcWindow = 4;
        // const int iShiftVal = (sizeof ulValue) * (8*sizeof(char)) - x_cbCrcWindow;
        const int iShiftVal = (4 * 8) - x_cbCrcWindow;

        for (int i = 0; i < length; i++)
        {
            ulHi = (ulValue >> iShiftVal) & 0xff;
            ulValue <<= x_cbCrcWindow;
            ulValue = ulValue ^ rgbValue[i] ^ ulHi;
        }

        return ulValue;
    }

}
