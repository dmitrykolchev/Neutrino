using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchemaGenerator
{
    public enum ColumnNullable
    {
        No,
        Yes
    }
    public enum DbDataType
    {
        @Int,
        @SmallInt,
        @NVarChar,
        @Bit,
        @Date,
        @DateTime,
        @DateTime2,
        @VarChar,
        @Decimal,
        @Char
    }
    public class ColumnDefinition
    {
        public string ColumnName { get; set; }
        public ColumnNullable IsNullable { get; set; }
        public DbDataType DataType { get; set; }
        public Nullable<int> CharacterMaximumLength { get; set; }
        public Nullable<int> NumericPrecision { get; set; }
        public Nullable<int> NumericScale { get; set; }
        public bool IsIdentity { get; set; }
        public override string ToString()
        {
            return $"[{ColumnName}] {DataType}, Nullable: {IsNullable}";
        }
        public bool IsStateColumn
        {
            get { return ColumnName.ToLower() == "name" && DataType == DbDataType.SmallInt; }
        }
        public Type ClrDataType
        {
            get
            {
                switch (DataType)
                {
                    case DbDataType.Bit:
                        return typeof(bool);
                    case DbDataType.SmallInt:
                        return typeof(short);
                    case DbDataType.Date:
                        return typeof(DateTime);
                    case DbDataType.DateTime2:
                        return typeof(DateTime);
                    case DbDataType.Int:
                        return typeof(int);
                    case DbDataType.NVarChar:
                        return typeof(string);
                    case DbDataType.VarChar:
                        return typeof(string);
                    case DbDataType.Decimal:
                        return typeof(decimal);
                    case DbDataType.Char:
                        return typeof(string);
                    default:
                        throw new InvalidOperationException();
                }
            }
        }
    }
}
