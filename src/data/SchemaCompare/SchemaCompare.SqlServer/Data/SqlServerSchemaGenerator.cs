using System;
using System.Data.Common;
using Microsoft.Data.SqlClient;
using SchemaCompare.Data.Schema;

namespace SchemaCompare.Data;

public class SqlServerSchemaGenerator : SchemaGenerator
{
    public SqlServerSchemaGenerator(string connectionString)
    {
        ConnectionString = connectionString;
    }

    private string ConnectionString { get; }

    protected override DbConnection CreateConnection()
    {
        return new SqlConnection(ConnectionString);
    }

    private static readonly string s_getTableColumnsSql = @"WITH I as 
(
select	
	s.name as TABLE_SCHEMA,
	o.name as TABLE_NAME,
	c.name as COLUMN_NAME,
	c.is_identity as IS_IDENTITY
from 
	sys.objects as o inner join sys.columns as c
		on (o.object_id = c.object_id)
	inner join sys.schemas as s
		on (o.schema_id = s.schema_id)
where
	o.type = 'U'
)
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
	I.IS_IDENTITY,						-- 10
    COLUMNS.COLUMN_DEFAULT,             -- 11
    COLUMNS.CHARACTER_SET_NAME          -- 12
from 
	INFORMATION_SCHEMA.COLUMNS INNER JOIN INFORMATION_SCHEMA.TABLES
		ON (COLUMNS.TABLE_SCHEMA = TABLES.TABLE_SCHEMA AND COLUMNS.TABLE_NAME = TABLES.TABLE_NAME)
    INNER JOIN I 
        ON (COLUMNS.TABLE_SCHEMA = I.TABLE_SCHEMA AND COLUMNS.TABLE_NAME = I.TABLE_NAME AND COLUMNS.COLUMN_NAME = I.COLUMN_NAME)
WHERE
	TABLES.TABLE_TYPE = 'BASE TABLE' AND COLUMNS.TABLE_SCHEMA not in ('pg_catalog', 'information_schema') AND 
    COLUMNS.TABLE_NAME not in ('__RefactorLog', 'sysdiagrams')
order by
	COLUMNS.TABLE_SCHEMA, COLUMNS.TABLE_NAME, COLUMNS.ORDINAL_POSITION";
    protected override void ReadTableColumns()
    {
        using (DbConnection connection = CreateConnection())
        {
            connection.Open();
            using (DbCommand command = connection.CreateCommand())
            {
                command.CommandText = s_getTableColumnsSql;
                Table table = new()
                { Schema = new SchemaObject() };
                using (DbDataReader reader = command.ExecuteReader())
                {
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
                        string columnDefault = reader.IsDBNull(11) ? string.Empty : reader.GetString(11);
                        if (!string.IsNullOrEmpty(columnDefault))
                        {
                            columnDefault = TranslateDefault(columnDefault);
                        }
                        bool isUnicode = (reader.IsDBNull(12) ? string.Empty : reader.GetString(12)) == "UNICODE";
                        table.Columns.Add(new TableColumn
                        {
                            Name = columnName,
                            Ordinal = ordinalPosition,
                            DataType = dataType,
                            Nullable = nullable,
                            MaxLength = maxLength,
                            Precision = precision,
                            Scale = scale,
                            IsIdentity = reader.GetBoolean(10),
                            IsUnicode = isUnicode,
                            DefaultConstraint = columnDefault
                        });
                    }
                }
            }
        }
    }

    protected override void ReadIndexes()
    {
        using (DbConnection connection = CreateConnection())
        {
            connection.Open();
            ReadConstraints(connection);
            ReadIndexes(connection);
        }
    }

    private static readonly string s_getIndexColumnsSql = @"select 
	SCHEMA_NAME(o.schema_id) as TABLE_SCHEMA, 
	i.name as INDEX_NAME,
	o.name as TABLE_NAME,
	c.name as COLUMN_NAME,
	i.is_unique,
	i.filter_definition,
	ic.is_descending_key,
	ic.key_ordinal
from 
	sys.indexes as i inner join sys.objects as o
		on (i.object_id = o.object_id and o.type = 'U')
	inner join sys.index_columns as ic 
		on (i.object_id = ic.object_id and i.index_id = ic.index_id)
	inner join sys.columns as c 
		on (ic.object_id = c.object_id and ic.column_id = c.column_id)
where
	i.is_primary_key = 0 and i.index_id <> 0 and ic.is_included_column = 0 
	and i.is_unique_constraint = 0
order by
	SCHEMA_NAME(o.schema_id), o.name, i.index_id, ic.key_ordinal;";

    private void ReadIndexes(DbConnection connection)
    {
        using (DbCommand command = connection.CreateCommand())
        {
            command.CommandText = s_getIndexColumnsSql;
            using (DbDataReader reader = command.ExecuteReader())
            {
                TableIndex index = new() { Schema = new SchemaObject() };
                while (reader.Read())
                {
                    string schemaName = reader.GetString(0);
                    string constraintName = reader.GetString(1);
                    string tableName = reader.GetString(2);
                    string columnName = reader.GetString(3);
                    bool isUnique = reader.GetBoolean(4);
                    string filter = reader.IsDBNull(5) ? default : reader.GetString(5);

                    if (index.Schema.Name != schemaName || index.Name != constraintName)
                    {
                        if (isUnique)
                        {
                            index = new UniqueIndex
                            {
                                Schema = Database.Schemas[schemaName],
                                Table = Database.FindTable(schemaName, tableName),
                                Name = constraintName,
                                FilterDefinition = filter
                            };
                        }
                        else
                        {
                            index = new TableIndex
                            {
                                Schema = Database.Schemas[schemaName],
                                Table = Database.FindTable(schemaName, tableName),
                                Name = constraintName,
                                FilterDefinition = filter
                            };
                        }
                        index.Table.Indexes.Add(index);
                    }
                    index.Columns.Add(new TableIndexColumnSpecification
                    {
                        Column = index.Table.Columns[columnName]
                    });
                }
            }
        }
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
        using (DbCommand command = connection.CreateCommand())
        {
            command.CommandText = s_getConstraintColumnsSql;
            using (DbDataReader reader = command.ExecuteReader())
            {
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
        }
    }



    //TODO: need parser
    private string TranslateDefault(string expression)
    {
        // (NEXT VALUE FOR [biz].[business_entity_seq])
        const string nextValueFor = "(NEXT VALUE FOR ";
        if (expression.Contains(nextValueFor))
        {
            expression = expression.ToLower().Substring(nextValueFor.Length);
            expression = expression.Substring(0, expression.Length - 1).Replace("[", "").Replace("]", "");
            return $"nextval('{expression}'::regclass)";
        }
        return null;
        //return expression;
    }
    protected override DataType GetDataType(string dataType, int maxLength)
    {
        switch (dataType.ToLower())
        {
            case "bigint":
                return DataType.BigInt;
            case "bit":
                return DataType.Bool;
            case "char":
                return DataType.VarChar;
            case "date":
                return DataType.Date;
            case "datetime":
            case "datetime2":
                return DataType.DateTime;
            case "decimal":
                return DataType.Decimal;
            case "int":
                return DataType.Int;
            case "smallint":
                return DataType.SmallInt;
            case "uniqueidentifier":
                return DataType.Uuid;
            case "nvarchar":
            case "varchar":
                if (maxLength == -1)
                {
                    return DataType.Text;
                }
                return DataType.VarChar;
            case "time":
                return DataType.Time;
            case "float":
                return DataType.DoublePrecision;
            case "varbinary":
                return DataType.ByteArray;
            case "timestamp":
                return DataType.ByteArray;
            case "tinyint":
                return DataType.SmallInt;
            case "xml":
                return DataType.Text;
            case "text":
            case "ntext":
                return DataType.Text;
            default:
                throw new InvalidOperationException($"unsupported data type: {dataType}");
        }
    }
    protected override string NormalizeExpression(string expression)
    {
        if (!string.IsNullOrEmpty(expression))
        {
            return expression.Replace("[", string.Empty).Replace("]", string.Empty);
        }
        return expression;
    }
}
