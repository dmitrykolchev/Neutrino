// <copyright file="Splitter{T, TKey}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;

namespace Neutrino.Pipelines.Operators;
internal class Splitter<T, TKey> : IConsumer<T> 
    where TKey : notnull
{
    private readonly Func<Message<T>, TKey> _selector;
    private readonly ConcurrentDictionary<TKey, Emitter<T>> _consumers = new();
    private readonly IProducer<T> _producer;
    private readonly Pipeline _pipeline;

    public Splitter(IProducer<T> producer, Func<Message<T>, TKey> selector)
    {
        _producer = producer ?? throw new ArgumentNullException(nameof(producer));
        _selector = selector ?? throw new ArgumentNullException(nameof(selector));
        _pipeline = producer.Out.Pipeline;
        In = _pipeline.CreateReceiver<T>(this, ReceiveAsync);
        producer.PipeTo(this);
    }

    public Receiver<T> In { get; }

    public PipelineComponentState State => PipelineComponentState.Active;

    public Emitter<T> Add(TKey key)
    {
        if (_consumers.ContainsKey(key))
        {
            throw new InvalidOperationException();
        }
        Emitter<T> emitter = _pipeline.CreateEmitter<T>(this);
        _consumers.TryAdd(key, emitter);
        return emitter;
    }

    private async Task ReceiveAsync(Message<T> message, CancellationToken token)
    {
        TKey key = _selector(message);
        if (_consumers.TryGetValue(key, out Emitter<T>? emitter))
        {
            await emitter.PostAsync(message, token);
        }
    }
}
