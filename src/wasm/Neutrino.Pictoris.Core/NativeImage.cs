// <copyright file="NativeImage.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pictoris;

public class NativeImage
{
    private readonly byte[] _data;
    private readonly int _width;
    private readonly int _height;

    internal NativeImage(int width, int height, byte[] data)
    {
        _data = data;
        _width = width;
        _height = height;
    }

    public int Width => _width;

    public int Height => _height;

    public byte[] Data => _data;
}
