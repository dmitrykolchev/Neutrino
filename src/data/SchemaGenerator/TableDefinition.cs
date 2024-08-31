using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchemaGenerator
{
    public class TableDefinition
    {
        public string SchemaName { get; set; }
        public string TableName { get; set; }
        public string SchemaSpecifiedName => $"\"{SchemaName}\".\"{TableName}\"";
        public List<ColumnDefinition> Columns { get; } = new List<ColumnDefinition>();
    }
}
