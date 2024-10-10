// <copyright file="ColorF.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics.CodeAnalysis;
using System.Numerics;
using System.Runtime.CompilerServices;

namespace Neutrino.Pictoris.Drawing;

/// <summary>
/// Four channels R G B A color
/// </summary>
public struct ColorF : IEquatable<ColorF>
{
    /// <summary>
    /// Black color
    /// </summary>
    public static readonly ColorF Black = new(0, 0, 0, 1);
    /// <summary>
    /// White color
    /// </summary>
    public static readonly ColorF White = new(1, 1, 1, 1);

    private readonly float _r;
    private readonly float _g;
    private readonly float _b;
    private readonly float _a;

    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="r">red channel value 0-1</param>
    /// <param name="g">green channel value 0-1</param>
    /// <param name="b">blue channel value 0-1</param>
    /// <param name="a">alpha channel value 0-1</param>
    public ColorF(float r, float g, float b, float a = 1f)
    {
        _r = Clamp01(r);
        _g = Clamp01(g);
        _b = Clamp01(b);
        _a = Clamp01(a);
    }

    public static ColorF FromRGBA(float r, float g, float b, float a)
    {
        return new ColorF(r, g, b, a);
    }

    public static ColorF FromRGB(float r, float g, float b)
    {
        return new ColorF(r, g, b, 1f);
    }

    /// <summary>
    /// Returns red channel value (0-1)
    /// </summary>
    public float R => _r;

    /// <summary>
    /// Returns green channel value (0-1)
    /// </summary>
    public float G => _g;

    /// <summary>
    /// Returns blue channel value (0-1)
    /// </summary>
    public float B => _b;

    /// <summary>
    /// Returns alpha channel value (0-1)
    /// </summary>
    public float A => _a;

    /// <summary>
    /// Calculated relative luminance of the color
    /// </summary>
    /// <returns>relative luminance from 0 to 1</returns>
    public float GetRelativeLuminance()
    {
        return ContrastCalculator.sRGBtoY(this);
    }

    /// <summary>
    /// Desaturates color
    /// </summary>
    /// <param name="amount">amount (0.0 - 1.0)</param>
    /// <returns>Desaturated color</returns>
    public ColorF Desaturate(float amount = 0.1f)
    {
        Vector<float> hsl = ColorConverter.RgbToHsl(this.ToVector());
        float s = Clamp01(hsl[1] - amount);
        return ColorConverter.HslToRgb(ColorConverter.ToVector(hsl[0], s, hsl[2])).ToRgb();
    }

    /// <summary>
    /// Saturates color
    /// </summary>
    /// <param name="amount">amount (0.0 - 1.0)</param>
    /// <returns>Saturated color</returns>
    public ColorF Saturate(float amount = 0.1f)
    {
        Vector<float> hsl = ColorConverter.RgbToHsl(this.ToVector());
        float s = Clamp01(hsl[1] + amount);
        return ColorConverter.HslToRgb(ColorConverter.ToVector(hsl[0], s, hsl[2])).ToRgb();
    }

    /// <summary>
    /// Returns complement color
    /// </summary>
    /// <returns>Complement color</returns>
    public ColorF Complement()
    {
        return Spin(0.5f);
    }

    /// <summary>
    /// Spins color hue
    /// </summary>
    /// <param name="amount">amount (0.0 - 1.0)</param>
    /// <returns>color</returns>
    public ColorF Spin(float amount)
    {
        Vector<float> hsl = ColorConverter.RgbToHsl(this.ToVector());
        float h = (hsl[0] + amount) % 1f;
        return ColorConverter.HslToRgb(ColorConverter.ToVector(h, hsl[1], hsl[2])).ToRgb();
    }

    /// <summary>
    /// Return color wheel, like (3, 4, 5, 6, 7, 8, etc...)
    /// </summary>
    /// <param name="n">3 - N</param>
    /// <returns>Array of colors</returns>
    public ColorF[] Wheel(int n)
    {
        if (n <= 2)
        {
            throw new ArgumentOutOfRangeException(nameof(n));
        }
        ColorF[] wheel = new ColorF[n];
        for (int i = 0; i < n; ++i)
        {
            float amount = (float)i / (float)n;
            wheel[i] = Spin(amount);
        }
        return wheel;
    }

    /// <summary>
    /// Completely desaturates the color into greyscale
    /// </summary>
    /// <returns>Greyscale color</returns>
    public ColorF Grayscale()
    {
        return Desaturate(1f);
    }

    /// <summary>
    /// Lighten the color
    /// </summary>
    /// <param name="rgb">color</param>
    /// <param name="amount">amount (0.0 - 1.0)</param>
    /// <param name="absolute">absolute if true, relative otherwise</param>
    /// <returns>Lighten color</returns>
    public static ColorF Lighten(ColorF rgb, float amount, bool absolute = false)
    {
        Vector<float> hsl = ColorConverter.RgbToHsl(rgb.ToVector());
        float l;
        if (absolute)
        {
            l = hsl[2] + amount;
        }
        else
        {
            l = 1f - ((1f - hsl[2]) * (1f - amount));
        }
        l = Clamp01(l);
        Vector<float> result = ColorConverter.HslToRgb(ColorConverter.ToVector(hsl[0], hsl[1], l));
        return result.ToRgb();
    }

    /// <summary>
    /// Darken the color
    /// </summary>
    /// <param name="rgb">color</param>
    /// <param name="amount">amount</param>
    /// <param name="absolute">absolute when true, relative otherwise</param>
    /// <returns></returns>
    public static ColorF Darken(ColorF rgb, float amount, bool absolute = false)
    {
        Vector<float> hsl = ColorConverter.RgbToHsl(rgb.ToVector());
        float l;
        if (absolute)
        {
            l = hsl[2] - amount;
        }
        else
        {
            l = hsl[2] * (1f - amount);
        }
        l = Clamp01(l);
        Vector<float> result = ColorConverter.HslToRgb(ColorConverter.ToVector(hsl[0], hsl[1], l));
        return result.ToRgb();
    }

    /// <summary>
    /// Alpha blend two colors: foreground and background
    /// </summary>
    /// <param name="foreground">Foreground color</param>
    /// <param name="background">Background color</param>
    /// <returns>Blended color</returns>
    public static ColorF AlphaBlend(ColorF foreground, ColorF background)
    {
        float a0 = foreground.A + background.A * (1f - foreground.A);

        return new ColorF(
                (foreground.R * foreground.A + background.R * background.A * (1f - foreground.A)) / a0,
                (foreground.G * foreground.A + background.G * background.A * (1f - foreground.A)) / a0,
                (foreground.B * foreground.A + background.B * background.A * (1f - foreground.A)) / a0,
                a0);
    }
    /// <summary>
    /// Returns tint of the color
    /// </summary>
    /// <param name="amount">Amount (0.0 - 1.0)</param>
    /// <returns>Tint</returns>
    public ColorF Tint(float amount = 0.1f)
    {
        return Mix(White, amount);
    }

    /// <summary>
    /// Return shade of the color
    /// </summary>
    /// <param name="amount">Amount (0.0 - 1.0)</param>
    /// <returns>Shade</returns>
    public ColorF Shade(float amount = 0.1f)
    {
        return Mix(Black, amount);
    }

    /// <summary>
    /// Returns result of mixing two colors
    /// </summary>
    /// <param name="color">The second color</param>
    /// <param name="amount">Amount (0.0 - 1.0)</param>
    /// <returns></returns>
    public ColorF Mix(ColorF color, float amount)
    {
        return Mix(this, color, amount);
    }

    /// <summary>
    /// Returns result of mixing two colors
    /// </summary>
    /// <param name="a">The first color</param>
    /// <param name="b">The second color</param>
    /// <param name="amount">Amount (0.0 - 1.0)</param>
    /// <returns>Color mix</returns>
    public static ColorF Mix(ColorF a, ColorF b, float amount)
    {
        amount = Clamp01(amount);
        return new ColorF(
            a.R + (b.R - a.R) * amount,
            a.G + (b.G - a.G) * amount,
            a.B + (b.B - a.B) * amount,
            a.A + (b.A - a.A) * amount);
    }

    public ColorF[] GetPalette(int count)
    {
        ColorF[] palette = new ColorF[count];
        int middle = count / 2;
        for (int i = 0; i < middle; ++i)
        {
            palette[i] = Mix(ColorF.Black, this, (float)i / (float)middle);
        }
        palette[middle] = this;
        for (int i = middle + 1; i < count; ++i)
        {
            palette[i] = Mix(this, ColorF.White, (float)(i - middle) / (float)(count - middle));
        }
        return palette;
    }

    /// <summary>
    /// Converts color to hex color string (alpha is ignored)
    /// </summary>
    /// <returns>hex color string</returns>
    public override string ToString() => ToString("hex");

    /// <summary>
    /// Converts color to string (hex or rgb)
    /// </summary>
    /// <param name="format">one of: hex | rgb</param>
    /// <returns>string representation of color</returns>
    /// <exception cref="ArgumentException"></exception>
    public string ToString(string format)
    {
        byte r = (byte)(R * 255f);
        byte g = (byte)(G * 255f);
        byte b = (byte)(B * 255f);
        if (string.Equals(format, "rgb", StringComparison.OrdinalIgnoreCase))
        {
            return $"rgb({r} {g} {b})";
        }
        else if (string.Equals(format, "rgba", StringComparison.OrdinalIgnoreCase))
        {
            return $"rgba({r} {g} {b} {MathF.Round(A, 2, MidpointRounding.AwayFromZero)})";
        }
        if (string.IsNullOrEmpty(format) || string.Equals(format, "hex", StringComparison.OrdinalIgnoreCase))
        {
            return $"#{r:X2}{g:X2}{b:X2}";
        }
        throw new ArgumentException($"unsupported format {format}", format);
    }

    /// <inheritdoc/>
    public bool Equals(ColorF other)
    {
        return _r == other._r && _g == other._g && _b == other._b && _a == other._a;
    }

    /// <inheritdoc/>
    public static bool operator ==(ColorF a, ColorF b)
    {
        return a._r == b._r && a._g == b._g && a._b == b._b && a._a == b._a;
    }

    /// <inheritdoc/>
    public static bool operator !=(ColorF a, ColorF b)
    {
        return a._r != b._r || a._g != b._g || a._b != b._b || a._a != b._a;
    }

    /// <inheritdoc/>
    public override bool Equals([NotNullWhen(true)] object? obj)
    {
        if (obj is ColorF c)
        {
            return Equals(c);
        }
        return false;
    }

    /// <inheritdoc/>
    public override int GetHashCode()
    {
        return HashCode.Combine(_r, _g, _b, _a);
    }

    /// <summary>
    /// Parses the hex color string
    /// </summary>
    /// <param name="s">hex color string</param>
    /// <returns>color</returns>
    public static ColorF Parse(string s)
    {
        return ColorConverter.ParseRgbHex(s).ToRgb();
    }


    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private static float Clamp01(float value) =>
        MathF.Min(1, Math.Max(0, value));
}


public static class VectorToColorExtensions
{
    public static unsafe ColorF ToRgb(this Vector<float> rgb)
    {
        float* ptr = (float*)&rgb;
        return new ColorF(*(ptr + 0), *(ptr + 1), *(ptr + 2));
    }

    public static unsafe ColorF ToRgba(this Vector<float> rgb)
    {
        float* ptr = (float*)&rgb;
        return new ColorF(*(ptr + 0), *(ptr + 1), *(ptr + 2), *(ptr + 3));
    }

    public static Vector<float> ToVector(this ColorF rgba)
    {
        return ColorConverter.ToVector(rgba.R, rgba.G, rgba.B, rgba.A);
    }
}
