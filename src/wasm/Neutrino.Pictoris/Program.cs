// <copyright file="Program.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.InteropServices.JavaScript;
using Neutrino.Pictoris;

internal class Program
{
    private static void Main(string[] args)
    {
    }
}

public partial class PictorisGlobal
{
    private static Image? _picture;

    [JSExport]
    internal static void Initialize(byte[] data, int width, int height)
    {
        _picture = Image.Create(data, width, height);
    }

    [JSExport]
    [return: JSMarshalAs<JSType.MemoryView>]
    internal static ArraySegment<byte> SetBrightness([JSMarshalAs<JSType.Number>] float factor)
    {
        if (_picture == null)
        {
            throw new InvalidOperationException();
        }
        NativeImage nativeImage = _picture.AdjustBrightness(factor);
        return nativeImage.Data;
    }

    [JSExport]
    [return: JSMarshalAs<JSType.MemoryView>]
    internal static ArraySegment<byte> AdjustGamma([JSMarshalAs<JSType.Number>] float factor)
    {
        if (_picture == null)
        {
            throw new InvalidOperationException();
        }
        NativeImage nativeImage = _picture.AdjustGamma(factor);
        return nativeImage.Data;
    }

    [JSExport]
    [return: JSMarshalAs<JSType.MemoryView>]
    internal static ArraySegment<byte> FlipVertical()
    {
        if (_picture == null)
        {
            throw new InvalidOperationException();
        }
        _picture.FlipVertical();
        return _picture.ToNative().Data;
    }

    [JSExport]
    [return: JSMarshalAs<JSType.MemoryView>]
    internal static ArraySegment<byte> FlipHorizontal()
    {
        if (_picture == null)
        {
            throw new InvalidOperationException();
        }
        _picture.FlipHorizontal();
        return _picture.ToNative().Data;
    }

    [JSImport("window.location.href", "main.js")]
    internal static partial string GetHRef();

    [JSImport("window.pictoris.refreshWindow", "main.js")]
    internal static partial void RefreshWindow();
}
