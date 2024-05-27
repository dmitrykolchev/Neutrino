// <copyright file="DataStreamReaderCompiler.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;
using static System.Linq.Expressions.Expression;

namespace DataStream;

internal class DataStreamReaderCompiler : DataStreamCompilerBase
{
    internal delegate object ReadDelegate(DataStreamReader reader);

    private readonly ConcurrentDictionary<Type, ReadDelegate> _readers = new();

    public ReadDelegate GetOrAdd(Type type)
    {
        ArgumentNullException.ThrowIfNull(type);
        return _readers.GetOrAdd(type, Create);
    }

    public object Invoke(Type type, DataStreamReader reader)
    {
        ReadDelegate read = GetOrAdd(type);
        return read(reader);
    }

    private ReadDelegate Create(Type type)
    {
        ParameterExpression readerParameter = Parameter(typeof(DataStreamReader), "reader");
        Expression body = GetExpression(type, readerParameter);
        LambdaExpression lambda = Lambda<ReadDelegate>(body, readerParameter);
        return (ReadDelegate)lambda.Compile();
    }

    private Expression GetExpression(
        Type type,
        ParameterExpression reader)
    {
        return ReadObjectExpression(type, reader);
    }

    private Expression ReadObjectExpression(
        Type type,
        ParameterExpression reader)
    {
        PropertyInfo[] properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);

        LabelTarget breakTarget = Label("loopBreak");

        ParameterExpression result = Variable(type, "inner");
        Expression newInstance = Assign(result, New(type));
        Expression elementType = Property(reader, nameof(DataStreamReader.ElementType));

        ParameterExpression propertyIndex = Variable(typeof(int), "propertyIndex");

        List<SwitchCase> cases = new();
        foreach (PropertyInfo property in properties)
        {
            PropertyMetadata metadata = new PropertyMetadata(property);
            if (!metadata.Ignore)
            {
                ReadOnlySpan<byte> data = DataStreamSerializer.UTF8.GetBytes(metadata.StreamName);
                Utf8String propertyNameUtf8 = Utf8String.Intern(data);

                PropertyMap.Instance.TryAdd(propertyNameUtf8, out int internalIndex);

                Expression switchCaseBody = Assign(
                    Property(result, metadata.Property.Name),
                    ReadValue(reader, metadata)
                );
                cases.Add(SwitchCase(switchCaseBody, Constant(internalIndex)));
            }
        }
        Expression @switch = Switch(
            typeof(void),
            propertyIndex,
            Throw(
                New(
                    typeof(FormatException).GetConstructor([typeof(string)])!,
                    Constant("Invalid property index")
                )
            ),
            null,
            cases);

        var readElementType = Read(reader, nameof(DataStreamReader.ReadElementType));

        Expression loopBody = Block(
            IfThen(
                Equal(readElementType, Constant(DataStreamElementType.EndOfObject)),
                Break(breakTarget)
            ),
            Assign(propertyIndex, Read(
                reader,
                nameof(DataStreamReader.ReadProperty))
            ),
            Read(reader, nameof(DataStreamReader.ReadElementType)),
            @switch
        );

        Expression loop = Loop(loopBody, breakTarget);

        return Block(
            [result, propertyIndex],
            newInstance,
            loop,
            result
        );
    }

    private Expression ReadValue(
        ParameterExpression reader,
        PropertyMetadata propertyMetadata)
    {
        Type valueType = propertyMetadata.Property.PropertyType;

        if (propertyMetadata.IsNullable())
        {
            return Condition(
                Equal(Property(reader, nameof(DataStreamReader.ElementType)), Constant(DataStreamElementType.Null)),
                Constant(null, valueType),
                Convert(ReadScalar(reader, valueType.GetGenericArguments()[0]), valueType),
                valueType);
        }
        if (propertyMetadata.IsBinary())
        {
            return Condition(
                Equal(Property(reader, nameof(DataStreamReader.ElementType)), Constant(DataStreamElementType.Null)),
                Constant(null, valueType),
                Read(reader, nameof(DataStreamReader.ReadBinary)),
                valueType);
        }
        if (propertyMetadata.IsSimple())
        {
            return ReadSimpleValue(reader, propertyMetadata);
        }
        ParameterExpression objectResult = Variable(valueType);
        Expression deserialize = Call<DataStreamSerializer>(
            nameof(DataStreamSerializer.Deserialize),
            [typeof(DataStreamReader), typeof(Type)],
            null,
            reader, Constant(valueType));
        return Condition(
            Equal(Property(reader, nameof(DataStreamReader.ElementType)), Constant(DataStreamElementType.Null)),
            Constant(null, valueType),
            Convert(deserialize, valueType)
        );
    }

    private Expression ReadSimpleValue(Expression reader, PropertyMetadata property)
    {
        Type valueType = property.Property.PropertyType;
        if (valueType.IsEnum)
        {
            return Convert(ReadScalar(reader, valueType.GetEnumUnderlyingType()), valueType);
        }
        if (valueType == typeof(Guid))
        {
            return Read(reader, nameof(DataStreamReader.ReadGuid));
        }
        if(valueType == typeof(string))
        {
            if (property.Internable)
            {
                return Read(reader, nameof(DataStreamReader.ReadStringIntern));
            }
            return Read(reader, nameof(DataStreamReader.ReadString));
        }
        return ReadScalar(reader, valueType);
    }

    private Expression ReadScalar(Expression reader, Type valueType)
    {
        TypeCode typeCode = Type.GetTypeCode(valueType);
        return typeCode switch
        {
            TypeCode.Int32 => Read(reader, nameof(DataStreamReader.ReadInt32)),
            TypeCode.Int16 => Read(reader, nameof(DataStreamReader.ReadInt16)),
            TypeCode.Boolean => Read(reader, nameof(DataStreamReader.GetBoolean)),
            TypeCode.DateTime => Read(reader, nameof(DataStreamReader.ReadDateTime)),
            TypeCode.Byte => Read(reader, nameof(DataStreamReader.ReadByte)),
            TypeCode.Int64 => Read(reader, nameof(DataStreamReader.ReadInt64)),
            TypeCode.Decimal => Read(reader, nameof(DataStreamReader.ReadDecimal)),
            TypeCode.Double => Read(reader, nameof(DataStreamReader.ReadDouble)),
            TypeCode.Single => Read(reader, nameof(DataStreamReader.ReadSingle)),
            _ => throw new InvalidOperationException($"unsupported type {typeCode} - {valueType}"),
        };
    }

    private Expression Read(Expression reader, string methodName)
    {
        return Call<DataStreamReader>(
            methodName,
            Array.Empty<Type>(),
            reader);
    }
}
