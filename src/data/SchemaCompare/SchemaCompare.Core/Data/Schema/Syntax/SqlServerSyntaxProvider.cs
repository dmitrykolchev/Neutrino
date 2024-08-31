using System;

namespace SchemaCompare.Data.Schema.Syntax;

public class SqlServerSyntaxProvider : SyntaxProvider
{
    public SqlServerSyntaxProvider()
    {

    }
    public override bool SupportsIdentitySpecification => true;
    public override string IdentitySpecification => "identity";
    public override string GetColumnDataType(TableColumn column)
    {
        switch (column.DataType)
        {
            case DataType.BigInt:
                return "bigint";
            case DataType.Bool:
                return "bit";
            case DataType.Date:
                return "date";
            case DataType.DateTime:
                return "datetime2";
            case DataType.Time:
                return "time";
            case DataType.Decimal:
                return $"decimal({column.Precision}, {column.Scale})";
            case DataType.Float:
                return "float";
            case DataType.Int:
                return "int";
            case DataType.Real:
                return "real";
            case DataType.SmallInt:
                return "smallint";
            case DataType.Text:
                if (column.IsUnicode)
                {
                    return "nvarchar(max)";
                }
                return "varchar(max)";
            case DataType.Uuid:
                return "uniqueidentifier";
            case DataType.VarChar:
                if (column.IsUnicode)
                {
                    return $"nvarchar({column.MaxLength})";
                }
                return $"varchar({column.MaxLength})";
        }
        throw new InvalidOperationException("unsopperted data type");
    }
}
