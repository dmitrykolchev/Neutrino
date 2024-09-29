// <copyright file="Buffer2D.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Buffers;
using System.Diagnostics;
using System.Numerics;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace Neutrino.Pictoris;

public enum RGBAChannel
{
    First = R,
    R = 0,
    G = 1,
    B = 2,
    A = 3,
    Last = A
}

public unsafe class Buffer2D
{
    private readonly float[] _buffer;
    private readonly int _channels;
    private readonly int _width;
    private readonly int _height;
    private readonly int _stripe;
    private readonly int _channelLength;

    public Buffer2D(int channels, int width, int height)
    {
        _width = width;
        _height = height;
        _channels = channels;
        _stripe = (width + Vector<float>.Count - 1) / Vector<float>.Count * Vector<float>.Count;
        _channelLength = _stripe * height;
        _buffer = GC.AllocateUninitializedArray<float>(channels * _channelLength);
    }

    public int Channels => _channels;

    public int Width => _width;

    public int Height => _height;

    public int Stripe => _stripe;

    public static int VectorLength => Vector<float>.Count;

    public void Initialize(byte[] data)
    {
        fixed (float* dst = &_buffer[0])
        fixed (byte* src = &data[0])
        {
            float* r = dst;
            float* g = dst + _channelLength;
            float* b = dst + (_channelLength * 2);
            float* a = dst + (_channelLength * 3);
            for (int y = 0; y < _height; ++y, r += _stripe, g += _stripe, b += _stripe, a += _stripe)
            {
                int offset = y * _width * 4;
                for (int x = 0; x < _width; ++x)
                {
                    *(r + x) = *(src + offset + (x * 4) + 0) / 255f;
                    *(g + x) = *(src + offset + (x * 4) + 1) / 255f;
                    *(b + x) = *(src + offset + (x * 4) + 2) / 255f;
                    *(a + x) = *(src + offset + (x * 4) + 3) / 255f;
                }
            }
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Span<float> GetChannel(RGBAChannel channel) =>
        GetChannel((int)channel);

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Span<float> GetChannel(int channel) =>
        new Span<float>(_buffer, channel * _channelLength, _channelLength);

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Span<float> GetScalarRow(RGBAChannel channel, int row)
    {
        Span<float> channelData = GetChannel((int)channel);
        return channelData.Slice(row * _stripe, _width);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public Span<Vector<float>> GetVectorRow(RGBAChannel channel, int row) =>
        MemoryMarshal.Cast<float, Vector<float>>(GetScalarRow(channel, row));

    public void FlipVertical()
    {
        using SecondoMeter secondoMeter = new(nameof(FlipVertical));
        for (RGBAChannel channel = RGBAChannel.First; channel != RGBAChannel.Last; channel++)
        {
            for (int row = 0; row < _height; ++row)
            {
                Span<float> r = GetScalarRow((RGBAChannel)channel, row);
                r.Reverse();
            }
        };
    }

    public void FlipHorizontal()
    {
        using SecondoMeter secondoMeter = new (nameof(FlipHorizontal));
        float[] buffer = ArrayPool<float>.Shared.Rent(_width);
        try
        {
            Span<float> temp = buffer.AsSpan(0, _width);

            for (RGBAChannel channel = RGBAChannel.R; channel <= RGBAChannel.A; ++channel)
            {
                for (int frow = 0; frow < _height / 2; ++frow)
                {
                    int lrow = _height - frow - 1;
                    Span<float> first = GetScalarRow(channel, frow);
                    Span<float> last = GetScalarRow(channel, lrow);
                    first.CopyTo(temp);
                    last.CopyTo(first);
                    temp.CopyTo(last);
                }
            }
        }
        finally
        {
            ArrayPool<float>.Shared.Return(buffer);
        }

    }
}
