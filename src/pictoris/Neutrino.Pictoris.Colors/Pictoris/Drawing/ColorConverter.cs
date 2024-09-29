// <copyright file="ColorConverter.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Numerics;
using System.Runtime.CompilerServices;

namespace Neutrino.Pictoris.Drawing;

public static class ColorConverter
{
    private const float Epsilon = 0.000001f;

    public static string ToRgbHexString(Vector<float> rgb)
    {
        Vector<byte> rgb256 = RgbToRgb256(rgb);
        return $"#{rgb256[0]:X2}{rgb256[1]:X2}{rgb256[2]:X2}";
    }

    public static string ToRgbString(Vector<float> rgb)
    {
        Vector<byte> rgb256 = RgbToRgb256(rgb);
        return $"rgb({rgb256[0]} {rgb256[1]} {rgb256[2]})";
    }

    public static string ToHsvString(Vector<float> hsv)
    {
        int h = (int)MathF.Min(360, (int)(hsv[0] + 0.5));
        int s = (int)MathF.Min(100, MathF.Round(hsv[1] * 100, 0, MidpointRounding.AwayFromZero));
        int v = (int)MathF.Min(100, MathF.Round(hsv[2] * 100, 0, MidpointRounding.AwayFromZero));
        return $"hsv({h} {s} {v})";
    }

    public static Vector<float> ParseRgbHex(string value)
    {
        if (value[0] != '#')
        {
            throw new FormatException("Invalid RGB Hexadecimal format");
        }
        var span = value.AsSpan();
        if (value.Length == 4)
        {
            int r = HexToInt(span[1]);
            int g = HexToInt(span[2]);
            int b = HexToInt(span[3]);
            return ToVector(r / 15f, g / 15f, b / 15f);
        }
        else if (value.Length == 7)
        {
            int r = int.Parse(span.Slice(1, 2), System.Globalization.NumberStyles.HexNumber);
            int g = int.Parse(span.Slice(3, 2), System.Globalization.NumberStyles.HexNumber);
            int b = int.Parse(span.Slice(5, 2), System.Globalization.NumberStyles.HexNumber);
            return ToVector(r / 255f, g / 255f, b / 255f);
        }

        throw new FormatException("Invalid RGB Hexadecimal format");

        static int HexToInt(char ch)
        {
            if (ch >= '0' && ch <= '9')
            {
                return ch - '0';
            }

            if (ch >= 'A' && ch <= 'F')
            {
                return 10 + ch - 'A';
            }

            if (ch >= 'a' && ch <= 'f')
            {
                return 10 + ch - 'a';
            }

            throw new FormatException();
        }
    }
    /**
    * Converts HSV to RGB value.
    *
    * @param {Integer} h Hue as a value between 0 - 1 degrees
    * @param {Integer} s Saturation as a value between 0 - 1
    * @param {Integer} v Value as a value between 0 - 1
    * @returns {Array} The RGB values  EG: [r,g,b], [255,255,255]
    */

    private static readonly Vector<float> b255 = new(255);
    private static readonly Vector<float> half = new(0.5f);

    /// <summary>
    /// Converts HSV to RGB value
    /// </summary>
    /// <param name="h">Hue as a value between 0 and 1</param>
    /// <param name="s">Saturation as a value between 0 and 1</param>
    /// <param name="v">Value as a value between 0 and 1</param>
    /// <returns>The RGB values  EG: [r,g,b], [1,1,1]</returns>
    /// <exception cref="InvalidOperationException"></exception>
    public static unsafe Vector<float> HsvToRgb(Vector<float> hsv)
    {
        float* ptr = (float*)&hsv;
        float h = *(ptr + 0);
        float s = *(ptr + 1);
        float v = *(ptr + 2);

        float hi = MathF.Floor(h * 6 % 6);
        float f = (h * 6) - hi;
        float p = v * (1 - s);
        float q = v * (1 - (f * s));
        float t = v * (1 - ((1 - f) * s));

        Vector<float> rgb;
        switch (hi)
        {
            case 0:
                rgb = ToVector(v, t, p);
                break;
            case 1:
                rgb = ToVector(q, v, p);
                break;
            case 2:
                rgb = ToVector(p, v, t);
                break;
            case 3:
                rgb = ToVector(p, q, v);
                break;
            case 4:
                rgb = ToVector(t, p, v);
                break;
            case 5:
                rgb = ToVector(v, p, q);
                break;
            default:
                throw new InvalidOperationException();
        }
        return Vector.Max(Vector<float>.Zero, Vector.Min(Vector<float>.One, rgb));
    }

    public static unsafe Vector<float> HslToHsv(Vector<float> hsl)
    {
        float* ptr = (float*)&hsl;
        float h = *(ptr + 0);
        float s = *(ptr + 1);
        float l = *(ptr + 2);

        s *= l < 0.5f ? l : 1f - l;
        float v = l + s;
        return ToVector(h, v == 0 ? 0 : 2 * s / v, v);
    }

    public static unsafe Vector<float> HsvToHsl(Vector<float> hsv)
    {
        float* ptr = (float*)&hsv;
        float h = *(ptr + 0);
        float s = *(ptr + 1);
        float v = *(ptr + 2);

        float l = (2 - s) * v;
        float sl = s * v;
        sl /= l <= 1 ? l : 2 - l;
        l /= 2;

        return ToVector(h, sl, l);
    }

    public static Vector<float> HslToRgb(Vector<float> hsl)
    {
        return HsvToRgb(HslToHsv(hsl));
    }

    public static Vector<float> RgbToHsl(Vector<float> rgb)
    {
        return HsvToHsl(RgbToHsv(rgb));
    }

    /// <summary>
    /// Converts RGB to HSV value.
    /// </summary>
    /// <param name="rgb">RGB vector [r,g,b], [0-1, 0-1, 0-1]</param>
    /// <returns>The HSV vector: [h,s,v], [0-360 degrees, 0-1, 0-1]</returns>
    /// <exception cref="InvalidOperationException"></exception>
    public static unsafe Vector<float> RgbToHsv(Vector<float> rgb)
    {
        float* ptr = (float*)&rgb;
        float r = *(ptr + 0);
        float g = *(ptr + 1);
        float b = *(ptr + 2);

        float min = MathF.Min(MathF.Min(r, g), b);
        float max = MathF.Max(MathF.Max(r, g), b);
        float delta = max - min;

        float value = max;
        float saturation;
        float hue;

        // Hue
        if (max == min)
        {
            hue = 0;
        }
        else if (max == r)
        {
            hue = (g - b) / (6 * delta);
        }
        else if (max == g)
        {
            hue = (b - r) / (6 * delta) + 1f / 3f;
        }
        else if (max == b)
        {
            hue = (r - g) / (6 * delta) + 2f / 3f;
        }
        else
        {
            throw new InvalidOperationException();
        }


        hue = (hue + 1f) % 1f;

        // Saturation
        if (max < 0.0000001f)
        {
            saturation = 0;
        }
        else
        {
            saturation = delta / max;
        }

        return ToVector(hue, saturation, value);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static Vector<float> ToVector(float p1, float p2, float p3)
    {
        if (Vector<float>.Count < 3)
        {
            throw new InvalidOperationException();
        }
        Vector<float> result = new();
        unsafe
        {
            float* dst = (float*)&result;
            *(dst + 0) = p1;
            *(dst + 1) = p2;
            *(dst + 2) = p3;
            return result;
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static Vector<float> ToVector(float p1, float p2, float p3, float p4)
    {
        if (Vector<float>.Count < 4)
        {
            throw new InvalidOperationException();
        }
        Vector<float> result = new();
        unsafe
        {
            float* dst = (float*)&result;
            *(dst + 0) = p1;
            *(dst + 1) = p2;
            *(dst + 2) = p3;
            *(dst + 3) = p3;
            return result;
        }
    }

    private static Vector<byte> RgbToRgb256(Vector<float> rgb)
    {
        return NarrowToByte(Vector.Max(Vector<float>.Zero, Vector.Min(b255, (rgb * b255) + half)));
    }

    private static Vector<float> Rgb256ToRgb(Vector<byte> rgb)
    {
        return ToVector(rgb[0] / 255f, rgb[1] / 255f, rgb[2] / 255f);
    }

    private static unsafe Vector<byte> NarrowToByte(Vector<float> rgb)
    {
        Vector<byte> result = new();
        byte* bptr = (byte*)&result;
        float* fptr = (float*)&rgb;
        *(bptr + 0) = (byte)*(fptr + 0);
        *(bptr + 1) = (byte)*(fptr + 1);
        *(bptr + 2) = (byte)*(fptr + 2);
        return result;
    }

}
