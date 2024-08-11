// <copyright file="Receiver{TIn}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public class Receiver<TIn> : IReceiver
{
    public Receiver(
        object owner,
        Pipeline pipeline,
        Func<Message<TIn>, CancellationToken, Task> receiveCallback,
        int queueSize = -1,
        string name = nameof(Receiver<TIn>))
    {
        Id = pipeline.GenerateId();
        Name = name;
        Owner = owner ?? throw new ArgumentNullException(nameof(owner));
        Pipeline = pipeline ?? throw new ArgumentNullException(nameof(pipeline));
        ReceiveCallback = receiveCallback;
        Queue = new(queueSize);
    }

    public int Id { get; }

    public string Name { get; }

    public object Owner { get; }

    public Pipeline Pipeline { get; }

    public Type InType => typeof(TIn);

    public Func<Message<TIn>, CancellationToken, Task> ReceiveCallback { get; }

    protected AsyncQueue<Message<TIn>> Queue { get; }

    public Task EnqueueAsync(Message<TIn> message, CancellationToken cancellationToken)
    {
        return Queue.EnqueueAsync(message, cancellationToken);
    }

    public virtual async Task RunAsync(CancellationToken cancellationToken)
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
