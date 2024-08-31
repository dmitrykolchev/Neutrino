// <copyright file="UpdateScriptGenerator.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using SchemaCompare.Data.Internal;
using SchemaCompare.Data.Schema;
using SchemaCompare.Data.Schema.Syntax;

namespace SchemaCompare.Data;

public class UpdateScriptGenerator
{
    public UpdateScriptGenerator(Database source, Database destination)
    {
        Source = source;
        Destination = destination;
    }
    private Database Source { get; }

    private Database Destination { get; }

    private IndentedStringBuilder Buffer { get; } = new IndentedStringBuilder();

    public void Generate(TextWriter writer)
    {
        GenerateDropForeignKeys();
        GenerateDropCheckConstraints();
        UpdateSchemas();
        GenerateCreateCheckConstraints();
        GenerateCreateForeignKeys();
        writer.Write(Buffer.ToString());
    }

    private void UpdateSchemas()
    {
        List<SchemaObject> sourceSchemas = Source.Schemas.OrderBy(t => t.Name).ToList();
        Dictionary<string, SchemaObject> destinationSchemas = Destination.Schemas.ToDictionary(t => t.Name);

        foreach (SchemaObject schema in sourceSchemas)
        {
            if (destinationSchemas.TryGetValue(schema.Name, out SchemaObject? value))
            {
                UpdateSchema(schema, value);
                destinationSchemas.Remove(value.Name);
            }
            else
            {
                CreateSchema(schema);
            }
        }
        foreach (SchemaObject schema in destinationSchemas.Values)
        {
            DropSchema(schema);
        }
    }

    private void DropSchema(SchemaObject schema)
    {
        Buffer.AppendLine($"drop schema {schema.Name};");
    }

    private void UpdateSchema(SchemaObject sourceSchema, SchemaObject destinationSchema)
    {
        List<SequenceObject> sourceSequences = sourceSchema.Sequences.OrderBy(t => t.Name).ToList();
        Dictionary<string, SequenceObject> destinationSequences = destinationSchema.Sequences.ToDictionary(t => t.Name);
        foreach (SequenceObject sequence in sourceSequences)
        {
            if (destinationSequences.TryGetValue(sequence.Name, out SequenceObject value))
            {
                UpdateSequence(sequence, value);
                destinationSequences.Remove(value.Name);
            }
            else
            {
                CreateSequence(sequence);
            }
        }
        foreach (SequenceObject sequence in destinationSequences.Values)
        {
            DropSequence(sequence);
        }
        // обновляем таблицы
        List<Table> sourceTables = sourceSchema.Tables.OrderBy(t => t.Name).ToList();
        Dictionary<string, Table> destinationTables = destinationSchema.Tables.ToDictionary(t => t.Name);
        foreach (Table table in sourceTables)
        {
            if (destinationTables.TryGetValue(table.Name, out Table? value))
            {
                UpdateTable(table, value);
                destinationTables.Remove(value.Name);
            }
            else
            {
                CreateTable(table);
            }
        }
        // удаляем несуществующие таблицы
        foreach (Table table in destinationTables.Values)
        {
            DropTable(table);
        }

        // создаем индексы
        destinationTables = destinationSchema.Tables.ToDictionary(t => t.Name);
        foreach (Table table in sourceTables)
        {
            if (destinationTables.TryGetValue(table.Name, out Table? value))
            {
                DropIndexes(value);
            }
            CreateIndexes(table, false);
        }
    }

    private void DropSequence(SequenceObject _)
    {
        // do not drop sequence because exists serial fields

        //ScriptGenerator scriptGenerator = new ScriptGenerator(Buffer);
        //scriptGenerator.Drop(sequence);
        //Buffer.AppendLine();
    }

    private void CreateSequence(SequenceObject sequence)
    {
        ScriptGenerator scriptGenerator = new(Buffer);
        scriptGenerator.Create(sequence);
        Buffer.AppendLine();
    }

    private void UpdateSequence(SequenceObject source, SequenceObject destination)
    {
        // do not drop sequence because exists serial fields
        if (source.Equals(destination))
        {
            return;
        }
        ScriptGenerator scriptGenerator = new(Buffer);
        scriptGenerator.Alter(source);
        Buffer.AppendLine();
    }

    private void CreateIndexes(Table table, bool noDrop = false)
    {
        List<TableIndex> indexes = table.Indexes.OfType<TableIndex>().OrderBy(t => t.Name).ToList();

        if (indexes.Count == 0)
        {
            return;
        }

        foreach (TableIndex index in indexes)
        {
            // create new index
            ScriptGenerator scriptGenerator = new(Buffer);
            scriptGenerator.Create(index, noDrop);
        }
    }

    private void DropIndexes(Table table)
    {
        List<TableIndex> indexes = table.Indexes.OfType<TableIndex>().OrderBy(t => t.Name).ToList();

        if (indexes.Count == 0)
        {
            return;
        }

        foreach (TableIndex index in indexes)
        {
            // create new index
            ScriptGenerator scriptGenerator = new(Buffer);
            scriptGenerator.Drop(index);
        }
    }

    private void UpdateTable(Table sourceTable, Table destinationTable)
    {
        if (sourceTable.Equals(destinationTable))
        {
            return;
        }

        string tempSuffix = "_temp_" + Guid.NewGuid().ToString("N").Substring(0, 8);

        Table temp = destinationTable.Schema.CreateTableCopy(sourceTable, tempSuffix);
        ScriptGenerator scriptGenerator = new(Buffer);

        // * 1.CreateTemporaryTable()
        scriptGenerator.PrintOut(temp);
        // * 2.CopyDataFromDestinationToTemporary();
        CopyData(destinationTable, temp);
        // * 3. DropDestinationTable()
        DropTable(destinationTable);
        // * 4. RenameTemporaryTable();
        Buffer.AppendLine($"alter table \"{temp.Schema.GetSafeName()}\".\"{temp.GetSafeName()}\" rename to \"{destinationTable.GetSafeName()}\";");
        Buffer.AppendLine();
        // * 5. RenameTableConstraints();
        foreach (TableIndexBase index in temp.Indexes)
        {
            if (index is UniqueConstraint)
            {
                Buffer.AppendLine($"alter table {temp.Schema.GetSafeName()}.{destinationTable.GetSafeName()} rename constraint \"{index.GetSafeName()}\" to \"{index.GetSafeName().Substring(0, index.GetSafeName().Length - tempSuffix.Length)}\";");
                Buffer.AppendLine();
            }
        }
        TableColumn? identityColumn = temp.Columns.SingleOrDefault(t => t.IsIdentity);
        if (identityColumn != null)
        {
            //* 6.RenameSequence()
            string oldName = temp.Name + "_" + identityColumn.Name + "_seq";
            string newName = destinationTable.Name + "_" + identityColumn.Name + "_seq";
            Buffer.AppendLine($"drop sequence if exists {temp.Schema.Name}.{newName};");
            Buffer.AppendLine($"alter sequence {temp.Schema.Name}.{oldName} rename to {newName};");
            Buffer.AppendLine();
            //* 7.AlterSequence();
            Buffer.AppendLine($"select setval('{temp.Schema.Name}.{newName}', (select max(id) from {temp.Schema.Name}.{destinationTable.Name}));");
            Buffer.AppendLine();
        }
    }

    private void CopyData(Table source, Table destination)
    {
        HashSet<string> destinationColumns = new(destination.Columns.Select(t => t.Name));
        HashSet<string> sourceColumns = new(source.Columns.Select(t => t.Name));

        List<TableColumn> newColumns = destination.Columns.Where(t => !sourceColumns.Contains(t.Name)).ToList();

        Buffer.AppendLine($"insert into {destination.Schema.Name}.{destination.Name}");

        string columns = string.Join(", ", source.Columns.Where(t => destinationColumns.Contains(t.Name)).Select(t => t.Name));

        List<string> valueList = new();

        foreach (TableColumn column in source.Columns.Where(t => destinationColumns.Contains(t.Name)))
        {
            if (destination.Columns[column.Name].DataType != column.DataType)
            {
                valueList.Add($"cast({column.Name} as {SyntaxProvider.PgSql.GetColumnDataType(destination.Columns[column.Name])})");
            }
            else
            {
                valueList.Add(column.Name);
            }
        }

        string values = string.Join(", ", valueList);

        foreach (TableColumn newColumn in newColumns)
        {
            if (!newColumn.Nullable)
            {
                if (newColumn.Name == "modified_by")
                {
                    columns += ", " + newColumn.Name;
                    values += ", 2";
                }
                else if (newColumn.DataType == DataType.Int || newColumn.DataType == DataType.BigInt || newColumn.DataType == DataType.Decimal ||
                    newColumn.DataType == DataType.DoublePrecision || newColumn.DataType == DataType.Float || newColumn.DataType == DataType.Real ||
                    newColumn.DataType == DataType.SmallInt)
                {
                    columns += ", " + newColumn.Name;
                    values += ", 0";
                }
                else if (newColumn.DataType == DataType.Bool)
                {
                    columns += ", " + newColumn.Name;
                    values += ", false";
                }
                else if (newColumn.DataType == DataType.VarChar)
                {
                    columns += ", " + newColumn.Name;
                    values += ", ''";
                }
                else if (newColumn.DataType == DataType.DateTime)
                {
                    columns += ", " + newColumn.Name;
                    values += ", current_timestamp";
                }
                else if (newColumn.DataType == DataType.Date)
                {
                    columns += ", " + newColumn.Name;
                    values += ", current_date";
                }
                else
                {
                    throw new InvalidOperationException("unsupported data type");
                }
            }
        }

        using (Buffer.Indent())
        {
            Buffer.AppendLine($"({columns})");
        }
        Buffer.AppendLine("select");
        using (Buffer.Indent())
        {
            Buffer.AppendLine($"{values}");
        }
        Buffer.AppendLine($"from {source.Schema.Name}.{source.Name};");
        Buffer.AppendLine();
    }

    private void CreateTable(Table table)
    {
        ScriptGenerator scriptGenerator = new(Buffer);
        scriptGenerator.PrintOut(table);
    }

    private void DropTable(Table table)
    {
        Buffer.AppendLine($"drop table {table.Schema.GetSafeName()}.{table.GetSafeName()} cascade;");
        Buffer.AppendLine();
    }

    private void CreateSchema(SchemaObject schema)
    {
        // не создаем схему dbo
        //if (string.Compare(schema.Name, "dbo", StringComparison.InvariantCultureIgnoreCase) != 0)
        {
            Buffer.AppendLine($"create schema {schema.GetSafeName()};");
            Buffer.AppendLine();
        }

        List<SequenceObject> sourceSequences = schema.Sequences.ToList();

        foreach (SequenceObject sequence in sourceSequences)
        {
            CreateSequence(sequence);
        }

        List<Table> sourceTables = schema.Tables.ToList();

        foreach (Table table in sourceTables)
        {
            CreateTable(table);
            CreateIndexes(table, true);
        }
    }

    private void GenerateCreateCheckConstraints()
    {
        foreach (CheckConstraint item in Source.Checks)
        {
            GenerateCreateTableConstraint(item);
        }
    }

    private void GenerateCreateTableConstraint(CheckConstraint constraint)
    {
        Buffer.AppendLine($"alter table {constraint.Table.Schema.GetSafeName()}.{constraint.Table.GetSafeName()}");
        using (Buffer.Indent())
        {
            Buffer.Append($"add constraint {constraint.GetSafeName()} check {constraint.Clause};");
        }
        Buffer.AppendLine();
        Buffer.AppendLine();
    }

    private void GenerateDropCheckConstraints()
    {
        foreach (CheckConstraint item in Destination.Checks)
        {
            GenerateDropTableConstraint(item);
        }
    }

    private void GenerateDropForeignKeys()
    {
        IEnumerable<ForeignKeyConstraint> foreignKeys = Destination.GetForeignKeys();
        foreach (ForeignKeyConstraint foreignKey in foreignKeys)
        {
            GenerateDropTableConstraint(foreignKey);
        }
    }

    private void GenerateDropTableConstraint(TableConstraint constraint)
    {
        Buffer.AppendLine($"alter table \"{constraint.Table.Schema.GetSafeName()}\".\"{constraint.Table.GetSafeName()}\"");
        using (Buffer.Indent())
        {
            Buffer.Append($"drop constraint if exists \"{constraint.GetSafeName()}\";");
        }
        Buffer.AppendLine();
        Buffer.AppendLine();
    }

    private void GenerateCreateForeignKeys()
    {
        IEnumerable<ForeignKeyConstraint> foreignKeys = Source.GetForeignKeys();
        foreach (ForeignKeyConstraint foreignKey in foreignKeys)
        {
            GenerateCreateTableConstraint(foreignKey);
        }
    }

    private void GenerateCreateTableConstraint(ForeignKeyConstraint constraint)
    {
        Buffer.AppendLine($"alter table {constraint.Table.Schema.GetSafeName()}.{constraint.Table.GetSafeName()}");
        using (Buffer.Indent())
        {
            Buffer.Append($"add constraint {constraint.GetSafeName()} foreign key (");
            Buffer.Append(string.Join(", ", constraint.Columns.Select(t => t.Name)));
            Buffer.AppendLine(")");
            using (Buffer.Indent())
            {
                Buffer.Append($"references {constraint.Reference.Schema.GetSafeName()}.{constraint.Reference.GetSafeName()} (");
                Buffer.Append(string.Join(", ", constraint.ReferenceColumns.Select(t => t.Column.Name)));
                Buffer.Append(")");

                if (constraint.OnUpdate != RuleSpecification.NoAction)
                {
                    switch (constraint.OnUpdate)
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
                if (constraint.OnDelete != RuleSpecification.NoAction)
                {
                    switch (constraint.OnDelete)
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
}


public static class DatabaseObjectExtensions
{
    private static string[] _invalidColumnNames = ["desc", "all", "user", "group", "order"];

    public static string GetSafeName(this IDatabaseNamedObject namedObject)
    {
        string name = namedObject.Name ?? throw new InvalidOperationException("invalid object name");
        if (name.Contains('\"'))
        {
            throw new InvalidOperationException("name contais invalid chars");
        }
        if(namedObject is TableIndex index)
        {
            name = index.Name + "_" + index.Table.Name;
            if(name.Length > 64)
            {
                name = name.Substring(0, 64);
            }
        }
        if (name.IndexOfAny(['(', ')', '.']) >= 0)
        {
            return $"\"{name}\"";
        }
        if (_invalidColumnNames.Contains(name, StringComparer.InvariantCulture))
        {
            return $"\"{name}\"";
        }
        return name.ToLowerInvariant();
    }
}
