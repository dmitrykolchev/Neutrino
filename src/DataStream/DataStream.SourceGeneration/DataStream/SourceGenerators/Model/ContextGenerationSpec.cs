// <copyright file="ContextGenerationSpec.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics;
using SourceGeneration;

namespace DataStream.SourceGenerators.Model;

/// <summary>
/// Represents the set of input types and options needed to provide an
/// implementation for a user-provided JsonSerializerContext-derived type.
/// </summary>
/// <remarks>
/// Type needs to be cacheable as a Roslyn incremental value so it must be
///
/// 1) immutable and
/// 2) implement structural (pointwise) equality comparison.
///
/// We can get these properties for free provided that we
///
/// a) define the type as an immutable C# record and
/// b) ensure all nested members are also immutable and implement structural equality.
///
/// When adding new members to the type, please ensure that these properties
/// are satisfied otherwise we risk breaking incremental caching in the source generator!
/// </remarks>
[DebuggerDisplay("ContextType = {ContextType.Name}")]
public sealed record ContextGenerationSpec
{
    public required TypeRef ContextType { get; init; }

    public required ImmutableEquatableArray<TypeGenerationSpec> GeneratedTypes { get; init; }

    public required string? Namespace { get; init; }

    public required ImmutableEquatableArray<string> ContextClassDeclarations { get; init; }

    public required SourceGenerationOptionsSpec? GeneratedOptionsSpec { get; init; }
}
