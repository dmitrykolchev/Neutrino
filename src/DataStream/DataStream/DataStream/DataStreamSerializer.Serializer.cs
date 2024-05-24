// <copyright file="DataStreamSerializer.Serializer.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections;
using System.Runtime.CompilerServices;
using System.Text;

namespace DataStream;

public sealed partial class DataStreamSerializer
{
    public static readonly DataStreamSerializationOptions DefaultOptions = new();
    internal static readonly Encoding UTF8 = new UTF8Encoding(false);

    private static readonly DataStreamWriterCompiler s_writerCompiler = new();

    public static void Serialize<TItem>(Stream stream, TItem item)
    {
        ArgumentNullException.ThrowIfNull(stream);
        ArgumentNullException.ThrowIfNull(item);
        DataStreamSerializerContext context = new()
        {
            Options = DefaultOptions,
        };
        using DataStreamWriter writer = new(stream, context);
        writer.Write(DataStreamElementType.StartOfStream);
        Serialize(writer, item);
        writer.Write(DataStreamElementType.EndOfStream);
    }

    internal static void Serialize(DataStreamWriter writer, object item)
    {
        if (item is IEnumerable items)
        {
            Serialize(writer, items);
        }
        else
        {
            Action<DataStreamWriter, object> write = s_writerCompiler.GetOrAdd(item.GetType());
            writer.Write(DataStreamElementType.StartOfObject);
            write(writer, item);
            writer.Write(DataStreamElementType.EndOfObject);
        }
    }

    internal static void Serialize(DataStreamWriter writer, IEnumerable items)
    {
        writer.Write(DataStreamElementType.ArrayOf | DataStreamElementType.Object);
        foreach (object? item in items)
        {
            Serialize(writer, item);
        }
        writer.Write(DataStreamElementType.EndOfArray);
    }
}
