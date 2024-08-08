// <copyright file="Receiver{TIn}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public class Receiver<TIn> : IReceiver<TIn>
{
    private readonly AsyncQueue<Message<TIn>> _queue;

    public Receiver(
        object owner,
        Pipeline pipeline,
        Func<Message<TIn>, CancellationToken, Task>? receiveCallback = null,
        int queueSize = -1,
        string name = nameof(Receiver<TIn>))
    {
        Id = pipeline.GenerateId();
        Name = name;
        Owner = owner ?? throw new ArgumentNullException(nameof(owner));
        Pipeline = pipeline ?? throw new ArgumentNullException(nameof(pipeline));
        ReceiveCallback = receiveCallback ?? EnqueueAsync;
        _queue = new(queueSize);
    }

    public int Id { get; }

    public string Name { get; }

    public object Owner { get; }

    public Pipeline Pipeline { get; }

    public Type InType => typeof(TIn);

    public Func<Message<TIn>, CancellationToken, Task> ReceiveCallback { get; }

    protected AsyncQueue<Message<TIn>> Queue => _queue;

    public async Task EnqueueAsync(Message<TIn> message, CancellationToken cancellationToken)
    {
        await Queue.EnqueueAsync(message, cancellationToken);
    }

    public virtual async Task RunAsync(CancellationToken cancellationToken)
    {
        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
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
