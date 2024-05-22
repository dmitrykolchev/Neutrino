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
        ParameterExpression reader,
        DataStreamSerializerContext context)
    {
        Expression readElementType = Read(reader, nameof(DataStreamReader.ReadElementType));

        ParameterExpression result = Variable(type, "root");

        Expression elementType = Property(reader, nameof(DataStreamReader.ElementType));

        Expression checkStartOfStream = IfThen(
                NotEqual(elementType, Constant(DataStreamElementType.StartOfStream)),
                Throw(
                    New(
                        typeof(FormatException).GetConstructor([typeof(string)])!, 
                        Constant("Must be start of stream")
                    )
                )
            );

        Expression readObject = Assign(
            result,
            ReadObjectExpression(type, reader, context, true)
        );

        Expression checkEndOfStream = IfThen(
                NotEqual(elementType, Constant(DataStreamElementType.EndOfStream)),
                Throw(
                    New(
                        typeof(FormatException).GetConstructor([typeof(string)])!,
                        Constant("Must be end of stream")
                    )
                )
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
        ParameterExpression reader,
        DataStreamSerializerContext context,
        bool root)
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
            if (property.GetCustomAttribute<IgnoreAttribute>() == null)
            {
                ReadOnlySpan<byte> data = DataStreamSerializer.UTF8.GetBytes(property.Name);
                Utf8String propertyNameUtf8 = Utf8String.Intern(data);

                context.PropertyMap.TryAdd(propertyNameUtf8, out int caseIndex);

                Expression switchCaseBody = Assign(
                    Property(result, property.Name),
                    ReadValue(reader, property.PropertyType, context)
                );
                cases.Add(SwitchCase(switchCaseBody, Constant(caseIndex)));
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
                root 
                    ? Equal(readElementType, Constant(DataStreamElementType.EndOfStream))
                    : Equal(readElementType, Constant(DataStreamElementType.EndOfObject)),
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
        Type valueType,
        DataStreamSerializerContext context)
    {
        if(valueType.IsGenericType && valueType.GetGenericTypeDefinition() == typeof(Nullable<>))
        {
            return Condition(
                Equal(Property(reader, nameof(DataStreamReader.ElementType)), Constant(DataStreamElementType.Null)),
                Constant(null, valueType),
                Convert(ReadSimpleValue(reader, valueType.GetGenericArguments()[0]), valueType),
                valueType);
        }
        if (valueType == typeof(byte[]))
        {
            return Condition(
                Equal(Property(reader, nameof(DataStreamReader.ElementType)), Constant(DataStreamElementType.Null)),
                Constant(null, valueType),
                Read(reader, nameof(DataStreamReader.ReadBinary)),
                valueType);
        }
        if (IsScalar(valueType) || valueType.IsEnum || valueType == typeof(Guid))
        {
            return ReadSimpleValue(reader, valueType);
        }
        ParameterExpression objectResult = Expression.Variable(valueType);
        return Condition(
            Equal(Property(reader, nameof(DataStreamReader.ElementType)), Constant(DataStreamElementType.Null)),
            Constant(null, valueType),
            Invoke(Lambda(
                Block(
                    [objectResult],
                    IfThen(
                        NotEqual(Property(reader, nameof(DataStreamReader.ElementType)), Constant(DataStreamElementType.StartOfObject)),
                        Throw(
                            New(
                                typeof(FormatException).GetConstructor([typeof(string)])!,
                                Constant("Must be start of object")
                            )
                        )
                    ),
                    Assign(objectResult, ReadObjectExpression(valueType, reader, context, false)),
                    IfThen(
                        NotEqual(Property(reader, nameof(DataStreamReader.ElementType)), Constant(DataStreamElementType.EndOfObject)),
                        Throw(
                            New(
                                typeof(FormatException).GetConstructor([typeof(string)])!,
                                Constant("Must be end of object")
                            )
                        )
                    ),
                    objectResult
                ), reader), 
            reader)
        );
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
        TypeCode typeCode = Type.GetTypeCode(valueType);
        switch (typeCode)
        {
            case TypeCode.Int32:
                return Read(reader, nameof(DataStreamReader.ReadInt32));
            case TypeCode.Int16:
                return Read(reader, nameof(DataStreamReader.ReadInt16));
            case TypeCode.Boolean:
                return Read(reader, nameof(DataStreamReader.GetBoolean));
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

    private Expression Read(Expression reader, string methodName)
    {
        return Call<DataStreamReader>(
            methodName,
            Array.Empty<Type>(),
            reader);
    }
}
