﻿// <copyright file="DataStreamWriterContext.cs" company="E5">
// Copyright (c) 2022-23 E5. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace DataStream;

public class DataStreamSerializerContext
{
    public required DataStreamSerializationOptions Options { get; init; }

    public Dictionary<string, int> PropertyNameMap { get; } = new();
}