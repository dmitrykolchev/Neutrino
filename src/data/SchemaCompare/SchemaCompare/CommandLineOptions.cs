// <copyright file="CommandLineOptions.cs" company="E5">
// Copyright (c) 2022-23 E5. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using Sam.CommandLine;

namespace SchemaCompare;

public class CommandLineOptions
{
    [Parameter(Required = false)]
    public string? ConnectionName { get; set; }

    [Parameter(Required = false)]
    public string? SqlScript { get; set; }

    [Parameter(Required = false)]
    public string? PgSqlScript { get; set; }

    [Parameter(Required = false)]
    public string? UpdateScript { get; set; }
}
