using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchemaGenerator
{
    class DocumentState
    {
        public short Value { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public override string ToString()
        {
            return $"{Code}[{Value}] - {Name}";
        }
    }
}
