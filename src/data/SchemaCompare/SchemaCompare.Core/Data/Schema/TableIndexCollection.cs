using System.Collections.ObjectModel;

namespace SchemaCompare.Data.Schema;

public class TableIndexCollection : Collection<TableIndexBase>
{
    public TableIndexCollection()
    {
    }

    protected override void InsertItem(int index, TableIndexBase item)
    {
        base.InsertItem(index, item);
    }
}
