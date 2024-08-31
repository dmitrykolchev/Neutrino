using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchemaGenerator
{
    enum PropertyInformationState : short
    {
        Active = 1,
        Inactive = 2
    }
    enum BasePropertySet
    {
        IdOnly,
        ShortList,
        FullList,
        All
    }
    class PropertyInformation
    {
        public int Id { get; set; }
        public PropertyInformationState State { get; set; }
        public int DocumentTypeId { get; set; }
        public int Ordinal { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public DbDataType DataType { get; set; }
        public Nullable<int> MaximumLength { get; set; }
        public Nullable<int> NumericPrecision { get; set; }
        public Nullable<int> NumericScale { get; set; }
        public bool Nullable { get; set; }
        public bool Generated { get; set; }
        public bool CanSet { get; set; }
        public bool CanUpdate { get; set; }
        public bool Historical { get; set; }
        public BasePropertySet BaseSet { get; set; }
        public override string ToString()
        {
            return $"{Name}[{DocumentTypeId}] {DataType} {BaseSet}";
        }
    }
}
