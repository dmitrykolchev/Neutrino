using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.CodeDom;
using System.CodeDom.Compiler;
using Microsoft.CSharp;
using System.IO;
using System.Data;
using System.Data.SqlClient;

namespace Generator
{
    public class DataAdapterGenerator
    {
        private string _className;
        private TableDefinition _table;
        private DocumentType _documentType;

        public DataAdapterGenerator(string className)
        {
            this._className = className;
        }

        public TableDefinition Table
        {
            get { return this._table; }
        }

        public DocumentType DocumentType
        {
            get { return this._documentType; }
        }

        public void Generate()
        {
            using (SchemaModelContext db = new SchemaModelContext())
            {
                this._documentType = db.DocumentTypes.Where(t => t.ClassName == this._className).SingleOrDefault();
                if (this._documentType == null)
                {
                    throw new InvalidOperationException(string.Format("Документ {0} не найден", Table.TableName));
                }
                var entry = db.Entry(this._documentType);
                entry.Collection(t => t.States).Load();

                this._table = db.Tables.Where(t => t.TableName == this.DocumentType.TableName && t.SchemaName == this.DocumentType.SchemaName).SingleOrDefault();
                db.Entry(this._table).Collection(t => t.Columns).Load();
            }
            GenerateEntity();
            GenerateViewEntity();
            GenerateFilterEntity();
            if (string.Compare(this._documentType.DataAdapterType, "SqlReader", StringComparison.InvariantCultureIgnoreCase) == 0)
            {
                SqlReaderDataAdaperGenerator generator = new SqlReaderDataAdaperGenerator(this._className, Table, DocumentType);
                generator.Generate();
            }
            else if (string.Compare(this._documentType.DataAdapterType, "XmlReader", StringComparison.InvariantCultureIgnoreCase) == 0)
            {
                XmlReaderDataAdaperGenerator generator = new XmlReaderDataAdaperGenerator(this._className, Table, DocumentType);
                generator.Generate();
            }

            DataAdapterProxyGenerator proxyGenerator = new DataAdapterProxyGenerator(this._className, Table, DocumentType);
            proxyGenerator.Generate();
        }

        public static IList<SqlColumnInfo> GetProcedureColumns(string procedureName)
        {
            using (SqlConnection connection = new SqlConnection(App.GetConnectionString()))
            {
                connection.Open();
                return SqlCommandResults.GetViewColumns(procedureName, connection);
            }
        }

        public void GenerateFilterEntity()
        {
            string stateEnumName = Table.TableName + "State";
            string className = Table.TableName + "Filter";
            CodeTypeDeclaration typeDeclaration = new CodeTypeDeclaration(className) { Attributes = MemberAttributes.Public };
            typeDeclaration.BaseTypes.Add(new CodeTypeReference("Filter"));
            typeDeclaration.IsClass = true;
            typeDeclaration.IsPartial = true;

            CodeConstructor method = new CodeConstructor { Name = className, Attributes = MemberAttributes.Public };

            var states = DocumentType.States
                .Where(t => t.State != 0)
                .Select(t => "(byte)" + stateEnumName + "." + t.Name)
                .ToArray();
            string initializeStates = "this.States = new byte[] { " + string.Join(", ", states) + "}";
            method.Statements.Add(new CodeSnippetExpression(initializeStates));

            typeDeclaration.Members.Add(method);

            CodeCompileUnit compileUnit = new CodeCompileUnit();
            CodeNamespace ns = new CodeNamespace("DykBits.Crm.Data");
            compileUnit.Namespaces.Add(ns);
            ns.Imports.Add(new CodeNamespaceImport("System"));
            ns.Imports.Add(new CodeNamespaceImport("System.Xml.Serialization"));
            ns.Types.Add(typeDeclaration);
            GenerateCode(Table.TableName + ".Filter.cs", compileUnit);
        }

        public void GenerateViewEntity()
        {
            string stateEnumName = Table.TableName + "State";

            IList<SqlColumnInfo> columns = GetProcedureColumns(string.Format("[dbo].[{0}Browse]", Table.TableName));

            string className = Table.TableName + "View";

            CodeTypeDeclaration typeDeclaration = new CodeTypeDeclaration(className) { Attributes = MemberAttributes.Public };
            if (this.DocumentType.IsNumbered)
                typeDeclaration.BaseTypes.Add(new CodeTypeReference("NumberedDataItemView"));
            else
                typeDeclaration.BaseTypes.Add(new CodeTypeReference("DataItemView"));
            typeDeclaration.IsClass = true;
            typeDeclaration.IsPartial = true;

            typeDeclaration.Members.Add(new CodeMemberField
            {
                Attributes = MemberAttributes.Const | MemberAttributes.Public,
                Name = "DataItemClassName",
                Type = new CodeTypeReference(typeof(string)),
                InitExpression = new CodeSnippetExpression("\"" + Table.TableName + "\"")
            });

            List<CodeMemberField> fields = new List<CodeMemberField>();
            List<CodeMemberProperty> properties = new List<CodeMemberProperty>();

            CodeMemberProperty classNameProperty = new CodeMemberProperty
            {
                Name = "DataItemClass",
                Attributes = MemberAttributes.Public | MemberAttributes.Override,
                HasGet = true,
                HasSet = false,
                Type = new CodeTypeReference(typeof(string))
            };
            classNameProperty.GetStatements.Add(new CodeSnippetExpression("return DataItemClassName"));
            properties.Add(classNameProperty);

            foreach (SqlColumnInfo column in columns)
            {
                if (!BuiltInFields.Contains(column.ColumnName))
                {
                    CodeMemberField field = new CodeMemberField { Attributes = MemberAttributes.Private };
                    field.Type = MapPropertyType(column);
                    field.Name = "_" + column.ColumnName + "Field";
                    fields.Add(field);

                    CodeMemberProperty property = new CodeMemberProperty
                    {
                        Name = column.ColumnName,
                        Type = field.Type,
                        HasSet = true,
                        HasGet = true,
                        Attributes = MemberAttributes.Public | MemberAttributes.Final
                    };
                    property.SetStatements.Add(new CodeSnippetExpression(string.Format("this.{0} = value", field.Name)));
                    property.GetStatements.Add(new CodeSnippetExpression(string.Format("return this.{0}", field.Name)));
                    property.CustomAttributes.Add(new CodeAttributeDeclaration("XmlAttribute"));
                    properties.Add(property);
                }
                if (column.ColumnName == "State")
                {
                    CodeMemberProperty stateProperty = new CodeMemberProperty
                    {
                        Attributes = MemberAttributes.Public | MemberAttributes.Final,
                        Name = column.ColumnName,
                        HasGet = true,
                        HasSet = true,
                        Type = new CodeTypeReference(stateEnumName)
                    };
                    stateProperty.SetStatements.Add(new CodeSnippetExpression("((IDataItem)this).State = (byte)value"));
                    stateProperty.GetStatements.Add(new CodeSnippetExpression(string.Format("return ({0})((IDataItem)this).State", stateEnumName)));
                    stateProperty.CustomAttributes.Add(new CodeAttributeDeclaration("XmlAttribute"));
                    properties.Add(stateProperty);
                }
            }
            fields.ForEach(t => typeDeclaration.Members.Add(t));
            properties.ForEach(t => typeDeclaration.Members.Add(t));

            CodeCompileUnit compileUnit = new CodeCompileUnit();
            CodeNamespace ns = new CodeNamespace("DykBits.Crm.Data");
            compileUnit.Namespaces.Add(ns);
            ns.Imports.Add(new CodeNamespaceImport("System"));
            ns.Imports.Add(new CodeNamespaceImport("System.Xml.Serialization"));

            ns.Types.Add(typeDeclaration);

            GenerateCode(className + ".cs", compileUnit);
        }


        private static readonly string[] _builtInFields = { "Id", "State", "FileAs", "Comments", "Created", "CreatedBy", "Modified", "ModifiedBy", "RowVersion" };
        private static readonly string[] _numberedBuiltInFields = { "Id", "State", "FileAs", "Comments", "Created", "CreatedBy", "Modified", "ModifiedBy", "RowVersion", "Number", "DocumentDate", "OrganizationId" };

        private string[] BuiltInFields
        {
            get
            {
                if (DocumentType.IsNumbered)
                    return _numberedBuiltInFields;
                return _builtInFields;
            }
        }

        public void GenerateEntity()
        {
            string stateEnumName = Table.TableName + "State";

            CodeTypeDeclaration statesDeclaration = new CodeTypeDeclaration(stateEnumName) { Attributes = MemberAttributes.Public, IsEnum = true };
            statesDeclaration.BaseTypes.Add(new CodeTypeReference(typeof(byte)));
            foreach (DocumentState state in DocumentType.States)
            {
                CodeMemberField stateEnumField = new CodeMemberField { Name = state.Name, InitExpression = new CodePrimitiveExpression(state.State) };
                stateEnumField.CustomAttributes.Add(new CodeAttributeDeclaration("XmlEnum", new CodeAttributeArgument(new CodePrimitiveExpression(state.State.ToString()))));
                statesDeclaration.Members.Add(stateEnumField);
            }

            CodeTypeDeclaration typeDeclaration = new CodeTypeDeclaration(Table.TableName) { Attributes = MemberAttributes.Public };
            if (this.DocumentType.IsNumbered)
                typeDeclaration.BaseTypes.Add(new CodeTypeReference("NumberedDataItem"));
            else
                typeDeclaration.BaseTypes.Add(new CodeTypeReference("DataItem"));
            typeDeclaration.IsClass = true;
            typeDeclaration.IsPartial = true;

            typeDeclaration.Members.Add(new CodeMemberField { Attributes = MemberAttributes.Const | MemberAttributes.Public, Name = "DataItemClassName", Type = new CodeTypeReference(typeof(string)), InitExpression = new CodeSnippetExpression("\"" + Table.TableName + "\"") });

            foreach (ColumnDefinition column in Table.Columns)
            {
                if (!BuiltInFields.Contains(column.ColumnName))
                {
                    typeDeclaration.Members.Add(new CodeMemberField
                    {
                        Attributes = MemberAttributes.Const | MemberAttributes.Public,
                        Name = column.ColumnName + "Property",
                        Type = new CodeTypeReference(typeof(string)),
                        InitExpression = new CodeSnippetExpression("\"" + column.ColumnName + "\"")
                    });
                }
            }

            List<CodeMemberField> fields = new List<CodeMemberField>();
            List<CodeMemberProperty> properties = new List<CodeMemberProperty>();

            CodeMemberProperty classNameProperty = new CodeMemberProperty
            {
                Name = "DataItemClass",
                Attributes = MemberAttributes.Public | MemberAttributes.Override,
                HasGet = true,
                HasSet = false,
                Type = new CodeTypeReference(typeof(string))
            };
            classNameProperty.GetStatements.Add(new CodeSnippetExpression("return DataItemClassName"));
            properties.Add(classNameProperty);

            foreach (ColumnDefinition column in Table.Columns)
            {
                if (!BuiltInFields.Contains(column.ColumnName))
                {
                    CodeMemberField field = new CodeMemberField { Attributes = MemberAttributes.Private };
                    field.Type = MapPropertyType(column);
                    field.Name = "_" + column.ColumnName + "Field";
                    fields.Add(field);

                    CodeMemberProperty property = new CodeMemberProperty
                    {
                        Name = column.ColumnName,
                        Type = field.Type,
                        HasSet = true,
                        HasGet = true,
                        Attributes = MemberAttributes.Public | MemberAttributes.Final
                    };
                    property.SetStatements.Add(new CodeSnippetExpression(string.Format("this.{0} = value", field.Name)));
                    property.SetStatements.Add(new CodeSnippetExpression(string.Format("InvokePropertyChanged(\"{0}\")", column.ColumnName)));
                    property.GetStatements.Add(new CodeSnippetExpression(string.Format("return this.{0}", field.Name)));
                    properties.Add(property);
                    List<CodeAttributeArgument> arguments = new List<CodeAttributeArgument>();
                    arguments.Add(new CodeAttributeArgument("Name", new CodeSnippetExpression(string.Format("\"{0}\"", column.ColumnName))));
                    if (column.IsNullable == "YES")
                        arguments.Add(new CodeAttributeArgument("IsNullable", new CodeSnippetExpression("true")));
                    else
                        arguments.Add(new CodeAttributeArgument("IsNullable", new CodeSnippetExpression("false")));
                    if (column.MaximumLength.HasValue)
                        arguments.Add(new CodeAttributeArgument("MaximumLength", new CodeSnippetExpression(column.MaximumLength.ToString())));

                    CodeAttributeDeclaration attribute = new CodeAttributeDeclaration("Column", arguments.ToArray());

                    property.CustomAttributes.Add(attribute);
                    property.CustomAttributes.Add(new CodeAttributeDeclaration("XmlAttribute"));
                }
                else if (column.ColumnName == "State")
                {
                    CodeMemberProperty stateProperty = new CodeMemberProperty
                    {
                        Attributes = MemberAttributes.Public | MemberAttributes.Final,
                        Name = column.ColumnName,
                        HasGet = true,
                        HasSet = true,
                        Type = new CodeTypeReference(stateEnumName)
                    };
                    stateProperty.SetStatements.Add(new CodeSnippetExpression("((IDataItem)this).State = (byte)value"));
                    stateProperty.GetStatements.Add(new CodeSnippetExpression(string.Format("return ({0})((IDataItem)this).State", stateEnumName)));
                    stateProperty.CustomAttributes.Add(new CodeAttributeDeclaration("XmlAttribute"));
                    properties.Add(stateProperty);
                }
            }
            fields.ForEach(t => typeDeclaration.Members.Add(t));
            properties.ForEach(t => typeDeclaration.Members.Add(t));

            typeDeclaration.Members.Add(new CodeSnippetTypeMember(@"        protected override void OnPropertyChanged(PropertyChangedEventArgs e)
        {
            NotifyPropertyChangedInternal(e.PropertyName);
            base.OnPropertyChanged(e);
        }
"));
            typeDeclaration.Members.Add(new CodeSnippetTypeMember("\t\tpartial void NotifyPropertyChangedInternal(string propertyName);"));

            CodeCompileUnit compileUnit = new CodeCompileUnit();
            CodeNamespace ns = new CodeNamespace("DykBits.Crm.Data");
            compileUnit.Namespaces.Add(ns);
            ns.Imports.Add(new CodeNamespaceImport("System"));
            ns.Imports.Add(new CodeNamespaceImport("System.ComponentModel"));
            ns.Imports.Add(new CodeNamespaceImport("System.Xml.Serialization"));

            ns.Types.Add(statesDeclaration);
            ns.Types.Add(typeDeclaration);

            GenerateCode(Table.TableName + ".cs", compileUnit);
        }

        private void GenerateCode(string fileName, CodeCompileUnit compileUnit)
        {
            CodeDomProvider provider = CodeDomProvider.CreateProvider("C#");
            StringBuilder builder = new StringBuilder();
            using (StringWriter writer = new StringWriter(builder))
            {
                provider.GenerateCodeFromCompileUnit(compileUnit, writer, new CodeGeneratorOptions { BlankLinesBetweenMembers = false, IndentString = "    ", VerbatimOrder = true, BracingStyle = "C" });
            }
            string assemblyName = Helper.GetAssemblyName(this.DocumentType.ClrTypeName);
            string path = @"..\..\..\" + assemblyName.Trim() + @"\Data";
            path = Path.Combine(path, fileName);
            using (StreamWriter writer = File.CreateText(path))
            {
                writer.Write(builder.ToString());
            }
        }

        private static bool IsString(ColumnDefinition column)
        {
            switch (column.DataType.ToLower())
            {
                case "varchar":
                case "nvarchar":
                case "char":
                case "nchar":
                case "text":
                case "ntext":
                    return true;
            }
            return false;
        }

        private static CodeTypeReference MapPropertyType(ColumnDefinition column)
        {
            if (column.ColumnName == "State")
            {
                return new CodeTypeReference(column.TableName + "State");
            }
            switch (column.DataType.ToLower())
            {
                case "varchar":
                case "nvarchar":
                case "char":
                case "nchar":
                case "text":
                case "ntext":
                    return new CodeTypeReference(typeof(String));
                case "int":
                    if (column.IsNullable == "YES")
                        return new CodeTypeReference(typeof(Nullable<Int32>));
                    return new CodeTypeReference(typeof(Int32));
                case "tinyint":
                    if (column.IsNullable == "YES")
                        return new CodeTypeReference(typeof(Nullable<Byte>));
                    return new CodeTypeReference(typeof(Byte));
                case "datetime":
                case "date":
                    if (column.IsNullable == "YES")
                        return new CodeTypeReference(typeof(Nullable<DateTime>));
                    return new CodeTypeReference(typeof(DateTime));
                case "decimal":
                case "money":
                    if (column.IsNullable == "YES")
                        return new CodeTypeReference(typeof(Nullable<Decimal>));
                    return new CodeTypeReference(typeof(Decimal));
                case "timestamp":
                    return new CodeTypeReference(typeof(Byte[]));
                case "binary":
                case "varbinary":
                    return new CodeTypeReference(typeof(Byte[]));
                case "bit":
                    if (column.IsNullable == "YES")
                        return new CodeTypeReference(typeof(Nullable<Boolean>));
                    else
                        return new CodeTypeReference(typeof(Boolean));
                case "time":
                    if (column.IsNullable == "YES")
                        return new CodeTypeReference(typeof(Nullable<TimeSpan>));
                    return new CodeTypeReference(typeof(TimeSpan));
                case "xml":
                    return new CodeTypeReference(typeof(String));
                default:
                    throw new InvalidOperationException();
            }
        }

        private CodeTypeReference MapPropertyType(SqlColumnInfo column)
        {
            if (column.ColumnName == "State")
            {
                return new CodeTypeReference(Table.TableName + "State");
            }
            switch (column.DataType.ToLower())
            {
                case "varchar":
                case "nvarchar":
                case "char":
                case "nchar":
                case "text":
                case "ntext":
                    return new CodeTypeReference(typeof(String));
                case "int":
                    if (column.IsNullable)
                        return new CodeTypeReference(typeof(Nullable<Int32>));
                    return new CodeTypeReference(typeof(Int32));
                case "tinyint":
                    if (column.IsNullable)
                        return new CodeTypeReference(typeof(Nullable<Byte>));
                    return new CodeTypeReference(typeof(Byte));
                case "datetime":
                case "date":
                    if (column.IsNullable)
                        return new CodeTypeReference(typeof(Nullable<DateTime>));
                    return new CodeTypeReference(typeof(DateTime));
                case "decimal":
                case "money":
                    if (column.IsNullable)
                        return new CodeTypeReference(typeof(Nullable<Decimal>));
                    return new CodeTypeReference(typeof(Decimal));
                case "timestamp":
                    return new CodeTypeReference(typeof(Byte[]));
                case "binary":
                case "varbinary":
                    return new CodeTypeReference(typeof(Byte[]));
                case "bit":
                    if (column.IsNullable)
                        return new CodeTypeReference(typeof(Nullable<Boolean>));
                    return new CodeTypeReference(typeof(Boolean));
                case "time":
                    if (column.IsNullable)
                        return new CodeTypeReference(typeof(Nullable<TimeSpan>));
                    return new CodeTypeReference(typeof(TimeSpan));
                case "xml":
                    return new CodeTypeReference(typeof(String));
                default:
                    throw new InvalidOperationException();
            }
        }

    }
}
