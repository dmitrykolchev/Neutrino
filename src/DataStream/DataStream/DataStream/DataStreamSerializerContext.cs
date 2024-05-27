// <copyright file="DataStreamSerializerContext.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace DataStream;

public class DataStreamSerializerContext : IDisposable
{
    private StreamIndexMap _indexMap;

    public DataStreamSerializerContext()
    {
        _indexMap = StreamIndexMap.Rent();
    }

    public required DataStreamSerializationOptions Options { get; init; }

    internal StreamIndexMap StreamIndexMap => _indexMap;

    public void Dispose()
    {
        StreamIndexMap.Return(_indexMap);
    }
}
