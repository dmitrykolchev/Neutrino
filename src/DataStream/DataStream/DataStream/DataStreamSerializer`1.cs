// <copyright file="DataStreamSerializer`1.cs" company="E5">
// Copyright (c) 2022-23 E5. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Text;

namespace DataStream;

public sealed class DataStreamSerializer<TItem>
{
    private static readonly DataStreamResolver s_resolver = new();
    public static readonly DataStreamSerializationOptions DefaultOptions = new DataStreamSerializationOptions();

    private DataStreamSerializationOptions _options;

    public DataStreamSerializer()
    {
        _options = DefaultOptions;
    }

    public DataStreamSerializer(DataStreamSerializationOptions options)
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
        DataStreamWriterContext context = new() { Options = _options };
        Action<DataStreamWriter, DataStreamWriterContext, TItem> write = 
            (Action<DataStreamWriter, DataStreamWriterContext, TItem>)s_resolver.GetOrAddWriter(typeof(TItem));
        write(writer, context, item);
    }

    public TItem Deserialize(Stream stream)
    {
        ArgumentNullException.ThrowIfNull(stream);

        throw new NotImplementedException();
    }
}
