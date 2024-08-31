// <copyright file="Table.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace SchemaCompare.Data.Schema;

public class Table: IDatabaseNamedObject
{
    public Table()
    {
        Columns = new TableColumnCollection();
        Indexes = new TableIndexCollection();
        ForeignKeys = new ForeignKeyConstraintCollection();
    }

    public SchemaObject Schema { get; set; } = null!;

    public string Name { get; set; } = null!;

    public TableColumnCollection Columns { get; }

    public TableIndexCollection Indexes { get; }

    public ForeignKeyConstraintCollection ForeignKeys { get; }

    public PrimaryKeyConstraint? PrimaryKey => Indexes.OfType<PrimaryKeyConstraint>().SingleOrDefault();

    public IEnumerable<CheckConstraint> Checks => Schema.Database.Checks.Where(t => t.Table == this);

    public override string ToString()
    {
        return $"{Schema}.{Name}";
    }

    public bool Equals(Table table)
    {
        if (object.ReferenceEquals(this, table))
        {
            return true;
        }
        if (Enumerable.SequenceEqual(Columns, table.Columns))
        {
            IOrderedEnumerable<UniqueConstraint> thisConstraints = Indexes.OfType<UniqueConstraint>().OrderBy(t => t.Name);
            IOrderedEnumerable<UniqueConstraint> thatConstraints = table.Indexes.OfType<UniqueConstraint>().OrderBy(t => t.Name);
            return Enumerable.SequenceEqual(thisConstraints, thatConstraints);
        }
        return false;
    }
}
