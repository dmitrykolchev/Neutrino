// <copyright file="TableConstraint.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace SchemaCompare.Data.Schema;

public abstract class TableConstraint : IDatabaseNamedObject
{
    protected TableConstraint()
    {
    }

    public SchemaObject Schema { get; set; } = null!;

    public Table Table { get; set; } = null!;

    public string Name { get; set; } = null!;
}
