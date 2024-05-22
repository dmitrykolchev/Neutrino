// <copyright file="DataStreamSerializer.Deserializer.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace DataStream;

public sealed partial class DataStreamSerializer
{
    private static readonly DataStreamReaderCompiler s_readerCompiler = new();

    public static TItem Deserialize<TItem>(Stream stream)
    {
        ArgumentNullException.ThrowIfNull(stream);
        DataStreamSerializerContext context = new()
        {
            Options = DefaultOptions,
            PropertyMap = PropertyMap.GetInstance(typeof(TItem))
        };

        s_readerCompiler.TryAdd(typeof(TItem), context);

        if (stream is MemoryStream memory && memory.TryGetBuffer(out ArraySegment<byte> buffer))
        {
            DataStreamReader reader = new(
                    BitConverter.IsLittleEndian
                        ? new SequenceReaderLittleEndian(buffer.Slice(checked((int)stream.Position)))
                        : throw new InvalidOperationException(),
                    context);
            context.StreamIndexMap = new StreamIndexMap(context.PropertyMap);
            return (TItem)Deserialize(typeof(TItem), reader);
        }
        throw new NotImplementedException();
    }

    private static object Deserialize(Type type, DataStreamReader reader)
    {
        Func<DataStreamReader, object> deserializeAction = s_readerCompiler.Get(type);
        return deserializeAction(reader);
    }
}
