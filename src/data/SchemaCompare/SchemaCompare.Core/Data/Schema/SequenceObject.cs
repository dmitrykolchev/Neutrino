// <copyright file="SequenceObject.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace SchemaCompare.Data.Schema;

public class SequenceObject : IDatabaseNamedObject
{
    public SequenceObject()
    {
    }

    public SchemaObject Schema { get; set; } = null!;

    public string Name { get; set; } = null!;

    public DataType DataType { get; set; }

    public bool Equals(SequenceObject sequence)
    {
        if (sequence.DataType != DataType || sequence.Name != Name || sequence.Schema.Name != Schema.Name)
        {
            return false;
        }
        return true;
    }
}
