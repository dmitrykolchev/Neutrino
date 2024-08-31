// <copyright file="CheckConstraint.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace SchemaCompare.Data.Schema;

public class CheckConstraint : TableConstraint
{
    public CheckConstraint()
    {
    }

    public string Clause { get; set; } = null!;
}
