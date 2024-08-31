using System.Collections.ObjectModel;
using System.Linq;

namespace SchemaCompare.Data.Schema;

public class TableColumnCollection : Collection<TableColumn>
{
    public TableColumnCollection()
    {
    }
    public TableColumn this[string columnName] => this.Where(t => t.Name == columnName).Single();
}
