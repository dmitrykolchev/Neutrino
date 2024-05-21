// <copyright file="DataStreamSerializer`1.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Text;

namespace DataStream;

public sealed class DataStreamSerializer
{
    public static readonly DataStreamSerializationOptions DefaultOptions = new();
    internal static readonly Encoding UTF8 = new UTF8Encoding(false);

    private static readonly DataStreamWriterCompiler s_writerCompiler = new();
    private static readonly DataStreamReaderCompiler s_readerCompiler = new();
    private static readonly ConcurrentDictionary<Type, PropertyMap> s_propertyMaps = new();

    public static void Serialize<TItem>(Stream stream, TItem item)
    {
        ArgumentNullException.ThrowIfNull(stream);
        ArgumentNullException.ThrowIfNull(item);
        DataStreamSerializerContext context = new()
        {
            Options = DefaultOptions,
            PropertyMap = GetPropertyMap<TItem>()
        };
        using DataStreamWriter writer = new (stream, context);
        s_writerCompiler.GetOrAdd(item.GetType(), context);
        using var propertyMap= context.PropertyMap.Clone();
        context.PropertyMap = propertyMap;
        Serialize(writer, item, context);
    }

    internal static void Serialize(DataStreamWriter writer, object item, DataStreamSerializerContext context)
    {
        Action<DataStreamWriter, object> serializeAction = s_writerCompiler.Get(item.GetType());
        serializeAction(writer, item);
    }

    public static TItem Deserialize<TItem>(Stream stream)
    {
        ArgumentNullException.ThrowIfNull(stream);
        DataStreamSerializerContext context = new()
        {
            Options = DefaultOptions,
            PropertyMap = GetPropertyMap<TItem>()
        };
        Func<DataStreamReader, TItem> deserializeAction =
            (Func<DataStreamReader, TItem>)s_readerCompiler.GetOrAdd(typeof(TItem), context);

        context.PropertyMap = context.PropertyMap.Clone();
        if (stream is MemoryStream memory && memory.TryGetBuffer(out ArraySegment<byte> buffer))
        {
            return deserializeAction(
                new DataStreamReader(
                    BitConverter.IsLittleEndian
                        ? new SequenceReaderLittleEndian(buffer.Slice(checked((int)stream.Position)))
                        : throw new InvalidOperationException(),
                    context
                ));
        }
        throw new NotImplementedException();
    }


    private static PropertyMap GetPropertyMap<TItem>()
    {
        if (!s_propertyMaps.TryGetValue(typeof(TItem), out PropertyMap? propertyMap))
        {
            propertyMap = new PropertyMap();
            s_propertyMaps.TryAdd(typeof(TItem), propertyMap);
            return propertyMap;
        }
        return s_propertyMaps[typeof(TItem)];
    }
}
