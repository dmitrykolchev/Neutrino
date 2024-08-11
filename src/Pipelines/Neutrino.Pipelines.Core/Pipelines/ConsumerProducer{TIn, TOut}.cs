// <copyright file="ConsumerProducer{TIn, TOut}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public abstract class ConsumerProducer<TIn, TOut> : IConsumerProducer<TIn, TOut>
{
    protected ConsumerProducer(Pipeline pipeline, string name = nameof(ConsumerProducer<TIn, TOut>))
    {
        In = pipeline.CreateReceiver<TIn>(this, OnReceiveInternalAsync);
        Out = pipeline.CreateEmitter<TOut>(this);
    }

    public Receiver<TIn> In { get; }

    public Emitter<TOut> Out { get; }

    public PipelineComponentState State { get; protected set; } = PipelineComponentState.Active;

    protected abstract Task<TOut> OnReceiveAsync(Message<TIn> data, CancellationToken cancellationToken);

    private async Task OnReceiveInternalAsync(Message<TIn> data, CancellationToken cancellationToken)
    {
        TOut result = await OnReceiveAsync(data, cancellationToken).ConfigureAwait(false);
        await Out.PostAsync(new Message<TOut>(result, this), cancellationToken).ConfigureAwait(false);
    }
}
