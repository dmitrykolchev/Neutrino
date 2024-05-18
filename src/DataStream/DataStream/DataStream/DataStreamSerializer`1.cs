// <copyright file="DataStreamSerializer`1.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Text;

namespace DataStream;

public class DataStreamSerializer
{
    public static readonly DataStreamSerializationOptions DefaultOptions = new();
    internal static readonly Encoding UTF8 = new UTF8Encoding(false);
    
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

public sealed class DataStreamSerializer<TItem> : DataStreamSerializer
{
    private static readonly DataStreamWriterCompiler s_writerCompiler = new();
    private static readonly DataStreamReaderCompiler s_readerCompiler = new();
    private static readonly ConcurrentDictionary<Type, PropertyMap> s_propertyMaps = new();

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
        DataStreamSerializerContext context = new()
        {
            Options = _options,
            PropertyMap = s_propertyMaps[typeof(TItem)].Clone()
        };
        SerializeInternal(new DataStreamWriter(stream, context), item);
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
        DataStreamSerializerContext context = new()
        {
            Options = _options,
            PropertyMap = s_propertyMaps[typeof(TItem)].Clone()
        };
        if (stream is MemoryStream memory && memory.TryGetBuffer(out ArraySegment<byte> buffer))
        {
            return DeserializeInternal(
                new DataStreamReader(
                    BitConverter.IsLittleEndian
                        ? new SequenceReaderLittleEndian(buffer.Slice(checked((int)stream.Position)))
                        : throw new InvalidOperationException(),
                    context
                ));
        }
        throw new NotImplementedException();
        //return DeserializeInternal(new DataStreamReader(stream));
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
        bool add = false;
        if(!s_propertyMaps.TryGetValue(typeof(TItem), out PropertyMap? propertyMap))
        {
            propertyMap = new PropertyMap();
            add = true;
        }

        DataStreamSerializerContext context = new() { 
            Options = _options,
            PropertyMap = propertyMap
        };

        _serializeAction = (Action<DataStreamWriter, TItem>)s_writerCompiler.GetOrAdd(typeof(TItem), context);
        _deserializeAction = (Func<DataStreamReader, TItem>)s_readerCompiler.GetOrAdd(typeof(TItem), context);
        if(add)
        {
            s_propertyMaps.TryAdd(typeof(TItem), propertyMap);
        }
    }
}
