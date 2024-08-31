using System.Collections.ObjectModel;

namespace SchemaCompare.Data.Schema;

public class TableCollection : Collection<Table>
{
    public TableCollection()
    {
    }
    public Table Add(string tableName, SchemaObject schema)
    {
        Table table = new()
        {
            Name = tableName,
            Schema = schema
        };
        Add(table);
        return table;
    }
}
