// <copyright file="DataStreamSerializer`1.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Linq.Expressions;
using System.Reflection;

namespace DataStream;

public sealed class DataStreamSerializer
{
    public static readonly DataStreamSerializationOptions DefaultOptions = new();

    public static DataStreamSerializer<TItem> CreateSerializer<TItem>()
    {
        return CreateSerializer<TItem>(DefaultOptions);
    }

    public static DataStreamSerializer<TItem> CreateSerializer<TItem>(DataStreamSerializationOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);
        DataStreamSerializer<TItem> serializer = new(options);
        serializer.Initialize();
        return serializer;
    }
}

public sealed class DataStreamSerializer<TItem>
{
    private static readonly DataStreamWriterCompiler s_writerCompiler = new();
    private static readonly DataStreamReaderCompiler s_readerCompiler = new();

    private readonly DataStreamSerializationOptions _options;

    private Action<DataStreamWriter, TItem> _serializeAction = null!;
    private Func<DataStreamReader, TItem> _deserializeAction = null!;

    internal DataStreamSerializer(DataStreamSerializationOptions options)
    {
        _options = options ?? throw new ArgumentNullException(nameof(options));
    }

    public void Serialize(Stream stream, TItem item)
    {
        ArgumentNullException.ThrowIfNull(stream);
        ArgumentNullException.ThrowIfNull(item);
        SerializeInternal(new DataStreamWriter(stream), item);
    }

    internal void Serialize(DataStreamWriter writer, TItem item)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(item);
        SerializeInternal(writer, item);
    }

    public TItem Deserialize(Stream stream)
    {
        ArgumentNullException.ThrowIfNull(stream);
        return DeserializeInternal(new DataStreamReader(stream));
    }


    private void SerializeInternal(DataStreamWriter writer, TItem item)
    {
        _serializeAction(writer, item);
    }

    private TItem DeserializeInternal(DataStreamReader reader)
    {
        return _deserializeAction(reader);
    }

    internal void Initialize()
    {
        DataStreamSerializerContext context = new() { Options = _options };
        _serializeAction = (Action<DataStreamWriter, TItem>)s_writerCompiler.GetOrAdd(typeof(TItem), context);
        _deserializeAction = (Func<DataStreamReader, TItem>)s_readerCompiler.GetOrAdd(typeof(TItem), context);
    }
}
