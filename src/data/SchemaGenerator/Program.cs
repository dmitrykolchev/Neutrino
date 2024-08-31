using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace SchemaGenerator
{
    class Program
    {
        private const string GetDocumentTypesSql = @"
select
    id, code, name, schema_name, table_name, supports_history 
from 
    metadata.document_type
where
    schema_name is not null;";
        static void Main(string[] args)
        {
            try
            {
                if (args.Length != 2)
                {
                    throw new InvalidOperationException();
                }
                DocumentType[] documentTypes;
                using (SqlConnection connection = new SqlConnection(SchemaGenerator.Properties.Settings.Default.ConnectionString))
                {
                    DefaultTypeMap.MatchNamesWithUnderscores = true;
                    connection.Open();
                    documentTypes = connection.Query<DocumentType>(GetDocumentTypesSql).ToArray();
                }
                foreach (DocumentType documentType in documentTypes)
                {
                    Console.WriteLine($"-> {documentType.Code}/{documentType.Name}");
                    DocumentSchemaGenerator generator = new DocumentSchemaGenerator(documentType.Code, args[0]);
                    string path = Path.Combine(args[1], documentType.Code + "Schema.cs");
                    generator.Execute(path);
                    Console.WriteLine($"Generated {path}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine($"Usage: SchemaGenerator <Namespace> <OutPath>");
            }
            Console.ReadKey();
        }
    }
}
