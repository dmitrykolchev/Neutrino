using System;
using System.Data.Common;
using System.Linq;
using SchemaCompare.Data.Schema;

namespace SchemaCompare.Data;

public abstract class SchemaGenerator
{
    protected SchemaGenerator()
    {
    }

    protected Database Database { get; private set; }

    public virtual Database GenerageSchema()
    {
        Database = new Database();
        ReadSequences();
        ReadTables();
        ReadTableColumns();
        ReadIndexes();
        ReadForeignKeys();
        ReadCheckConstraints();
        return Database;
    }

    protected abstract DbConnection CreateConnection();

    internal RuleSpecification GetRuleSpecification(string ruleName)
    {
        switch (ruleName)
        {
            case "NO ACTION":
                return RuleSpecification.NoAction;
            case "RESTRICT":
                return RuleSpecification.Rescrict;
            case "CASCADE":
                return RuleSpecification.Cascade;
            case "SET NULL":
                return RuleSpecification.SetNull;
            case "SET DEFAULT":
                return RuleSpecification.SetDefault;
            default:
                throw new InvalidOperationException("unknown rule name");
        }
    }

    private static readonly string s_getSequencesSql = @"select SEQUENCE_SCHEMA, SEQUENCE_NAME, DATA_TYPE, START_VALUE, INCREMENT
from INFORMATION_SCHEMA.SEQUENCES
order by SEQUENCE_SCHEMA, SEQUENCE_NAME;";

    protected void ReadSequences()
    {
        using (DbConnection connection = CreateConnection())
        {
            connection.Open();
            using (DbCommand command = connection.CreateCommand())
            {
                command.CommandText = s_getSequencesSql;
                using (DbDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string schemaName = reader.GetString(0);
                        string sequenceName = reader.GetString(1);
                        string dataType = reader.GetString(2);

                        SchemaObject schema = Database.Schemas.GetOrAdd(schemaName);
                        var sequence = Database.Sequences.Add(sequenceName, schema);
                        sequence.DataType = GetDataType(dataType, 0);
                    }
                }
            }
        }
    }

    private static readonly string s_getTablesSql = @"select TABLE_SCHEMA, TABLE_NAME 
from INFORMATION_SCHEMA.TABLES 
where
	TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA not in ('pg_catalog', 'information_schema') AND TABLE_NAME <> '__RefactorLog'
order by TABLE_SCHEMA, TABLE_NAME";

    protected void ReadTables()
    {
        using (DbConnection connection = CreateConnection())
        {
            connection.Open();
            using (DbCommand command = connection.CreateCommand())
            {
                command.CommandText = s_getTablesSql;
                using (DbDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string schemaName = reader.GetString(0);
                        string tableName = reader.GetString(1);

                        SchemaObject schema = Database.Schemas.GetOrAdd(schemaName);
                        Database.Tables.Add(tableName, schema);
                    }
                }
            }
        }
    }
    protected abstract void ReadTableColumns();
    protected abstract DataType GetDataType(string dataTypeName, int maxLength);

    protected abstract void ReadIndexes();


    private static readonly string s_getForeignKeyColumnsSql = @"with I as (
select 
	 TABLE_CONSTRAINTS.CONSTRAINT_SCHEMA,
	 TABLE_CONSTRAINTS.CONSTRAINT_NAME,
	 TABLE_CONSTRAINTS.TABLE_SCHEMA,
	 TABLE_CONSTRAINTS.TABLE_NAME,
	 TABLE_CONSTRAINTS.CONSTRAINT_TYPE
from 
	INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
WHERE 
	TABLE_CONSTRAINTS.CONSTRAINT_TYPE = 'FOREIGN KEY'
	AND
	TABLE_CONSTRAINTS.TABLE_NAME <> '__RefactorLog'
)
select
	I.CONSTRAINT_SCHEMA,
	I.CONSTRAINT_NAME,
	I.TABLE_SCHEMA,
	I.TABLE_NAME,
	C.COLUMN_NAME,
	R.UNIQUE_CONSTRAINT_SCHEMA,
	R.UNIQUE_CONSTRAINT_NAME,
	R.MATCH_OPTION,
	R.UPDATE_RULE,
	R.DELETE_RULE
from 
	INFORMATION_SCHEMA.KEY_COLUMN_USAGE as C  INNER JOIN I
		ON (C.CONSTRAINT_SCHEMA = I.CONSTRAINT_SCHEMA AND C.CONSTRAINT_NAME = I.CONSTRAINT_NAME)
	INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS as R
		ON (C.CONSTRAINT_SCHEMA = R.CONSTRAINT_SCHEMA AND C.CONSTRAINT_NAME = R.CONSTRAINT_NAME)
ORDER BY
	I.CONSTRAINT_SCHEMA,
	I.CONSTRAINT_NAME,
	I.TABLE_SCHEMA,
	I.TABLE_NAME,
	C.ORDINAL_POSITION;";
    protected void ReadForeignKeys()
    {
        var uniqueConstraints = Database.GetUniqueConstraints().ToDictionary(t => new { Schema = t.Schema.Name, Name = t.Name });

        using (DbConnection connection = CreateConnection())
        {
            connection.Open();
            using (DbCommand command = connection.CreateCommand())
            {
                command.CommandText = s_getForeignKeyColumnsSql;
                Schema.ForeignKeyConstraint foreignKey = new()
                {
                    Schema = new SchemaObject()
                };
                using (DbDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string schemaName = reader.GetString(0);
                        string constraintName = reader.GetString(1);
                        string tableSchema = reader.GetString(2);
                        string tableName = reader.GetString(3);

                        if (foreignKey.Schema.Name != schemaName || foreignKey.Name != constraintName)
                        {
                            string uniqueConstraintSchema = reader.GetString(5);
                            string uniqueConstraintName = reader.GetString(6);
                            foreignKey = new Schema.ForeignKeyConstraint
                            {
                                Schema = Database.Schemas[schemaName],
                                Name = constraintName,
                                Table = Database.FindTable(tableSchema, tableName),
                                Unique = uniqueConstraints[new
                                {
                                    Schema = uniqueConstraintSchema,
                                    Name = uniqueConstraintName
                                }],
                                OnUpdate = GetRuleSpecification(reader.GetString(8)),
                                OnDelete = GetRuleSpecification(reader.GetString(9))
                            };
                            foreignKey.Table.ForeignKeys.Add(foreignKey);
                        }
                        string columnName = reader.GetString(4);
                        foreignKey.Columns.Add(foreignKey.Table.Columns[columnName]);
                    }
                }
            }
        }
    }

    private static readonly string s_getCheckConstraintsSql = @"select
	TC.CONSTRAINT_SCHEMA,
	TC.CONSTRAINT_NAME,
	TC.TABLE_SCHEMA,
	TC.TABLE_NAME,
	CC.CHECK_CLAUSE
from 
	INFORMATION_SCHEMA.CHECK_CONSTRAINTS as CC inner join INFORMATION_SCHEMA.TABLE_CONSTRAINTS as TC
		ON (CC.CONSTRAINT_SCHEMA = TC.CONSTRAINT_SCHEMA and CC.CONSTRAINT_NAME = TC.CONSTRAINT_NAME)
where
	TC.CONSTRAINT_TYPE = 'CHECK' AND NOT (TC.CONSTRAINT_NAME LIKE '%_not_null' AND CC.CHECK_CLAUSE LIKE '%IS NOT NULL')
order by
    TC.TABLE_SCHEMA,
    TC.TABLE_NAME,
    TC.CONSTRAINT_NAME";
    protected void ReadCheckConstraints()
    {
        using (DbConnection connection = CreateConnection())
        {
            connection.Open();
            using (DbCommand command = connection.CreateCommand())
            {
                command.CommandText = s_getCheckConstraintsSql;
                Schema.ForeignKeyConstraint foreignKey = new()
                {
                    Schema = new SchemaObject()
                };
                using (DbDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string schemaName = reader.GetString(0);
                        string constraintName = reader.GetString(1);
                        string tableSchema = reader.GetString(2);
                        string tableName = reader.GetString(3);
                        string clause = reader.GetString(4);
                        CheckConstraint checkConstraint = new()
                        {
                            Table = Database.FindTable(tableSchema, tableName),
                            Schema = Database.Schemas[schemaName],
                            Name = constraintName,
                            Clause = NormalizeExpression(clause)
                        };
                        Database.Checks.Add(checkConstraint);
                    }
                }
            }
        }
    }

    protected virtual string NormalizeExpression(string expression)
    {
        return expression;
    }
}
