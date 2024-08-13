// <copyright file="Emitter{TOut}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Immutable;

namespace Neutrino.Pipelines;

public abstract class Emitter<TOut> : PipelineComponent, IEmitter
{
    private readonly object _syncObject = new();
    private ImmutableArray<Receiver<TOut>> _subscriptions = [];

    protected Emitter(
        object owner,
        Pipeline pipeline,
        string name = nameof(Emitter<TOut>)): base(owner, pipeline, name)
    {
    }

    public Type OutType => typeof(TOut);

    public void Subscribe(Receiver<TOut> receiver)
    {
        ArgumentNullException.ThrowIfNull(receiver);
        lock (_syncObject)
        {
            _subscriptions = _subscriptions.Add(receiver);
        }
    }

    public void Unsubscribe(Receiver<TOut> receiver)
    {
        ArgumentNullException.ThrowIfNull(receiver);
        lock (_syncObject)
        {
            _subscriptions = _subscriptions.Remove(receiver);
        }
    }

    public virtual async Task PostAsync(Message<TOut> data, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(data);
        await DeliverAsync(data, cancellationToken);
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

internal class BypassEmitter<TOut>: Emitter<TOut>
{
    public BypassEmitter(
        object owner,
        Pipeline pipeline,
        string name = nameof(BypassEmitter<TOut>)) : base(owner, pipeline, name)
    {
    }

    public override Task RunAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

internal class ProcessingEmitter<TOut> : Emitter<TOut>
{
    public ProcessingEmitter(
        object owner,
        Pipeline pipeline,
        Func<CancellationToken, Task<TOut>> generateCallback,
        string name = nameof(ProcessingEmitter<TOut>)): base(owner, pipeline, name)
    {
        GenerateCallback = generateCallback ?? throw new ArgumentNullException(nameof(generateCallback));
    }

    public Func<CancellationToken, Task<TOut>> GenerateCallback { get; }

    public override async Task RunAsync(CancellationToken cancellationToken)
    {
        if (GenerateCallback is not null)
        {
            try
            {
                Func<PipelineComponentState> getState = Owner switch
                {
                    IStatefull statefull => () => statefull.State,
                    _ => static () => PipelineComponentState.Active
                };
                while (getState() == PipelineComponentState.Active)
                {
                    if (cancellationToken.IsCancellationRequested)
                    {
                        break;
                    }
                    TOut data = await GenerateCallback(cancellationToken);
                    await PostAsync(new Message<TOut>(data, Owner), cancellationToken);
                }
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine($"Stoping signal received: {Owner}");
            }
        }
        Console.WriteLine($"Emitter {Owner} completed");
    }
}

internal class PassiveEmitter<TOut> : Emitter<TOut>
{
    public PassiveEmitter(
        object owner,
        Pipeline pipeline,
        Func<CancellationToken, Task> generateCallback,
        string name = nameof(PassiveEmitter<TOut>)) : base(owner, pipeline, name)
    {
        GenerateCallback = generateCallback ?? throw new ArgumentNullException(nameof(generateCallback));
    }

    public Func<CancellationToken, Task> GenerateCallback { get; }

    public override async Task RunAsync(CancellationToken cancellationToken)
    {
        if (GenerateCallback is not null)
        {
            try
            {
                Func<PipelineComponentState> getState = Owner switch
                {
                    IStatefull statefull => () => statefull.State,
                    _ => static () => PipelineComponentState.Active
                };
                while (getState() == PipelineComponentState.Active)
                {
                    if (cancellationToken.IsCancellationRequested)
                    {
                        break;
                    }
                    await GenerateCallback(cancellationToken);
                }
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine($"Stoping signal received: {Owner}");
            }
        }
        Console.WriteLine($"Emitter {Owner} completed");
    }
}

