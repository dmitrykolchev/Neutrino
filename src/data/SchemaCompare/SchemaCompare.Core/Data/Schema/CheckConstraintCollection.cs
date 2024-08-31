// <copyright file="CheckConstraintCollection.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.ObjectModel;

namespace SchemaCompare.Data.Schema;

public class CheckConstraintCollection : Collection<CheckConstraint>
{
    public CheckConstraintCollection()
    {
    }
}
