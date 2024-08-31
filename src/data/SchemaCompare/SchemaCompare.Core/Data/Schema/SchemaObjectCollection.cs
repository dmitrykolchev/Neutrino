using System.Collections.ObjectModel;
using System.Linq;

namespace SchemaCompare.Data.Schema;

public class SchemaObjectCollection : Collection<SchemaObject>
{
    public SchemaObjectCollection(Database owner)
    {
        Owner = owner;
    }
    private Database Owner { get; }

    public SchemaObject this[string name] => this.Where(t => t.Name == name).FirstOrDefault();

    public SchemaObject GetOrAdd(string schemaName)
    {
        SchemaObject schemaObject = this.Where(t => t.Name == schemaName).FirstOrDefault();
        if (schemaObject == null)
        {
            schemaObject = new SchemaObject { Name = schemaName };
            Add(schemaObject);
        }
        return schemaObject;
    }
    protected override void InsertItem(int index, SchemaObject item)
    {
        item.Database = Owner;
        base.InsertItem(index, item);
    }
}
