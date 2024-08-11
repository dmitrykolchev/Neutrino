// <copyright file="SimpleConsumer{TIn}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines.Operators;

internal class SimpleProducer<TOut> : IProducer<TOut>
{
    public SimpleProducer(object owner, Pipeline pipeline)
    {
        Out = pipeline.CreateEmitter<TOut>(owner);
    }

    public Emitter<TOut> Out { get; }

    public PipelineComponentState State => PipelineComponentState.Active;
}
