// <copyright file="Emitter{TOut}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Immutable;

namespace Neutrino.Pipelines;

public class Emitter<TOut> : IEmitter<TOut>
{
    private readonly object _syncObject = new();
    private ImmutableArray<Receiver<TOut>> _subscriptions = [];
    private readonly Func<CancellationToken, Task<Message<TOut>>>? _generateCallback;

    internal Emitter(
        object owner,
        Pipeline pipeline,
        Func<CancellationToken, Task<Message<TOut>>> generateCallback,
        string name = nameof(Emitter<TOut>))
    {
        Id = pipeline.GenerateId();
        Name = name;
        Owner = owner ?? throw new ArgumentNullException(nameof(owner));
        Pipeline = pipeline ?? throw new ArgumentNullException(nameof(pipeline));
        _generateCallback = generateCallback ?? throw new ArgumentNullException(nameof(generateCallback));
    }

    internal Emitter(
        object owner,
        Pipeline pipeline,
        string name = nameof(Emitter<TOut>))
    {
        Id = pipeline.GenerateId();
        Name = name;
        Owner = owner ?? throw new ArgumentNullException(nameof(owner));
        Pipeline = pipeline ?? throw new ArgumentNullException(nameof(pipeline));
    }

    public int Id { get; }

    public string Name { get; }

    public object Owner { get; }

    public Pipeline Pipeline { get; }

    public Type OutType => typeof(TOut);

    public void Subscribe(IConnection<TOut> connector)
    {
        ArgumentNullException.ThrowIfNull(connector);
        lock (_syncObject)
        {
            _subscriptions = _subscriptions.Add(connector.To);
        }
    }

    public void Unsubscribe(IConnection<TOut> connector)
    {
        ArgumentNullException.ThrowIfNull(connector);
        lock (_syncObject)
        {
            _subscriptions = _subscriptions.Remove(connector.To);
        }
    }

    public async Task PostAsync(Message<TOut> message, CancellationToken cancellationToken)
    {
        await DeliverAsync(message, cancellationToken);
    }

    public virtual async Task RunAsync(CancellationToken cancellationToken)
    {
        if (_generateCallback != null)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                Message<TOut> message = await _generateCallback(cancellationToken);
                await PostAsync(message, cancellationToken);
                if (message.IsEndOfStream)
                {
                    break;
                }
            }
        }
    }

    private async Task DeliverAsync(Message<TOut> message, CancellationToken cancellationToken)
    {
        foreach (Receiver<TOut> receiver in _subscriptions)
        {
            await receiver.EnqueueAsync(message, cancellationToken);
        }
    }
}
