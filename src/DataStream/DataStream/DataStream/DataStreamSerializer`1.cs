// <copyright file="DataStreamSerializer`1.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

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
        DataStreamSerializer<TItem> serializer = new (options);
        serializer.Initialize();
        return serializer;
    }
}

public sealed class DataStreamSerializer<TItem>
{
    private static readonly DataStreamResolver s_resolver = new();
    private readonly DataStreamSerializationOptions _options;
    private Action<DataStreamWriter, TItem> _serializeAction = null!;

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

    public void Serialize(DataStreamWriter writer, TItem item)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(item);
        SerializeInternal(writer, item);
    }

    private void SerializeInternal(DataStreamWriter writer, TItem item)
    {
        _serializeAction(writer, item);
    }
    
    internal void Initialize()
    {
        DataStreamSerializerContext context = new() { Options = _options };
        _serializeAction = (Action<DataStreamWriter, TItem>)s_resolver.GetOrAddWriter(typeof(TItem), context);
    }
}
