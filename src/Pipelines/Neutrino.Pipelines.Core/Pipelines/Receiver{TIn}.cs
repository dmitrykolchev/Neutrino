// <copyright file="Receiver{TIn}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public enum PipelineComponentState
{
    Active,
    Completed
}

public class Receiver<TIn> : IReceiver
{
    public Receiver(
        object owner,
        Pipeline pipeline,
        Func<CancellationToken, Task<PipelineComponentState>> receiveCallback,
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

    public Func<CancellationToken, Task<PipelineComponentState>> ReceiveCallback { get; }

    protected AsyncQueue<Message<TIn>> Queue { get; }

    public Task EnqueueAsync(Message<TIn> message, CancellationToken cancellationToken)
    {
        return Queue.EnqueueAsync(message, cancellationToken);
    }

    public async Task<Message<TIn>> GetMessageAsync(CancellationToken cancellationToken)
    {
        return await Queue.DequeueAsync(cancellationToken);
    }

    public virtual async Task RunAsync(CancellationToken cancellationToken)
    {
        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                if(await ReceiveCallback(cancellationToken) == PipelineComponentState.Completed)
                {
                    break;
                }
            }
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine($"Stoping signal received: {Owner}");
        }
        Console.WriteLine($"Receiver {Owner} completed");
    }
}
