// <copyright file="PgSqlSchemaGenerator.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Data.Common;
using Npgsql;
using SchemaCompare.Data.Schema;

namespace SchemaCompare.Data;

public class PgSqlSchemaGenerator : SchemaGenerator
{
    public PgSqlSchemaGenerator(string connectionString)
    {
        ConnectionString = connectionString;
    }

    private string ConnectionString { get; }

    protected override DbConnection CreateConnection()
    {
        return new NpgsqlConnection(ConnectionString);
    }

    private static readonly string s_getTableColumnsSql = @"
select 
	COLUMNS.TABLE_SCHEMA,               -- 0
	COLUMNS.TABLE_NAME,                 -- 1
	COLUMNS.COLUMN_NAME,                -- 2
	COLUMNS.ORDINAL_POSITION,           -- 3
	COLUMNS.IS_NULLABLE,                -- 4
	COLUMNS.DATA_TYPE,                  -- 5
	COLUMNS.CHARACTER_MAXIMUM_LENGTH,   -- 6
	COLUMNS.NUMERIC_PRECISION,          -- 7
	COLUMNS.NUMERIC_PRECISION_RADIX,    -- 8
	COLUMNS.NUMERIC_SCALE,              -- 9
    COLUMNS.COLUMN_DEFAULT              -- 10
from 
	INFORMATION_SCHEMA.COLUMNS INNER JOIN INFORMATION_SCHEMA.TABLES
		ON (COLUMNS.TABLE_SCHEMA = TABLES.TABLE_SCHEMA AND COLUMNS.TABLE_NAME = TABLES.TABLE_NAME)
WHERE
	TABLES.TABLE_TYPE = 'BASE TABLE' AND COLUMNS.TABLE_SCHEMA not in ('pg_catalog', 'information_schema') AND COLUMNS.TABLE_NAME <> '__RefactorLog'
order by
	COLUMNS.TABLE_SCHEMA, COLUMNS.TABLE_NAME, COLUMNS.ORDINAL_POSITION";

    protected override void ReadTableColumns()
    {
        using DbConnection connection = CreateConnection();
        connection.Open();
        using DbCommand command = connection.CreateCommand();
        command.CommandText = s_getTableColumnsSql;
        Table table = new()
        { Schema = new SchemaObject() };
        using DbDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
            string schemaName = reader.GetString(0);
            string tableName = reader.GetString(1);
            if (tableName != table.Name || schemaName != table.Schema.Name)
            {
                table = Database.FindTable(schemaName, tableName);
            }
            string columnName = reader.GetString(2);
            int ordinalPosition = reader.GetInt32(3);
            bool nullable = reader.GetString(4) == "YES";
            int maxLength = reader.IsDBNull(6) ? 0 : reader.GetInt32(6);
            DataType dataType = GetDataType(reader.GetString(5), maxLength);
            if (dataType != DataType.VarChar)
            {
                maxLength = 0;
            }
            int precision = 0;
            int scale = 0;
            if (dataType == DataType.Decimal)
            {
                precision = reader.IsDBNull(7) ? default : reader.GetByte(7);
                scale = reader.IsDBNull(9) ? default : reader.GetInt32(9);
            }
            string columnDefault = reader.IsDBNull(10) ? string.Empty : reader.GetString(10);
            bool isIdentity = false;
            if (columnDefault.StartsWith("nextval", StringComparison.InvariantCultureIgnoreCase))
            {
                string generatedDefault = $"nextval('{schemaName}.{tableName}_{columnName}_seq'::regclass)";
                if (string.Compare(columnDefault, generatedDefault, StringComparison.InvariantCultureIgnoreCase) == 0)
                {
                    isIdentity = true;
                }
            }
            table.Columns.Add(new TableColumn
            {
                Name = columnName,
                Ordinal = ordinalPosition,
                DataType = dataType,
                Nullable = nullable,
                MaxLength = maxLength,
                Precision = precision,
                Scale = scale,
                IsIdentity = isIdentity,
                DefaultConstraint = columnDefault
            });
        }
    }


    protected override void ReadIndexes()
    {
        using DbConnection connection = CreateConnection();
        connection.Open();
        ReadConstraints(connection);
        ReadIndexes(connection);
    }

    private static readonly string s_getConstraintColumnsSql = @"with I as (
select 
	 TABLE_CONSTRAINTS.CONSTRAINT_SCHEMA,
	 TABLE_CONSTRAINTS.CONSTRAINT_NAME,
	 TABLE_CONSTRAINTS.TABLE_SCHEMA,
	 TABLE_CONSTRAINTS.TABLE_NAME,
	 TABLE_CONSTRAINTS.CONSTRAINT_TYPE
from 
	INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
WHERE 
	TABLE_CONSTRAINTS.CONSTRAINT_TYPE IN ('PRIMARY KEY','UNIQUE')
	AND
	TABLE_CONSTRAINTS.TABLE_NAME not in ('__RefactorLog', 'sysdiagrams')
    AND
    TABLE_CONSTRAINTS.TABLE_SCHEMA not in ('pg_catalog')
)
select
	I.CONSTRAINT_SCHEMA,
	I.CONSTRAINT_NAME,
	I.TABLE_SCHEMA,
	I.TABLE_NAME,
	C.COLUMN_NAME,
	I.CONSTRAINT_TYPE
from 
	INFORMATION_SCHEMA.KEY_COLUMN_USAGE as C  INNER JOIN I
		ON (C.CONSTRAINT_SCHEMA = I.CONSTRAINT_SCHEMA AND C.CONSTRAINT_NAME = I.CONSTRAINT_NAME)
ORDER BY
	I.TABLE_SCHEMA,
	I.TABLE_NAME,
	I.CONSTRAINT_SCHEMA,
	I.CONSTRAINT_NAME,
	C.ORDINAL_POSITION";

    private void ReadConstraints(DbConnection connection)
    {
        using DbCommand command = connection.CreateCommand();
        command.CommandText = s_getConstraintColumnsSql;
        using DbDataReader reader = command.ExecuteReader();
        TableIndexBase constraint = new TableIndex { Schema = new SchemaObject() };
        while (reader.Read())
        {
            string schemaName = reader.GetString(0);
            string constraintName = reader.GetString(1);
            string tableSchema = reader.GetString(2);
            string tableName = reader.GetString(3);
            string columnName = reader.GetString(4);
            string constraintType = reader.GetString(5);

            if (constraint.Schema.Name != schemaName || constraint.Name != constraintName)
            {
                if (constraintType == "PRIMARY KEY")
                {
                    constraint = new PrimaryKeyConstraint
                    {
                        Schema = Database.Schemas[schemaName],
                        Table = Database.FindTable(tableSchema, tableName),
                        Name = constraintName
                    };
                }
                else if (constraintType == "UNIQUE")
                {
                    constraint = new UniqueConstraint
                    {
                        Schema = Database.Schemas[schemaName],
                        Table = Database.FindTable(tableSchema, tableName),
                        Name = constraintName
                    };
                }
                else
                {
                    throw new InvalidOperationException("unexpected constraint type");
                }
                constraint.Table.Indexes.Add(constraint);
            }
            constraint.Columns.Add(new TableIndexColumnSpecification
            {
                Column = constraint.Table.Columns[columnName]
            });
        }
    }

    private static readonly string s_getIndexColumnsSql = @"select
	n.nspname as schema_name,
	i.relname as index_name,
	t.relname as table_name,
	a.attname as column_name,
	ix.indisunique as is_unique,
	pg_get_expr(ix.indpred, ix.indrelid) as filter_definition,
	1 + array_position(ix.indkey, a.attnum) as key_ordinal
from
	pg_catalog.pg_class as t
	inner join pg_catalog.pg_attribute as a 
		on (t.oid = a.attrelid)
	inner join pg_catalog.pg_index as ix    
		on (t.oid = ix.indrelid)
	inner join pg_catalog.pg_class as i     
		on (a.attnum = any(ix.indkey) and i.oid = ix.indexrelid)
	inner join pg_catalog.pg_namespace as n 
		on (n.oid = t.relnamespace)
where 
	t.relkind = 'r' and ix.indisprimary = false and n.nspname not in ('pg_catalog')
	and ix.indexrelid not in (select conindid from pg_catalog.pg_constraint)
order by
	n.nspname,
	t.relname,
	i.relname,
	array_position(ix.indkey, a.attnum)";

    private void ReadIndexes(DbConnection connection)
    {
        using DbCommand command = connection.CreateCommand();
        command.CommandText = s_getIndexColumnsSql;
        using DbDataReader reader = command.ExecuteReader();
        TableIndex constraint = new() { Schema = new SchemaObject() };
        while (reader.Read())
        {
            string schemaName = reader.GetString(0);
            string constraintName = reader.GetString(1);
            string tableName = reader.GetString(2);
            string columnName = reader.GetString(3);
            bool isUnique = reader.GetBoolean(4);
            string filter = reader.IsDBNull(5) ? default : reader.GetString(5);

            if (constraint.Schema.Name != schemaName || constraint.Name != constraintName)
            {
                if (isUnique)
                {
                    constraint = new UniqueIndex
                    {
                        Schema = Database.Schemas[schemaName],
                        Table = Database.FindTable(schemaName, tableName),
                        Name = constraintName,
                        FilterDefinition = filter
                    };
                }
                else
                {
                    constraint = new TableIndex
                    {
                        Schema = Database.Schemas[schemaName],
                        Table = Database.FindTable(schemaName, tableName),
                        Name = constraintName,
                        FilterDefinition = filter
                    };
                }
                constraint.Table.Indexes.Add(constraint);
            }
            constraint.Columns.Add(new TableIndexColumnSpecification
            {
                Column = constraint.Table.Columns[columnName]
            });
        }
    }


    protected override DataType GetDataType(string dataType, int maxLength)
    {
        switch (dataType.ToLower())
        {
            case "bigint":
                return DataType.BigInt;
            case "boolean":
                return DataType.Bool;
            case "character varying":
                return DataType.VarChar;
            case "date":
                return DataType.Date;
            case "integer":
                return DataType.Int;
            case "numeric":
                return DataType.Decimal;
            case "smallint":
                return DataType.SmallInt;
            case "text":
                return DataType.Text;
            case "timestamp without time zone":
                return DataType.DateTime;
            case "time without time zone":
                return DataType.Time;
            case "uuid":
                return DataType.Uuid;
            case "double precision":
                return DataType.DoublePrecision;
            case "bytea":
                return DataType.ByteArray;
            default:
                throw new InvalidOperationException($"unsupported data type: {dataType}");
        }
    }
}
