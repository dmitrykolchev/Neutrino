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
            Options = DefaultOptions
        };

        if (stream is MemoryStream memory && memory.TryGetBuffer(out ArraySegment<byte> buffer))
        {
            DataStreamReader reader = new(
                    BitConverter.IsLittleEndian
                        ? new SequenceReaderLittleEndian(buffer.Slice(checked((int)stream.Position)))
                        : throw new InvalidOperationException(),
                    context);
            return (TItem)DeserializeCore(reader, typeof(TItem));
        }
        throw new NotImplementedException();
    }

    private static object DeserializeCore(DataStreamReader reader, Type type)
    {
        reader.ReadElementType();
        if (reader.ElementType != DataStreamElementType.StartOfStream)
        {
            throw new FormatException();
        }
        reader.ReadElementType();

        object value = Deserialize(reader, type);

        reader.ReadElementType();
        if (reader.ElementType != DataStreamElementType.EndOfStream)
        {
            throw new FormatException();
        }
        return value;
    }

    private static object Deserialize(DataStreamReader reader, Type type)
    {
        if (reader.ElementType == DataStreamElementType.StartOfObject)
        {
            Func<DataStreamReader, object> deserializeAction = s_readerCompiler.GetOrAdd(type);
            object value = deserializeAction(reader);
            if (reader.ElementType != DataStreamElementType.EndOfObject)
            {
                throw new FormatException();
            }
            return value;
        }
        else if(reader.ElementType == (DataStreamElementType.ArrayOf | DataStreamElementType.Object))
        {
            Type elementType = type.FindElementType();
            System.Collections.IList list = (System.Collections.IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(elementType))!;
            for (int i = 0, maxLength = reader.Context.Options.MaximumCollectionLength; i < maxLength  ; ++i)
            {
                reader.ReadElementType();
                if (reader.ElementType == DataStreamElementType.StartOfObject)
                {
                    list.Add(Deserialize(reader, elementType));
                }
                else if (reader.ElementType == DataStreamElementType.EndOfArray)
                {
                    Array array = Array.CreateInstance(elementType, list.Count);
                    list.CopyTo(array, 0);
                    return array;
                }
                else
                {
                    throw new FormatException($"unexpected tag {reader.ElementType}");
                }
            }
            throw new InvalidOperationException("collection too long");
        }
        else
        {
            throw new FormatException();
        }
    }
}
