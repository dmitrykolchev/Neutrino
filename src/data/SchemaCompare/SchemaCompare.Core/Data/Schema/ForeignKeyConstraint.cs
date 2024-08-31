using System;
using System.Collections.Generic;
using System.Text;

namespace SchemaCompare.Data.Schema;

public enum RuleSpecification
{
    Unspecified,
    NoAction,
    Rescrict,
    Cascade,
    SetNull,
    SetDefault,
}
public class ForeignKeyConstraint : TableConstraint
{
    public ForeignKeyConstraint()
    {
        Columns = new TableColumnCollection();
    }
    public TableColumnCollection Columns { get; }
    public UniqueConstraint Unique { get; set; }
    public Table Reference => Unique.Table;
    public TableIndexColumnSpecificationCollection ReferenceColumns => Unique.Columns;
    public RuleSpecification OnDelete { get; set; }
    public RuleSpecification OnUpdate { get; set; }
}
