// <copyright file="Program.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Sam.CommandLine;
using SchemaCompare.Data;
using SchemaCompare.Data.Schema;
using static System.Console;

namespace SchemaCompare;

internal class Program
{
    public static IConfigurationRoot Configuration { get; set; } = null!;

    public static IServiceProvider ServiceProvider { get; set; } = null!;

    public static ApplicationOptions ApplicationOptions { get; set; } = null!;

    private static void Main(string[] args)
    {
        Configure(args);

        WriteLine("Parameters:");
        WriteLine($"\t{nameof(ApplicationOptions.ConnectionName)}: {ApplicationOptions.ConnectionName}");
        WriteLine($"\t{nameof(ApplicationOptions.SqlScript)}: {ApplicationOptions.SqlScript}");
        WriteLine($"\t{nameof(ApplicationOptions.PgSqlScript)}: {ApplicationOptions.PgSqlScript}");
        WriteLine($"\t{nameof(ApplicationOptions.UpdateScript)}: {ApplicationOptions.UpdateScript}");

        ConnectionOptions connectionOptions = ApplicationOptions.GetConnection();
        SchemaGenerator sqlSchemaGenerator = new SqlServerSchemaGenerator(connectionOptions.SourceConnectionString);
        Database source = sqlSchemaGenerator.GenerageSchema();

        using (TextWriter writer = File.CreateText(ApplicationOptions.SqlScript))
        {
            ScriptGenerator printer = new(writer);
            printer.Run(source);
            WriteLine($"{Path.GetFullPath(ApplicationOptions.SqlScript)} successfully written");
        }

        //using (TextWriter writer = File.CreateText(ApplicationOptions.PgSqlScript))
        //{
        //    ScriptGenerator printer = new ScriptGenerator(writer);
        //    printer.Run(destination);
        //    WriteLine($"{Path.GetFullPath(ApplicationOptions.PgSqlScript)} successfully written");
        //}

        using (TextWriter writer = File.CreateText(ApplicationOptions.PgSqlScript))
        {
            UpdateScriptGenerator updateScriptGenerator = new(source, new Database());
            updateScriptGenerator.Generate(writer);
            WriteLine($"{Path.GetFullPath(ApplicationOptions.PgSqlScript)} successfully written");
        }

        SchemaGenerator pgSchemaGenerator = new PgSqlSchemaGenerator(connectionOptions.TargetConnectionString);
        Database destination = pgSchemaGenerator.GenerageSchema();

        using (TextWriter writer = File.CreateText(ApplicationOptions.UpdateScript))
        {
            UpdateScriptGenerator updateScriptGenerator = new(source, destination);
            updateScriptGenerator.Generate(writer);
            WriteLine($"{Path.GetFullPath(ApplicationOptions.UpdateScript)} successfully written");
        }
    }

    private static void Configure(string[] args)
    {
        CommandLineParser<CommandLineOptions> parser = new();
        CommandLineOptions commandLineOptions = parser.ParseCommandLine(args);

        Configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", false, false)
            .Build();

        ServiceCollection services = new();
        services.Configure<ApplicationOptions>(Configuration);
        ServiceProvider = services.BuildServiceProvider();

        ApplicationOptions = ServiceProvider.GetRequiredService<IOptions<ApplicationOptions>>().Value;

        // Параметры командной строки имеют приоритет над параметрами из конфигурационного файла
        ApplicationOptions.ConnectionName = commandLineOptions.ConnectionName ?? ApplicationOptions.ConnectionName;
        ApplicationOptions.SqlScript = commandLineOptions.SqlScript ?? ApplicationOptions.SqlScript;
        ApplicationOptions.PgSqlScript = commandLineOptions.PgSqlScript ?? ApplicationOptions.PgSqlScript;
        ApplicationOptions.UpdateScript = commandLineOptions.UpdateScript ?? ApplicationOptions.UpdateScript;
    }
}
