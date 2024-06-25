// <copyright file="DataStreamSourceGenerator.Parser.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics;
using DataStream.SourceGenerators.Model;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using SourceGeneration;

namespace DataStream.SourceGeneration;
public partial class DataStreamSourceGenerator
{
    private sealed class Parser
    {
        private readonly struct TypeToGenerate
        {
            public required ITypeSymbol Type { get; init; }
            public required string? TypeInfoPropertyName { get; init; }
            public required Location? Location { get; init; }
            public required Location? AttributeLocation { get; init; }
        }

        private readonly KnownTypeSymbols _knownSymbols;
        private readonly bool _compilationContainsCoreJsonTypes;
        private readonly object _builtInSupportTypes;
        private readonly Queue<TypeToGenerate> _typesToGenerate = new();
        private Location? _contextClassLocation;
        private readonly Dictionary<ITypeSymbol, TypeGenerationSpec> _generatedTypes = new(SymbolEqualityComparer.Default);

        public Parser(KnownTypeSymbols knownSymbols)
        {
            _knownSymbols = knownSymbols;

            _builtInSupportTypes = (knownSymbols.BuiltInSupportTypes ??= CreateBuiltInSupportTypeSet(knownSymbols));
        }

        public List<DiagnosticInfo> Diagnostics { get; } = new();

        public ContextGenerationSpec? ParseContextGenerationSpec(ClassDeclarationSyntax contextClassDeclaration, SemanticModel semanticModel, CancellationToken cancellationToken)
        {
            INamedTypeSymbol? contextTypeSymbol = semanticModel.GetDeclaredSymbol(contextClassDeclaration, cancellationToken);
            if (contextTypeSymbol == null)
            {
                throw new InvalidOperationException();
            }
            _contextClassLocation = contextTypeSymbol.GetLocation();

            ParseDataStreamSerializerContextAttributes(
                contextTypeSymbol,
                out List<TypeToGenerate>? rootSerializableTypes,
                out SourceGenerationOptionsSpec? options);

            // Enqueue attribute data for spec generation
            foreach (TypeToGenerate rootSerializableType in rootSerializableTypes)
            {
                _typesToGenerate.Enqueue(rootSerializableType);
            }

            // Walk the transitive type graph generating specs for every encountered type.
            while (_typesToGenerate.Count > 0)
            {
                cancellationToken.ThrowIfCancellationRequested();
                TypeToGenerate typeToGenerate = _typesToGenerate.Dequeue();
                if (!_generatedTypes.ContainsKey(typeToGenerate.Type))
                {
                    //TypeGenerationSpec spec = ParseTypeGenerationSpec(typeToGenerate, contextTypeSymbol, options);
                    //_generatedTypes.Add(typeToGenerate.Type, spec);
                }
            }

            ContextGenerationSpec contextGenSpec = new()
            {
                ContextType = new(contextTypeSymbol),
                GeneratedTypes = _generatedTypes.Values.OrderBy(t => t.TypeRef.FullyQualifiedName).ToImmutableEquatableArray(),
                Namespace = contextTypeSymbol.ContainingNamespace is { IsGlobalNamespace: false } ns ? ns.ToDisplayString() : null,
                ContextClassDeclarations = null!, //classDeclarationList.ToImmutableEquatableArray(),
                GeneratedOptionsSpec = options,
            };

            // Clear the caches of generated metadata between the processing of context classes.
            _generatedTypes.Clear();
            _typesToGenerate.Clear();
            _contextClassLocation = null;
            return contextGenSpec;
        }

        private void ParseDataStreamSerializerContextAttributes(
            INamedTypeSymbol contextClassSymbol,
            out List<TypeToGenerate>? rootSerializableTypes,
            out SourceGenerationOptionsSpec? options)
        {
            rootSerializableTypes = null;
            options = null;

            foreach (AttributeData attributeData in contextClassSymbol.GetAttributes())
            {
                INamedTypeSymbol? attributeClass = attributeData.AttributeClass;

                if (SymbolEqualityComparer.Default.Equals(attributeClass, _knownSymbols.DataStreamSerializableAttributeType))
                {
                    TypeToGenerate typeToGenerate = new()
                    {
                        Type = _knownSymbols.Compilation.EraseCompileTimeMetadata(contextClassSymbol),
                        TypeInfoPropertyName = null,
                        Location = contextClassSymbol.GetLocation(),
                        AttributeLocation = attributeClass?.GetLocation()
                    };
                    (rootSerializableTypes ??= new()).Add(typeToGenerate);
                }
            }
        }

        private TypeToGenerate? ParseDataStreamSerializableAttribute(AttributeData attributeData)
        {
            Debug.Assert(attributeData.ConstructorArguments.Length == 1);
            ITypeSymbol? typeSymbol = (ITypeSymbol?)attributeData.ConstructorArguments[0].Value;
            if (typeSymbol is null)
            {
                return null;
            }

            Location? location = typeSymbol.GetLocation();
            Location? attributeLocation = attributeData.GetLocation();
            Debug.Assert(attributeLocation != null);

            if (location is null || !_knownSymbols.Compilation.ContainsLocation(location))
            {
                // For symbols located outside the compilation, fall back to attribute location instead.
                location = attributeLocation;
            }

            return new TypeToGenerate
            {
                Type = _knownSymbols.Compilation.EraseCompileTimeMetadata(typeSymbol),
                TypeInfoPropertyName = null,
                Location = location,
                AttributeLocation = attributeLocation,
            };
        }

        private static HashSet<ITypeSymbol> CreateBuiltInSupportTypeSet(KnownTypeSymbols knownSymbols)
        {
#pragma warning disable RS1024 // Compare symbols correctly https://github.com/dotnet/roslyn-analyzers/issues/5804
            HashSet<ITypeSymbol> builtInSupportTypes = new(SymbolEqualityComparer.Default);
#pragma warning restore

            AddTypeIfNotNull(knownSymbols.ByteArrayType);
            AddTypeIfNotNull(knownSymbols.MemoryByteType);
            AddTypeIfNotNull(knownSymbols.ReadOnlyMemoryByteType);
            AddTypeIfNotNull(knownSymbols.TimeSpanType);
            AddTypeIfNotNull(knownSymbols.DateTimeOffsetType);
            AddTypeIfNotNull(knownSymbols.DateOnlyType);
            AddTypeIfNotNull(knownSymbols.TimeOnlyType);
            AddTypeIfNotNull(knownSymbols.Int128Type);
            AddTypeIfNotNull(knownSymbols.UInt128Type);
            AddTypeIfNotNull(knownSymbols.HalfType);
            AddTypeIfNotNull(knownSymbols.GuidType);
            AddTypeIfNotNull(knownSymbols.UriType);
            AddTypeIfNotNull(knownSymbols.VersionType);

            return builtInSupportTypes;

            void AddTypeIfNotNull(ITypeSymbol? type)
            {
                if (type != null)
                {
                    builtInSupportTypes.Add(type);
                }
            }
        }
    }
}
