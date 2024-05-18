// <copyright file="Optimizations.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace DataStreamBenchmarks;
internal class Optimizations : IDisposable
{
    private ArraySegment<byte> _data;
    private Stream _stream;

    public Optimizations()
    {
        MemoryStream stream = new ();
        stream.Write([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
        stream.Position = 8;
        byte[] buffer = new byte[8];
        stream.Read(buffer, 0, 8);
        stream.TryGetBuffer(out _data);
        _data = _data.Slice((int)stream.Position);
        _stream = stream;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public short ReadInt16()
    {
        ArraySegment<byte> slice = _data.Slice(0, sizeof(short));
        short val0 = MemoryMarshal.Cast<byte, short>(slice)[0];
        return val0;
    }

    public void Dispose()
    {
        throw new NotImplementedException();
    }
}
