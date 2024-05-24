// <copyright file="DataStreamSerializationOptions.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace DataStream;

public enum DateTimeSerializationMode
{
    //
    // Summary:
    //     Treat as local time. If the System.DateTime object represents a Coordinated Universal
    //     Time (UTC), it is converted to the local time.
    Local = 0,
    //
    // Summary:
    //     Treat as a UTC. If the System.DateTime object represents a local time, it is
    //     converted to a UTC.
    Utc = 1,
    //
    // Summary:
    //     Treat as a local time if a System.DateTime is being converted to a string. If
    //     a string is being converted to System.DateTime, convert to a local time if a
    //     time zone is specified.
    Unspecified = 2
}

public class DataStreamSerializationOptions
{
    public DateTimeSerializationMode DateTimeSerializationMode { get; init; } = DateTimeSerializationMode.Utc;

    public int MaximumCollectionLength { get; init; } = 1024 * 1024;
}
