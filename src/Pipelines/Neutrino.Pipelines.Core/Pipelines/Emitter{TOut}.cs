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
    private readonly Func<CancellationToken, Task<bool>>? _generateCallback;

    internal Emitter(
        object owner,
        Pipeline pipeline,
        Func<CancellationToken, Task<bool>> generateCallback,
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

    public async Task PostAsync(TOut data, CancellationToken cancellationToken)
    {
        await DeliverAsync(data, cancellationToken);
    }

    public virtual async Task RunAsync(CancellationToken cancellationToken)
    {
        if (_generateCallback != null)
        {
            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    if (!await _generateCallback(cancellationToken))
                    {
                        break;
                    }
                }
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine($"Stoping signal received: {Owner}");
            }
        }
        Console.WriteLine($"Emitter {Owner} completed");
    }

    private async Task DeliverAsync(TOut data, CancellationToken cancellationToken)
    {
        Message<TOut> message = new(data);
        foreach (Receiver<TOut> receiver in _subscriptions)
        {
            await receiver.EnqueueAsync(message, cancellationToken);
        }
    }
}
