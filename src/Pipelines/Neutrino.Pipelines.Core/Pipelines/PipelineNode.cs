// <copyright file="PipelineNode.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public abstract class PipelineNode
{
    private readonly Pipeline _pipeline;
    private readonly IPipelineComponent _component;

    protected PipelineNode(Pipeline pipeline, IPipelineComponent component) 
    { 
        _pipeline = pipeline ?? throw new ArgumentNullException(nameof(pipeline));
        _component = component ?? throw new ArgumentNullException(nameof(component));
    }

    public Pipeline Pipeline => _pipeline;

    public IPipelineComponent Component => _component;
}
