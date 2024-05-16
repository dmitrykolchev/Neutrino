// <copyright file="DataStreamReaderCompiler.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;
using System.Linq.Expressions;
using static System.Linq.Expressions.Expression;
using System.Reflection;

namespace DataStream;

internal class DataStreamReaderCompiler : DataStreamCompilerBase
{
    private readonly ConcurrentDictionary<Type, Delegate> _readers = new();

    public Delegate GetOrAdd(Type type, DataStreamSerializerContext context)
    {
        ArgumentNullException.ThrowIfNull(type);
        ArgumentNullException.ThrowIfNull(context);

        if (!_readers.TryGetValue(type, out Delegate? reader))
        {
            reader = _readers.GetOrAdd(type, t => Create(t, context));
        }
        return reader;
    }

    private Delegate Create(Type type, DataStreamSerializerContext context)
    {

        ParameterExpression readerParameter = Parameter(typeof(DataStreamReader), "reader");

        Expression body = GetExpression(type, readerParameter, context);

        LambdaExpression lambda = Lambda(body, readerParameter);
        return lambda.Compile();
    }

    private Expression GetExpression(
        Type type,
        Expression readerExpression,
        DataStreamSerializerContext context)
    {
        Expression readElementType = Read(readerExpression, nameof(DataStreamReader.ReadElementType));

        ParameterExpression result = Variable(type, "root");

        Expression elementType = Property(readerExpression, nameof(DataStreamReader.ElementType));

        Expression checkStartOfStream = IfThen(
                NotEqual(elementType, Constant(DataStreamElementType.StartOfStream)),
                Throw(New(typeof(FormatException)))
            );

        Expression readObject = Assign(
            result,
            ReadObjectExpression(type, readerExpression, context)
        );

        Expression checkEndOfStream = IfThen(
                NotEqual(elementType, Constant(DataStreamElementType.EndOfStream)),
                Throw(New(typeof(FormatException)))
            );

        return Block(
            [result],
            readElementType,
            checkStartOfStream,
            readObject,
            checkEndOfStream,
            result
        );
    }

    private Expression ReadObjectExpression(
        Type type,
        Expression readerExpression,
        DataStreamSerializerContext context)
    {
        PropertyInfo[] properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.SetProperty);

        ParameterExpression result = Variable(type, "inner");
        Expression newInstance = Assign(result, New(type));
        Expression readElementType = Read(readerExpression, nameof(DataStreamReader.ReadElementType));
        Expression elementType = Property(readerExpression, nameof(DataStreamReader.ElementType));

        Expression checkEndOfObject = IfThen(
                AndAlso(
                    NotEqual(elementType, Constant(DataStreamElementType.EndOfStream)),
                    NotEqual(elementType, Constant(DataStreamElementType.EndOfObject))
                ),
                Throw(New(typeof(FormatException)))
            );
        
        Expression propertyName = Variable(typeof(string), "propertyName");
        Expression readRropertyName = Assign(propertyName, Read(
            readerExpression,
            nameof(DataStreamReader.ReadProperty)));

        List<SwitchCase> cases = new();
        foreach (PropertyInfo property in properties)
        {
            Expression left = Property(result, property.Name);
            Expression right = ReadValue(readerExpression, property.PropertyType);
            Expression propertyReadAndAssign = Assign(left, right);
            cases.Add(SwitchCase(propertyReadAndAssign, Constant(property.Name)));
        }
        Expression @switch = Switch(typeof(void), propertyName, null, null, cases.ToArray());

        return Block(
            [result],
            newInstance,
            readElementType,
            checkEndOfObject,
            propertyName,
            readRropertyName,
            @switch,
            result
        );
    }

    private Expression ReadValue(Expression reader, Type valueType)
    {
        if(valueType.IsGenericType && valueType.GetGenericTypeDefinition() == typeof(Nullable<>))
        {
            return Convert(ReadSimpleValue(reader, valueType.GetGenericArguments()[0]), valueType);
        }
        return ReadSimpleValue(reader, valueType);
    }

    private Expression ReadSimpleValue(Expression reader, Type valueType)
    {
        if (valueType.IsEnum)
        {
            return Convert(ReadSimpleValue(reader, valueType.GetEnumUnderlyingType()), valueType);
        }
        if (valueType == typeof(Guid))
        {
            return Read(reader, nameof(DataStreamReader.ReadGuid));
        }
        if (valueType == typeof(byte[]))
        {
            return Read(reader, nameof(DataStreamReader.ReadBinary));
        }
        TypeCode typeCode = Type.GetTypeCode(valueType);
        switch (typeCode)
        {
            case TypeCode.Int32:
                return Read(reader, nameof(DataStreamReader.ReadInt32));
            case TypeCode.Int16:
                return Read(reader, nameof(DataStreamReader.ReadInt16));
            case TypeCode.Boolean:
                return Read(reader, nameof(DataStreamReader.ReadBoolean));
            case TypeCode.String:
                return Read(reader, nameof(DataStreamReader.ReadString));
            case TypeCode.DateTime:
                return Read(reader, nameof(DataStreamReader.ReadDateTime));
            case TypeCode.Byte:
                return Read(reader, nameof(DataStreamReader.ReadByte));
            case TypeCode.Int64:
                return Read(reader, nameof(DataStreamReader.ReadInt64));
            case TypeCode.Decimal:
                return Read(reader, nameof(DataStreamReader.ReadDecimal));
            case TypeCode.Double:
                return Read(reader, nameof(DataStreamReader.ReadDouble));
            case TypeCode.Single:
                return Read(reader, nameof(DataStreamReader.ReadSingle));
            default:
                return Convert(Constant(null), valueType);
        }
    }

    private Expression Read(Expression readerExpression, string methodName)
    {
        return Call<DataStreamReader>(
            methodName,
            Array.Empty<Type>(),
            readerExpression);
    }
}
