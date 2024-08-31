// <copyright file="ApplicationOptions.cs" company="E5">
// Copyright (c) 2022-23 E5. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Linq;

namespace SchemaCompare;

public class ApplicationOptions
{
    public string SqlScript { get; set; }

    public string PgSqlScript { get; set; }

    public string UpdateScript { get; set; }

    public string ConnectionName { get; set; }

    public ConnectionOptions[] Connections { get; set; }

    public ConnectionOptions GetConnection()
    {
        if (string.IsNullOrEmpty(ConnectionName))
        {
            return Connections[0];
        }
        return Connections.Where(t => t.Name == ConnectionName).Single();
    }
}

public class ConnectionOptions
{
    public string Name { get; set; }

    public string SourceConnectionString { get; set; }

    public string TargetConnectionString { get; set; }
}
