// <copyright file="Image.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System;
using System.Numerics;

namespace Neutrino.Pictoris;

public unsafe class Image
{
    private readonly Buffer2D _buffer;

    private Image(byte[] data, int width, int height)
    {
        _buffer = new Buffer2D(4, width, height);
        _buffer.Initialize(data);
    }

    public int Width => _buffer.Width;

    public int Height => _buffer.Height;

    public static Image Create(byte[] data, int width, int height)
    {
        ArgumentNullException.ThrowIfNull(data);
        if (width <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(width));
        }
        if (height <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(height));
        }
        return new Image(data, width, height);
    }

    public unsafe void FlipHorizontal()
    {
        _buffer.FlipHorizontal();
    }

    public unsafe void FlipVertical()
    {
        _buffer.FlipVertical();
    }

    public unsafe NativeImage ToNative()
    {
        int length = Width * Height * 4;
        byte[] output = new byte[length];
        Vector<float> r05 = new(0.5f);
        Vector<float> z = Vector<float>.Zero;
        Vector<float> m = new(255);

        fixed (byte* outPtr = &output[0])
        {
            for (int row = 0, i = 0; row < Height; ++row)
            {
                Span<Vector<float>> r = _buffer.GetVectorRow(RGBAChannel.R, row);
                Span<Vector<float>> g = _buffer.GetVectorRow(RGBAChannel.G, row);
                Span<Vector<float>> b = _buffer.GetVectorRow(RGBAChannel.B, row);
                Span<Vector<float>> a = _buffer.GetVectorRow(RGBAChannel.A, row);
                for (int x = 0; x < r.Length; ++x, i += Buffer2D.VectorLength * 4)
                {
                    Vector<float> re = Vector.Min((r[x] * m) + r05, m);
                    Vector<float> ge = Vector.Min((g[x] * m) + r05, m);
                    Vector<float> be = Vector.Min((b[x] * m) + r05, m);
                    Vector<float> ae = Vector.Min((a[x] * m) + r05, m);
                    float* reptr = (float*)&re;
                    float* geptr = (float*)&ge;
                    float* beptr = (float*)&be;
                    float* aeptr = (float*)&ae;
                    if (Buffer2D.VectorLength >= 4)
                    {
                        *(outPtr + i + (0 * 4) + 0) = (byte)*(reptr + 0);
                        *(outPtr + i + (0 * 4) + 1) = (byte)*(geptr + 0);
                        *(outPtr + i + (0 * 4) + 2) = (byte)*(beptr + 0);
                        *(outPtr + i + (0 * 4) + 3) = (byte)*(aeptr + 0);

                        *(outPtr + i + (1 * 4) + 0) = (byte)*(reptr + 1);
                        *(outPtr + i + (1 * 4) + 1) = (byte)*(geptr + 1);
                        *(outPtr + i + (1 * 4) + 2) = (byte)*(beptr + 1);
                        *(outPtr + i + (1 * 4) + 3) = (byte)*(aeptr + 1);

                        *(outPtr + i + (2 * 4) + 0) = (byte)*(reptr + 2);
                        *(outPtr + i + (2 * 4) + 1) = (byte)*(geptr + 2);
                        *(outPtr + i + (2 * 4) + 2) = (byte)*(beptr + 2);
                        *(outPtr + i + (2 * 4) + 3) = (byte)*(aeptr + 2);

                        *(outPtr + i + (3 * 4) + 0) = (byte)*(reptr + 3);
                        *(outPtr + i + (3 * 4) + 1) = (byte)*(geptr + 3);
                        *(outPtr + i + (3 * 4) + 2) = (byte)*(beptr + 3);
                        *(outPtr + i + (3 * 4) + 3) = (byte)*(aeptr + 3);
                    }
                }
            }
        }
        return new NativeImage(Width, Height, output);
    }

    public unsafe NativeImage AdjustGamma(float factor)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="factor">brightness adjustment factor from -1.0 to 1.0</param>
    /// <returns></returns>
    public unsafe NativeImage AdjustBrightness(float factor)
    {
        using SecondoMeter secondoMeter = new (nameof(AdjustBrightness));

        factor = MathF.Min(MathF.Max(factor, -1f), 1f);

        int length = Width * Height * 4;
        byte[] output = new byte[length];
        Vector<float> f = new((1 + factor) * 255);
        Vector<float> r05 = new(0.5f);
        Vector<float> z = Vector<float>.Zero;
        Vector<float> m = new(255);

        fixed (byte* outPtr = &output[0])
        {
            for (int row = 0, i = 0; row < Height; ++row)
            {
                Span<Vector<float>> r = _buffer.GetVectorRow(RGBAChannel.R, row);
                Span<Vector<float>> g = _buffer.GetVectorRow(RGBAChannel.G, row);
                Span<Vector<float>> b = _buffer.GetVectorRow(RGBAChannel.B, row);
                Span<Vector<float>> a = _buffer.GetVectorRow(RGBAChannel.A, row);
                for (int x = 0; x < r.Length; ++x, i += Buffer2D.VectorLength * 4)
                {
                    Vector<float> re = Vector.Min((r[x] * f) + r05, m);
                    Vector<float> ge = Vector.Min((g[x] * f) + r05, m);
                    Vector<float> be = Vector.Min((b[x] * f) + r05, m);
                    Vector<float> ae = Vector.Min((a[x] * m) + r05, m);
                    float* reptr = (float*)&re;
                    float* geptr = (float*)&ge;
                    float* beptr = (float*)&be;
                    float* aeptr = (float*)&ae;
                    if (Buffer2D.VectorLength >= 4)
                    {
                        *(outPtr + i + (0 * 4) + 0) = (byte)*(reptr + 0);
                        *(outPtr + i + (0 * 4) + 1) = (byte)*(geptr + 0);
                        *(outPtr + i + (0 * 4) + 2) = (byte)*(beptr + 0);
                        *(outPtr + i + (0 * 4) + 3) = (byte)*(aeptr + 0);

                        *(outPtr + i + (1 * 4) + 0) = (byte)*(reptr + 1);
                        *(outPtr + i + (1 * 4) + 1) = (byte)*(geptr + 1);
                        *(outPtr + i + (1 * 4) + 2) = (byte)*(beptr + 1);
                        *(outPtr + i + (1 * 4) + 3) = (byte)*(aeptr + 1);

                        *(outPtr + i + (2 * 4) + 0) = (byte)*(reptr + 2);
                        *(outPtr + i + (2 * 4) + 1) = (byte)*(geptr + 2);
                        *(outPtr + i + (2 * 4) + 2) = (byte)*(beptr + 2);
                        *(outPtr + i + (2 * 4) + 3) = (byte)*(aeptr + 2);

                        *(outPtr + i + (3 * 4) + 0) = (byte)*(reptr + 3);
                        *(outPtr + i + (3 * 4) + 1) = (byte)*(geptr + 3);
                        *(outPtr + i + (3 * 4) + 2) = (byte)*(beptr + 3);
                        *(outPtr + i + (3 * 4) + 3) = (byte)*(aeptr + 3);
                    }
                }
            }
        }
        return new NativeImage(Width, Height, output);
    }
}
