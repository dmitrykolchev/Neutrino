// <copyright file="SchemaObject.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace SchemaCompare.Data.Schema;

public class SchemaObject: IDatabaseNamedObject
{
    public string Name { get; set; } = null!;

    public Database Database { get; internal set; } = null!;

    public IEnumerable<Table> Tables => Database.Tables.Where(t => t.Schema == this);

    public IEnumerable<SequenceObject> Sequences => Database.Sequences.Where(t => t.Schema == this);

    public Table CreateTableCopy(Table sourceTable, string nameSuffix)
    {
        string tempSuffix = nameSuffix; // "_temp_" + Guid.NewGuid().ToString("N");
        Table temp = new Table
        {
            Schema = this,
            Name = sourceTable.Name + tempSuffix
        };
        foreach (TableColumn item in sourceTable.Columns)
        {
            TableColumn column = new TableColumn
            {
                DataType = item.DataType,
                DefaultConstraint = item.DefaultConstraint,
                IsIdentity = item.IsIdentity,
                IsUnicode = item.IsUnicode,
                MaxLength = item.MaxLength,
                Name = item.Name,
                Nullable = item.Nullable,
                Ordinal = item.Ordinal,
                Precision = item.Precision,
                Scale = item.Scale
            };
            temp.Columns.Add(column);
        }
        if (sourceTable.PrimaryKey != null)
        {
            PrimaryKeyConstraint constraint = new PrimaryKeyConstraint
            {
                Table = temp,
                Name = sourceTable.PrimaryKey.Name + tempSuffix,
                Schema = this
            };
            foreach (TableIndexColumnSpecification item in sourceTable.PrimaryKey.Columns)
            {
                constraint.Columns.Add(new TableIndexColumnSpecification
                {
                    Column = temp.Columns[item.Column.Name]
                });
            }
            temp.Indexes.Add(constraint);
        }
        foreach (UniqueConstraint unique in sourceTable.Indexes.OfType<UniqueConstraint>())
        {
            if (unique != sourceTable.PrimaryKey)
            {
                UniqueConstraint constraint = new UniqueConstraint
                {
                    Table = temp,
                    Name = unique.Name + tempSuffix,
                    Schema = this
                };
                foreach (TableIndexColumnSpecification item in unique.Columns)
                {
                    constraint.Columns.Add(new TableIndexColumnSpecification
                    {
                        Column = temp.Columns[item.Column.Name]
                    });
                }
                temp.Indexes.Add(constraint);
            }
        }
        return temp;
    }

    public override string ToString()
    {
        return Name;
    }
}
