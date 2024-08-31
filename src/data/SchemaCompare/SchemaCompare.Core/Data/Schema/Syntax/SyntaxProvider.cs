using System;

namespace SchemaCompare.Data.Schema.Syntax;

public abstract class SyntaxProvider
{
    public static readonly SyntaxProvider PgSql = new PgSqlSyntaxProvider();
    public static readonly SyntaxProvider SqlServer = new SqlServerSyntaxProvider();

    protected SyntaxProvider()
    {
    }

    public virtual bool SupportsIdentitySpecification => false;

    public virtual string IdentitySpecification { get; }

    public abstract string GetColumnDataType(TableColumn column);

    public virtual string GetSequenceDataType(SequenceObject sequence)
    {
        if (sequence == null)
        {
            throw new ArgumentNullException(nameof(sequence));
        }
        switch (sequence.DataType)
        {
            case DataType.BigInt:
                return "bigint";
            case DataType.Int:
                return "int";
            case DataType.SmallInt:
                return "smallint";
            default:
                throw new InvalidOperationException($"unsupported datatype for sequence {sequence.Schema.Name}.{sequence.Name}");
        }
    }
}
