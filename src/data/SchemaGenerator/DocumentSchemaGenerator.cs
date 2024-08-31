using System;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using Dapper;
using Sam.Data;

namespace Sam.Data
{
    [Flags]
    public enum PropertyFlags
    {
        None = 0,
        CanSet = 1,
        CanUpdate = 2,
        CanFind = 4,
        GeneratedOnAdd = 8,
        Historical = 16
    }

}

namespace SchemaGenerator
{
    public class DocumentSchemaGenerator
    {
        private readonly string _documentCode;
        private readonly string _connectionString = SchemaGenerator.Properties.Settings.Default.ConnectionString;
        private DocumentType _documentType;
        private TableDefinition _table;
        private TableDefinition _historyTable;
        private IEnumerable<DocumentState> _states;
        private Dictionary<string, PropertyInformation> _properties;
        private string _namespace;

        public DocumentSchemaGenerator(string documentCode, string namespaceName)
        {
            if (string.IsNullOrEmpty(documentCode))
            {
                throw new ArgumentNullException(nameof(documentCode));
            }
            _documentCode = documentCode;
            _namespace = namespaceName;
            Initialize();
        }
        private const string GetDocumentTypeSql = @"
select 
    id, code, name, schema_name, table_name, supports_history 
from 
    metadata.document_type 
where 
    code = @document_code";

        private const string GetTableColumnsSql = @"
select 
	c1.COLUMN_NAME, 
	c1.IS_NULLABLE, 
	c1.DATA_TYPE, 
	c1.CHARACTER_MAXIMUM_LENGTH, 
	c1.NUMERIC_PRECISION, 
	c1.NUMERIC_SCALE,
    c2.is_identity
from 
	INFORMATION_SCHEMA.COLUMNS as c1 inner join sys.columns as c2
		on (c1.COLUMN_NAME = c2.name)
where 
	c1.TABLE_SCHEMA = @SchemaName and c1.TABLE_NAME = @TableName and c2.object_id = object_id(@SchemaSpecifiedName)
order by 
	c1.ORDINAL_POSITION;";
        private const string GetDocumentStatesSql = @"select value, code, name from metadata.document_state where document_type_id = @id;";
        private const string GetPropertiesSql = @"select * from metadata.property_definition where state = 1 and document_type_id = @id;";

        private void Initialize()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                DefaultTypeMap.MatchNamesWithUnderscores = true;
                connection.Open();
                _documentType = connection.QuerySingle<DocumentType>(GetDocumentTypeSql,
                    new { document_code = _documentCode });
                TableDefinition table = new TableDefinition()
                {
                    TableName = _documentType.TableName,
                    SchemaName = _documentType.SchemaName,
                };
                table.Columns.AddRange(connection.Query<ColumnDefinition>(GetTableColumnsSql,
                    new
                    {
                        TableName = table.TableName,
                        SchemaName = table.SchemaName,
                        SchemaSpecifiedName = table.SchemaSpecifiedName
                    }));
                _table = table;
                if (_documentType.SupportsHistory)
                {
                    table = new TableDefinition()
                    {
                        TableName = _documentType.TableName + "_history",
                        SchemaName = _documentType.SchemaName,
                    };
                    table.Columns.AddRange(connection.Query<ColumnDefinition>(GetTableColumnsSql,
                        new
                        {
                            TableName = table.TableName,
                            SchemaName = table.SchemaName,
                            SchemaSpecifiedName = table.SchemaSpecifiedName
                        }));
                    _historyTable = table;
                }
                _states = connection.Query<DocumentState>(GetDocumentStatesSql, new { id = _documentType.Id });
                _properties = connection.Query<PropertyInformation>(GetPropertiesSql, new { id = _documentType.Id }).ToDictionary(item => item.Name);
            }
        }
        public void Execute(string fileName)
        {
            using (FileStream stream = File.Create(fileName))
            {
                Execute(stream);
            }
        }
        public string ClassName => _documentCode;
        public string SchemaClassName => _documentCode + "Schema";
        public string StateEnumName => _documentCode + "State";
        public void Execute(Stream stream)
        {
            CodeTypeDeclaration statesDeclaration = new CodeTypeDeclaration(StateEnumName) { Attributes = MemberAttributes.Public, IsEnum = true };
            statesDeclaration.BaseTypes.Add(new CodeTypeReference(typeof(short)));
            foreach (DocumentState state in _states)
            {
                CodeMemberField stateEnumField = new CodeMemberField { Name = state.Code, InitExpression = new CodePrimitiveExpression(state.Value) };
                stateEnumField.Comments.Add(new CodeCommentStatement(state.Name));
                statesDeclaration.Members.Add(stateEnumField);
            }

            CodeTypeDeclaration schemaDeclaration = new CodeTypeDeclaration(SchemaClassName)
            {
                Attributes = MemberAttributes.Public,
                IsPartial = true,
                IsClass = true
            };
            string[] ignoredColumns;
            if (_documentType.SupportsHistory)
            {
                schemaDeclaration.BaseTypes.Add("HistoryItemSchema");
                ignoredColumns = new string[] { "id", "name", "modified_by", "modified_date", "hid", "period_start", "period_end", _table.TableName + "_id" };
            }
            else
            {
                schemaDeclaration.BaseTypes.Add("ItemSchema");
                ignoredColumns = new string[] { "id", "name", "modified_by", "modified_date" };
            }
            List<CodeMemberField> names = new List<CodeMemberField>();
            List<CodeMemberField> fields = new List<CodeMemberField>();
            List<CodeMemberProperty> properties = new List<CodeMemberProperty>();
            List<CodeStatement> statements = new List<CodeStatement>();
            GenerateMembers(_table.Columns, ignoredColumns, statements, names, fields, properties);
            if (_historyTable != null)
            {
                GenerateMembers(_historyTable.Columns, ignoredColumns, statements, names, fields, properties);
            }
            names.ForEach(name => schemaDeclaration.Members.Add(name));
            fields.ForEach(field => schemaDeclaration.Members.Add(field));

            CodeConstructor constructor = new CodeConstructor
            {
                Attributes = MemberAttributes.Public,
            };
            statements.ForEach(s => constructor.Statements.Add(s));
            schemaDeclaration.Members.Add(constructor);

            properties.ForEach(property => schemaDeclaration.Members.Add(property));

            CodeCompileUnit compileUnit = new CodeCompileUnit();
            CodeNamespace ns = new CodeNamespace(_namespace);
            compileUnit.Namespaces.Add(ns);
            ns.Imports.Add(new CodeNamespaceImport("System"));
            ns.Imports.Add(new CodeNamespaceImport("Sam.Data"));
            ns.Imports.Add(new CodeNamespaceImport("Sam.Data.Schemas"));

            ns.Types.Add(statesDeclaration);
            ns.Types.Add(schemaDeclaration);
            GenerateCode(stream, compileUnit);
        }

        private void GenerateMembers(IEnumerable<ColumnDefinition> columns, string[] ignoredColumns, List<CodeStatement> statements, List<CodeMemberField> names, List<CodeMemberField> fields, List<CodeMemberProperty> properties)
        {
            foreach (ColumnDefinition column in columns)
            {
                if (!ignoredColumns.Any(t => string.Compare(t, column.ColumnName, StringComparison.InvariantCultureIgnoreCase) == 0))
                {
                    CodeMemberField name = new CodeMemberField
                    {
                        Attributes = MemberAttributes.Private | MemberAttributes.Static | MemberAttributes.Final,
                        Type = new CodeTypeReference(typeof(string)),
                        Name = column.ColumnName.ToPascalCase() + "Property",
                        InitExpression = new CodeSnippetExpression("\"" + column.ColumnName + "\"")
                    };
                    names.Add(name);
                    CodeMemberField field = new CodeMemberField
                    {
                        Attributes = MemberAttributes.Private,
                        Name = "_" + column.ColumnName.ToCamelCase(),
                        Type = new CodeTypeReference("PropertyDefinition")
                    };

                    CodeStatement statement = new CodeAssignStatement
                    {
                        Left = new CodeSnippetExpression(field.Name),
                        Right = GenerateInitExpression(column)
                    };

                    statements.Add(statement);

                    //if (column.IsStateColumn)
                    //{
                    //    field.Type = new CodeTypeReference(StateEnumName);
                    //}
                    //else
                    //{
                    //    field.Type = new CodeTypeReference(column.ClrDataType);
                    //}
                    fields.Add(field);

                    CodeMemberProperty property = new CodeMemberProperty
                    {
                        Name = column.ColumnName.ToPascalCase(),
                        Type = field.Type,
                        HasGet = true,
                        Attributes = MemberAttributes.Public | MemberAttributes.Final
                    };
                    property.GetStatements.Add(new CodeSnippetExpression($"return {field.Name}"));
                    properties.Add(property);
                }
            }
        }

        private CodeSnippetExpression GenerateInitExpression(ColumnDefinition column)
        {
            PropertyInformation propertyInformation = _properties[column.ColumnName];
            List<string> flags = new List<string>();
            if (propertyInformation.CanSet)
            {
                flags.Add(nameof(PropertyFlags) + "." + nameof(PropertyFlags.CanSet));
            }

            if (propertyInformation.CanUpdate)
            {
                flags.Add(nameof(PropertyFlags) + "." + nameof(PropertyFlags.CanUpdate));
            }

            if (propertyInformation.Historical)
            {
                flags.Add(nameof(PropertyFlags) + "." + nameof(PropertyFlags.Historical));
            }

            if (propertyInformation.MaximumLength.HasValue && propertyInformation.MaximumLength.Value == -1)
            {
                flags.Add(nameof(PropertyFlags) + "." + nameof(PropertyFlags.CanFind));
            }

            if (propertyInformation.Generated)
            {
                flags.Add(nameof(PropertyFlags) + "." + nameof(PropertyFlags.GeneratedOnAdd));
            }

            string flagsValue = string.Join(" | ", flags);
            string nullableValue = propertyInformation.Nullable ? "true" : "false";
            string dataType;
            if (column.ColumnName == "state" && column.ClrDataType == typeof(short))
            {
                dataType = StateEnumName;
            }
            else
            {
                dataType = column.ClrDataType.Name;
            }
            CodeSnippetExpression expression = new CodeSnippetExpression($"PropertyDefinition.Register<{dataType}>(this, {propertyInformation.Name.ToPascalCase()}Property, {flagsValue}, {nullableValue}, {nameof(BasePropertySet) + "." + propertyInformation.BaseSet})");
            return expression;
        }
        private void GenerateCode(Stream stream, CodeCompileUnit compileUnit)
        {
            CodeDomProvider provider = CodeDomProvider.CreateProvider("C#");
            StringBuilder builder = new StringBuilder();
            using (StringWriter writer = new StringWriter(builder))
            {
                provider.GenerateCodeFromCompileUnit(compileUnit, writer, new CodeGeneratorOptions { BlankLinesBetweenMembers = false, IndentString = "    ", VerbatimOrder = true, BracingStyle = "C" });
            }
            using (StreamWriter writer = new StreamWriter(stream))
            {
                writer.Write(builder.ToString());
            }
        }
    }
}
