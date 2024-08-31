using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using SchemaCompare.Data.Internal;
using SchemaCompare.Data.Schema;
using SchemaCompare.Data.Schema.Syntax;

namespace SchemaCompare.Data;

public class ScriptGenerator
{
    public ScriptGenerator(TextWriter writer, SyntaxProvider syntaxProvider = null)
    {
        Writer = writer;
        Buffer = new IndentedStringBuilder();
        Syntax = syntaxProvider ?? SyntaxProvider.PgSql;
    }

    internal ScriptGenerator(IndentedStringBuilder buffer, SyntaxProvider syntaxProvider = null)
    {
        Buffer = buffer;
        Syntax = syntaxProvider ?? SyntaxProvider.PgSql;
    }

    private IndentedStringBuilder Buffer { get; }

    private TextWriter Writer { get; }

    private SyntaxProvider Syntax { get; }

    public void Run(Database database)
    {
        PrintOut(database);
        Writer.Write(Buffer.ToString());
    }

    private void PrintOut(Database database)
    {
        List<SchemaObject> schemas = database.Schemas.OrderBy(t => t.Name).ToList();
        foreach (SchemaObject schema in schemas)
        {
            PrintOut(schema);

            var sequences = schema.Sequences.OrderBy(t => t.Name);
            foreach (SequenceObject sequence in sequences)
            {
                Create(sequence);
            }

            Buffer.AppendLine();

            var tableList = schema.Tables.OrderBy(t => t.Name);
            foreach (Table table in tableList)
            {
                PrintOut(table);
            }
        }

        foreach (SchemaObject schema in schemas)
        {
            var tableList = schema.Tables.OrderBy(t => t.Name);
            foreach (Table table in tableList)
            {
                foreach (ForeignKeyConstraint key in table.ForeignKeys.OrderBy(t => t.Name))
                {
                    PrintOut(key);
                }
            }
        }
    }

    public void Create(TableIndexBase index, bool noDrop)
    {
        string columns = string.Join(", ", index.Columns.Select(t => t.Column.GetSafeName()));
        if (index is UniqueConstraint unique) // unique или primary key
        {
            if (index is PrimaryKeyConstraint)
            {
                // ничего не делаем т.к. первичный ключ уже создали вместе с таблицей
            }
            else
            {
                if (!noDrop)
                {
                    Buffer.AppendLine($"alter table {index.Table.Schema.GetSafeName()}.{index.Table.GetSafeName()}\n\tdrop constraint if exists {index.GetSafeName()};");
                }
                Buffer.AppendLine($"alter table {index.Table.Schema.GetSafeName()}.{index.Table.GetSafeName()}\n\tadd constraint {index.GetSafeName()} unique ({columns});");
            }
        }
        else if (index is TableIndex idx)
        {
            if (!noDrop)
            {
                Buffer.AppendLine($"drop index if exists {idx.Table.Schema.GetSafeName()}.{idx.GetSafeName()};");
            }
            if (index is UniqueIndex uniqueIndex)
            {
                if (string.IsNullOrEmpty(uniqueIndex.FilterDefinition))
                {
                    Buffer.AppendLine($"create unique index {idx.GetSafeName()} on {idx.Table.Schema.GetSafeName()}.{idx.Table.GetSafeName()} ({columns});");
                }
                else
                {
                    string predicate = uniqueIndex.FilterDefinition.ToLower().Replace("[", string.Empty).Replace("]", string.Empty);
                    Buffer.AppendLine($"create unique index {idx.GetSafeName()} on {idx.Table.Schema.GetSafeName()}.{idx.Table.GetSafeName()} ({columns}) where {predicate};");
                }
            }
            else
            {
                Buffer.AppendLine($"create index {idx.GetSafeName()} on {idx.Table.Schema.GetSafeName()}.{idx.Table.GetSafeName()} ({columns});");
            }
        }
        Buffer.AppendLine();
    }

    public void Drop(TableIndexBase index)
    {
        string columns = string.Join(", ", index.Columns.Select(t => t.Column.GetSafeName()));
        if (index is UniqueConstraint unique)
        {
            Buffer.AppendLine($"alter table {index.Table.Schema.GetSafeName()}.{index.Table.GetSafeName()}\n\tdrop constraint if exists {index.GetSafeName()};");
        }
        else if (index is TableIndex)
        {
            Buffer.AppendLine($"drop index if exists {index.Schema.GetSafeName()}.{index.GetSafeName()};");
        }
        else
        {
            throw new InvalidOperationException();
        }
        Buffer.AppendLine();
    }

    public void Create(SequenceObject sequence)
    {
        Buffer.AppendLine($"create sequence {sequence.Schema.GetSafeName()}.{sequence.GetSafeName()} as {Syntax.GetSequenceDataType(sequence)} increment by 1 no maxvalue start with 1 no cycle;");
    }

    public void Alter(SequenceObject sequence)
    {
        Buffer.AppendLine($"alter sequence {sequence.Schema.GetSafeName()}.{sequence.GetSafeName()} as {Syntax.GetSequenceDataType(sequence)};");
    }

    public void Drop(SequenceObject sequence)
    {
        Buffer.AppendLine($"drop sequence {sequence.Schema.GetSafeName()}.{sequence.GetSafeName()};");
    }

    private void PrintOut(SchemaObject schema)
    {
        Buffer.AppendLine($"create schema {schema.GetSafeName()};");
        Buffer.AppendLine();
    }

    internal void PrintOut(Table table, bool printOutChecks = true)
    {
        Buffer.AppendLine($"create table {table.Schema.GetSafeName()}.{table.GetSafeName()}");
        Buffer.AppendLine("(");
        using (Buffer.Indent())
        {
            bool needSeparatop = false;
            foreach (TableColumn column in table.Columns)
            {
                if (needSeparatop)
                {
                    Buffer.AppendLine(",");
                }
                PrintOut(column);
                needSeparatop = true;
            }
            if (table.PrimaryKey != null)
            {
                Buffer.AppendLine(",");
                PrintOut(table.PrimaryKey);
            }
            foreach (TableIndexBase tableIndex in table.Indexes.OrderBy(t => t.Schema.Name).ThenBy(t => t.Name))
            {
                if (tableIndex is UniqueConstraint && tableIndex is not PrimaryKeyConstraint)
                {
                    Buffer.AppendLine(",");
                    PrintOut(tableIndex);
                }
            }
            if (printOutChecks)
            {
                IEnumerable<CheckConstraint> checks = table.Checks;
                foreach (CheckConstraint item in checks)
                {
                    Buffer.AppendLine(",");
                    PrintOut(item);
                }
            }
        }
        Buffer.AppendLine();
        Buffer.AppendLine(");");
        Buffer.AppendLine();
    }

    private void PrintOut(CheckConstraint check)
    {
        Buffer.Append($"constraint {check.GetSafeName()} check {check.Clause}");
    }

    private void PrintOut(TableColumn column)
    {
        string dataType = Syntax.GetColumnDataType(column);
        string nullable = column.Nullable ? "null" : "not null";
        Buffer.Append($"{column.GetSafeName(),-32} {dataType,-16} {nullable,-8}".TrimEnd());
        if (Syntax.SupportsIdentitySpecification && column.IsIdentity)
        {
            Buffer.Append(" ");
            Buffer.Append(Syntax.IdentitySpecification);
        }
        if (!string.IsNullOrEmpty(column.DefaultConstraint) && !column.IsIdentity)
        {
            Buffer.Append(" default ");
            Buffer.Append(column.DefaultConstraint);
        }
    }

    private void PrintOut(ForeignKeyConstraint key)
    {
        Buffer.AppendLine($"alter table {key.Table.Schema.GetSafeName()}.{key.Table.GetSafeName()}");
        using (Buffer.Indent())
        {
            Buffer.Append($"add constraint {key.GetSafeName()} foreign key (");
            Buffer.Append(string.Join(", ", key.Columns.Select(t => t.Name)));
            Buffer.AppendLine(")");
            using (Buffer.Indent())
            {
                Buffer.Append($"references {key.Reference.Schema.Name}.{key.Reference.Name} (");
                Buffer.Append(string.Join(", ", key.ReferenceColumns.Select(t => t.Column.Name)));
                Buffer.Append(")");

                if (key.OnUpdate != RuleSpecification.NoAction)
                {
                    switch (key.OnUpdate)
                    {
                        case RuleSpecification.Cascade:
                            Buffer.Append(" on update cascade");
                            break;
                        case RuleSpecification.Rescrict:
                            Buffer.Append(" on update restrict");
                            break;
                        case RuleSpecification.SetDefault:
                            Buffer.Append(" on update set default");
                            break;
                        case RuleSpecification.SetNull:
                            Buffer.Append(" on update set null");
                            break;
                        default:
                            throw new InvalidOperationException();
                    }
                }
                if (key.OnDelete != RuleSpecification.NoAction)
                {
                    switch (key.OnDelete)
                    {
                        case RuleSpecification.Cascade:
                            Buffer.Append(" on delete cascade");
                            break;
                        case RuleSpecification.Rescrict:
                            Buffer.Append(" on delete restrict");
                            break;
                        case RuleSpecification.SetDefault:
                            Buffer.Append(" on delete set default");
                            break;
                        case RuleSpecification.SetNull:
                            Buffer.Append(" on delete set null");
                            break;
                        default:
                            throw new InvalidOperationException();
                    }
                }
                Buffer.AppendLine(";");
                Buffer.AppendLine();
            }
        }
    }

    private void PrintOut(TableIndexBase index)
    {
        switch (index)
        {
            case PrimaryKeyConstraint primaryKey:
                Buffer.Append($"constraint {index.GetSafeName()} primary key (");
                break;
            case UniqueConstraint unique:
                Buffer.Append($"constraint {index.GetSafeName()} unique (");
                break;
            default:
                throw new InvalidOperationException("unsupported constraint");
        }
        using (Buffer.Indent())
        {
            Buffer.Append(string.Join(", ", index.Columns.Select(t => t.Column.Name)));
            Buffer.Append(")");
        }
    }
}
