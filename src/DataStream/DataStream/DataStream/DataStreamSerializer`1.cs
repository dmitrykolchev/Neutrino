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
        //_deserializeAction = DeserializeAction;
        //(Func<DataStreamReader, TItem>)s_resolver.GetOrAddDeserializer(typeof(TItem), context);
    }

    private TItem DeserializeAction(DataStreamReader reader)
    {
        DataStreamElementType tag = reader.ReadElementType();
        if (tag != DataStreamElementType.StartOfStream)
        {
            throw new InvalidOperationException($"unexpected tag {tag} (required tag is {DataStreamElementType.StartOfStream})");
        }

        TItem result = (TItem)DeserializeObject(reader, typeof(TItem), DataStreamElementType.EndOfStream);

        return result;
    }

    private object DeserializeObject(
        DataStreamReader reader,
        Type type,
        DataStreamElementType endElement)
    {
        object item = Activator.CreateInstance(type)!;

        Dictionary<string, PropertyInfo> properties = type.GetProperties(
            BindingFlags.Instance |
            BindingFlags.Public |
            BindingFlags.SetProperty).ToDictionary(t => t.Name);

        for (int index = 0; ; ++index)
        {
            DataStreamElementType elementType = reader.ReadElementType();
            if(elementType == endElement)
            {
                return item;
            }

            if (index > 1000)
            {
                throw new InvalidOperationException("too many properties");
            }

            string propertyName = reader.ReadProperty(out int _);
            PropertyInfo property = properties[propertyName];
            DataStreamElementType valueTypeTag = reader.ReadElementType();
            switch (valueTypeTag)
            {
                case DataStreamElementType.False:
                    property.SetValue(item, false);
                    break;
                case DataStreamElementType.True:
                    property.SetValue(item, true);
                    break;
                case DataStreamElementType.Byte:
                    property.SetValue(item, reader.ReadByte());
                    break;
                case DataStreamElementType.Int16:
                    property.SetValue(item, reader.ReadInt16());
                    break;
                case DataStreamElementType.Int32:
                    property.SetValue(item, reader.ReadInt32());
                    break;
                case DataStreamElementType.Int64:
                    property.SetValue(item, reader.ReadInt64());
                    break;
                case DataStreamElementType.Double:
                    property.SetValue(item, reader.ReadDouble());
                    break;
                case DataStreamElementType.Single:
                    property.SetValue(item, reader.ReadSingle());
                    break;
                case DataStreamElementType.String:
                    property.SetValue(item, reader.ReadString());
                    break;
                case DataStreamElementType.DateTime:
                    property.SetValue(item, reader.ReadDateTime());
                    break;
                case DataStreamElementType.Decimal:
                    property.SetValue(item, reader.ReadDecimal());
                    break;
                case DataStreamElementType.Guid:
                    property.SetValue(item, reader.ReadGuid());
                    break;
                case DataStreamElementType.Null:
                    property.SetValue(item, null);
                    break;
                case DataStreamElementType.StartOfObject:
                    object value = DeserializeObject(reader, property.PropertyType, DataStreamElementType.EndOfObject);
                    property.SetValue(item, value);
                    break;
                default:
                    if ((valueTypeTag & DataStreamElementType.Enum) != 0)
                    {
                        object enumValue = ReadEnum(reader);
                        property.SetValue(item, Enum.ToObject(property.PropertyType, enumValue));
                    }
                    else if ((valueTypeTag & DataStreamElementType.ArrayOf) != 0)
                    {
                        property.SetValue(item, ReadArray(reader));
                        break;
                    }
                    else
                    {
                        throw new FormatException();
                    }
                    break;
            }
        }
    }

    private object ReadEnum(DataStreamReader reader)
    {
        return (reader.ElementType & DataStreamElementType.EnumTypeMask) switch
        {
            DataStreamElementType.Byte => reader.ReadByte(),
            DataStreamElementType.Int16 => reader.ReadInt16(),
            DataStreamElementType.Int32 => reader.ReadInt32(),
            _ => throw new FormatException()
        };
    }

    private object ReadArray(DataStreamReader reader)
    {
        if ((reader.ElementType & DataStreamElementType.ElementTypeMask) == DataStreamElementType.Byte)
        {
            return reader.ReadBinary();
        }
        throw new FormatException("unsupported type");
    }
}
