using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchemaGenerator
{
    class DocumentType
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string SchemaName { get; set; }
        public string TableName { get; set; }
        public bool SupportsHistory { get; set; }
    }
}
