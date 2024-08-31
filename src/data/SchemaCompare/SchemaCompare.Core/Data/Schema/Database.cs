using System.Collections.Generic;
using System.Linq;

namespace SchemaCompare.Data.Schema;

public class Database
{
    public Database()
    {
        Schemas = new SchemaObjectCollection(this);
        Tables = new TableCollection();
        Sequences = new SequenceObjectCollection();
        Checks = new CheckConstraintCollection();
    }

    public SchemaObjectCollection Schemas { get; }

    public TableCollection Tables { get; }

    public SequenceObjectCollection Sequences { get; }

    public Table FindTable(string schemaName, string tableName)
    {
        return Tables.Where(t => t.Schema.Name == schemaName && t.Name == tableName).Single();
    }

    public IEnumerable<UniqueConstraint> GetUniqueConstraints()
    {
        List<UniqueConstraint> list = new();
        foreach (Table table in Tables)
        {
            list.AddRange(table.Indexes.OfType<UniqueConstraint>());
        }
        return list;
    }

    public CheckConstraintCollection Checks { get; }

    public IEnumerable<ForeignKeyConstraint> GetForeignKeys()
    {
        List<ForeignKeyConstraint> list = new();
        foreach (Table table in Tables)
        {
            list.AddRange(table.ForeignKeys);
        }
        return list;
    }
}
