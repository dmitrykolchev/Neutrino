// <copyright file="PgSqlSyntaxProvider.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace SchemaCompare.Data.Schema.Syntax;

public class PgSqlSyntaxProvider : SyntaxProvider
{
    public PgSqlSyntaxProvider()
    {
    }
    public override bool SupportsIdentitySpecification => false;

    public override string GetColumnDataType(TableColumn column)
    {
        switch (column.DataType)
        {
            case DataType.BigInt:
                if (column.IsIdentity)
                {
                    return "bigserial";
                }
                return "bigint";
            case DataType.Bool:
                return "boolean";
            case DataType.Date:
                return "date";
            case DataType.DateTime:
                return "timestamp";
            case DataType.Time:
                return "time";
            case DataType.Decimal:
                return $"decimal({column.Precision}, {column.Scale})";
            case DataType.Float:
                return "float";
            case DataType.Int:
                if (column.IsIdentity)
                {
                    return "serial";
                }
                return "int";
            case DataType.Real:
                return "real";
            case DataType.SmallInt:
                if (column.IsIdentity)
                {
                    return "smallserial";
                }
                return "smallint";
            case DataType.Text:
                return "text";
            case DataType.Uuid:
                return "uuid";
            case DataType.VarChar:
                return $"varchar({column.MaxLength})";
            case DataType.DoublePrecision:
                return "double precision";
            case DataType.ByteArray:
                return "bytea";
            case DataType.Xml:
                return "xml";

        }
        throw new InvalidOperationException($"unsupperted data type: {column.DataType}");
    }
}
