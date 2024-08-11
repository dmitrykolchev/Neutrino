// <copyright file="Receiver{TIn}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public abstract class Receiver<TIn> : PipelineComponent, IReceiver
{
    protected Receiver(
        object owner,
        Pipeline pipeline,
        int queueSize = -1,
        string name = nameof(Receiver<TIn>)): base(owner, pipeline, name)
    {
        Queue = new(queueSize);
    }

    public Type InType => typeof(TIn);

    protected AsyncQueue<Message<TIn>> Queue { get; }

    public Task EnqueueAsync(Message<TIn> message, CancellationToken cancellationToken) 
        => Queue.EnqueueAsync(message, cancellationToken);

    public Task<Message<TIn>> DequeueAsync(CancellationToken cancellationToken) 
        => Queue.DequeueAsync(cancellationToken);
}


internal class BypassReceiver<TIn>: Receiver<TIn>
{
    public BypassReceiver(
        object owner,
        Pipeline pipeline,
        int queueSize = -1,
        string name = nameof(BypassReceiver<TIn>)) : base(owner, pipeline, queueSize, name)
    {
    }

    public override Task RunAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

internal class ProcessingReceiver<TIn>: Receiver<TIn>
{
    public ProcessingReceiver(
        object owner,
        Pipeline pipeline,
        Func<Message<TIn>, CancellationToken, Task> receiveCallback,
        int queueSize = -1,
        string name = nameof(ProcessingReceiver<TIn>)):
        base(owner, pipeline, queueSize, name)
    {
        ReceiveCallback = receiveCallback ?? throw new ArgumentNullException(nameof(receiveCallback));
    }

    public Func<Message<TIn>, CancellationToken, Task> ReceiveCallback { get; }

    public override async Task RunAsync(CancellationToken cancellationToken)
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
                Message<TIn> message = await Queue.DequeueAsync(cancellationToken);
                await ReceiveCallback(message, cancellationToken);
            }
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine($"Stoping signal received: {Owner}");
        }
        Console.WriteLine($"Receiver {Owner} completed");
    }
}
