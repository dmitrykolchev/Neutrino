// <copyright file="DataStreamReader.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Text;

namespace DataStream;

public class DataStreamReader : IDisposable
{
    private readonly BinaryReader _reader;

    public DataStreamReader(Stream stream)
    {
        ArgumentNullException.ThrowIfNull(stream);
        _reader = new BinaryReader(stream, Encoding.UTF8, true);
    }

    public DataStreemTypeTag ReadTypeTag()
    {
        return (DataStreemTypeTag)_reader.ReadByte();
    }

    public void Dispose()
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        _reader.Dispose();
        GC.SuppressFinalize(this);
    }
}
