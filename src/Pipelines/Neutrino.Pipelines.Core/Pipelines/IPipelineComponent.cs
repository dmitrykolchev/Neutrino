// <copyright file="IPipelineComponent.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public interface IPipelineComponent
{
    int Id { get; }

    string Name { get; }

    object Owner { get; }

    Pipeline Pipeline { get; }

    Task RunAsync(CancellationToken cancellationToken);
}
