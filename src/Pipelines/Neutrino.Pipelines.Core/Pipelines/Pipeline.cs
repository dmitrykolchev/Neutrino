// <copyright file="Pipeline.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public class Pipeline : IDisposable
{
    private int _componentId;
    private readonly List<IPipelineComponent> _components = [];
    private readonly object _syncObject = new();

    private Pipeline()
    {
    }

    internal int GenerateId()
    {
        return Interlocked.Increment(ref _componentId);
    }

    public static Pipeline Create()
    {
        return new Pipeline();
    }

    public async Task RunAsync(CancellationToken cancellationToken)
    {
        List<Task> items = _components.Select(t => t.RunAsync(cancellationToken)).ToList();
        await Task.WhenAll(items);
        //while (items.Count > 0)
        //{
        //    Task delay = Task.Delay(1000);
        //    items.Add(delay);
        //    await Task.WhenAny(items);
        //    items = items.Where(t => !t.IsCompleted).ToList();
        //    items.Remove(delay);
        //    Console.WriteLine($"Active tasks: {items.Count}");
        //}
    }

    public Emitter<TOut> CreateEmitter<TOut>(object owner)
    {
        ArgumentNullException.ThrowIfNull(owner);

        Emitter<TOut> emitter = new(owner, this);
        lock (_syncObject)
        {
            _components.Add(emitter);
        }
        return emitter;
    }

    public Emitter<TOut> CreateEmitter<TOut>(object owner, Func<CancellationToken, Task<Message<TOut>>> generateCallback)
    {
        ArgumentNullException.ThrowIfNull(owner);
        ArgumentNullException.ThrowIfNull(generateCallback);

        Emitter<TOut> emitter = new(owner, this, generateCallback);
        lock (_syncObject)
        {
            _components.Add(emitter);
        }
        return emitter;
    }

    public Receiver<TIn> CreateReceiver<TIn>(object owner, Func<Message<TIn>, CancellationToken, Task> receiveCallback)
    {
        ArgumentNullException.ThrowIfNull(owner);
        ArgumentNullException.ThrowIfNull(receiveCallback);

        Receiver<TIn> receiver = new(owner, this, receiveCallback);
        lock (_syncObject)
        {
            _components.Add(receiver);
        }

        return receiver;
    }

    public IConnection<TData> CreateConnection<TData>(Emitter<TData> from, Receiver<TData> to)
    {
        ArgumentNullException.ThrowIfNull(from);
        ArgumentNullException.ThrowIfNull(to);

        Connection<TData> connection = new(this, from, to);
        from.Subscribe(connection);
        return connection;
    }

    public void Dispose()
    {

    }
}
