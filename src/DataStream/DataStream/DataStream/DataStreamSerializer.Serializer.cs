// <copyright file="DataStreamSerializer.Serializer.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

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
            PropertyMap = PropertyMap.GetInstance(typeof(TItem))
        };
        using DataStreamWriter writer = new(stream, context);
        s_writerCompiler.TryAdd(item.GetType(), context);

        using PropertyMap propertyMap = context.PropertyMap.Clone();
        context.PropertyMap = propertyMap;
        Serialize(writer, item, context);
    }

    internal static void Serialize(DataStreamWriter writer, object item, DataStreamSerializerContext context)
    {
        Action<DataStreamWriter, object> serializeAction = s_writerCompiler.Get(item.GetType());
        serializeAction(writer, item);
    }
}
