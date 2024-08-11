// <copyright file="SimpleConsumer{TIn}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines.Operators;

internal class SimpleConsumer<TIn> : IConsumer<TIn>
{
    public SimpleConsumer(object owner, Pipeline pipeline)
    {
        In = pipeline.CreateReceiver<TIn>(owner);
    }

    public Receiver<TIn> In { get; }

    public PipelineComponentState State => PipelineComponentState.Active;
}
