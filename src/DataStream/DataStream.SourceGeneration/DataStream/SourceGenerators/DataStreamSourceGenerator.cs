// <copyright file="DataStreamSourceGenerator.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics;
using System.Text;
using DataStream.SourceGenerators.Model;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using SourceGeneration;

namespace DataStream.SourceGeneration;

[Generator]
public partial class DataStreamSourceGenerator : IIncrementalGenerator
{
    public DataStreamSourceGenerator()
    {
    }

    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
#if LAUNCH_DEBUGGER
        System.Diagnostics.Debugger.Launch();
#endif
        IncrementalValueProvider<KnownTypeSymbols> knownTypeSymbols = context.CompilationProvider
                .Select((compilation, _) => new KnownTypeSymbols(compilation));

        var dataStreamClasses = context.SyntaxProvider
            .ForAttributeWithMetadataName(
                "DataStream.DataStreamSerializableAttribute",
                static (node, cancellationToken) => node is ClassDeclarationSyntax,
                static (ctx, cancellationToken) => (ContextClass: (ClassDeclarationSyntax)ctx.TargetNode, ctx.SemanticModel))
            .Combine(knownTypeSymbols)
            .Select(static (tuple, cancellationToken) =>
            {
                Parser parser = new(tuple.Right);
                ContextGenerationSpec? contextGenerationSpec = parser.ParseContextGenerationSpec(tuple.Left.ContextClass, tuple.Left.SemanticModel, cancellationToken);
                ImmutableEquatableArray<DiagnosticInfo> diagnostics = parser.Diagnostics.ToImmutableEquatableArray();
                return (contextGenerationSpec, diagnostics);
            });
        context.RegisterSourceOutput(dataStreamClasses, GenerateSourceCode);
    }

    private static void GenerateSourceCode(
        SourceProductionContext context,
        (ContextGenerationSpec? ContextGenerationSpec, ImmutableEquatableArray<DiagnosticInfo> Diagnostics) input)
    {
        Debug.WriteLine(input.ToString());
        //ClassDeclarationSyntax classSyntax = input.ContextGenerationSpec;
        //string className = GetClassFullname(classSyntax);
        //StringBuilder sourceCode = new();
        //using IndentedTextWriter writer = new(new StringWriter(sourceCode), "    ");
        //var properties = classSyntax.Members
        //    .Where(t => t.Kind() is SyntaxKind.PropertyDeclaration)
        //    .Cast<PropertyDeclarationSyntax>();
        //foreach (var property in properties)
        //{
        //    Debug.WriteLine($"{property}");
        //}
        //context.AddSource($"{className}.g.c", sourceCode.ToString());
    }

    /// <summary>
    /// https://stackoverflow.com/a/61409409
    /// </summary>
    public static string GetClassFullname(TypeDeclarationSyntax? source)
    {
        LinkedList<BaseNamespaceDeclarationSyntax> namespaces = new();
        LinkedList<TypeDeclarationSyntax> types = new();

        for (var parent = source?.Parent; parent is not null; parent = parent.Parent)
        {
            switch (parent)
            {
                case BaseNamespaceDeclarationSyntax @namespace:
                    namespaces.AddFirst(@namespace);
                    break;
                case TypeDeclarationSyntax type:
                    types.AddFirst(type);
                    break;
            }
        }

        StringBuilder result = new();

        for (var item = namespaces.First; item is not null; item = item.Next)
        {
            result.Append(item.Value.Name).Append(".");
        }

        for (var item = types.First; item is not null; item = item.Next)
        {
            var type = item.Value;
            AppendName(result, type);
            result.Append(".");
        }

        AppendName(result, source);

        return result.ToString();
    }

    private static void AppendName(StringBuilder builder, TypeDeclarationSyntax? type)
    {
        builder.Append(type?.Identifier.Text);
        int typeArguments = type?.TypeParameterList?.ChildNodes()
            .Count(node => node is TypeParameterSyntax) ?? 0;
        if (typeArguments != 0)
        {
            builder.Append(".").Append(typeArguments);
        }
    }


    //    SourceProductionContext sourceProductionContext,
    //    (ContextGenerationSpec? ContextGenerationSpec, ImmutableEquatableArray<DiagnosticInfo> Diagnostics) input)
}
