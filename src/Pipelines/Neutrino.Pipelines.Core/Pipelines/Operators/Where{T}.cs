// <copyright file="Zip{TIn1, TIn2, TOut}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines.Operators;

internal class Where<T> : IProducer<T>
{
    private readonly Predicate<Message<T>> _predicate;

    public Where(IProducer<T> producer, Predicate<Message<T>> predicate)
    {
        _predicate = predicate ?? throw new ArgumentNullException(nameof(predicate));
        Pipeline pipeline = producer.Out.Pipeline;
        Consumer = new SimpleConsumer<T>(this, pipeline);
        producer.PipeTo(Consumer);
        Out = pipeline.CreateEmitter<T>(this, GenerateInternalAsync);
    }

    private SimpleConsumer<T> Consumer { get; }
    
    public Emitter<T> Out { get; }

    public PipelineComponentState State => PipelineComponentState.Active;

    private async Task GenerateInternalAsync(CancellationToken cancellationToken)
    {
        Message<T> message = await Consumer.In.DequeueAsync(cancellationToken);
        if(_predicate(message))
        {
            await Out.PostAsync(message, cancellationToken);
        }
    }
}
