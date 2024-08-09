// <copyright file="Emitter{TOut}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Immutable;

namespace Neutrino.Pipelines;

public class Emitter<TOut> : IEmitter<TOut>
{
    private static readonly Task<PipelineComponentState> CompletedResult = Task.FromResult(PipelineComponentState.Completed);

    private readonly object _syncObject = new();
    private ImmutableArray<Receiver<TOut>> _subscriptions = [];

    internal Emitter(
        object owner,
        Pipeline pipeline,
        Func<CancellationToken, Task<PipelineComponentState>>? generateCallback = null,
        string name = nameof(Emitter<TOut>))
    {
        Id = pipeline.GenerateId();
        Name = name;
        Owner = owner ?? throw new ArgumentNullException(nameof(owner));
        Pipeline = pipeline ?? throw new ArgumentNullException(nameof(pipeline));
        GenerateCallback = generateCallback ?? (_ => CompletedResult);
    }

    public int Id { get; }

    public string Name { get; }

    public object Owner { get; }

    public Pipeline Pipeline { get; }

    public Type OutType => typeof(TOut);

    public Func<CancellationToken, Task<PipelineComponentState>> GenerateCallback { get; }

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

    public async Task PostAsync(Message<TOut> data, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(data);
        await DeliverAsync(data, cancellationToken);
    }

    public virtual async Task RunAsync(CancellationToken cancellationToken)
    {
        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                if (await GenerateCallback(cancellationToken) == PipelineComponentState.Completed)
                {
                    break;
                }
            }
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine($"Stoping signal received: {Owner}");
        }
        Console.WriteLine($"Emitter {Owner} completed");
    }

    private async Task DeliverAsync(Message<TOut> message, CancellationToken cancellationToken)
    {
        if (_subscriptions.Length > 0)
        {
            IEnumerable<Task> tasks = _subscriptions.Select(t => t.EnqueueAsync(message, cancellationToken));
            await Task.WhenAll(tasks);
        }
    }
}
