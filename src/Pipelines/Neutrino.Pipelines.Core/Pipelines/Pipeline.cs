// <copyright file="Pipeline.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public class Pipeline : IDisposable
{
    private readonly object _syncObject = new();
    private readonly List<IPipelineComponent> _components = [];
    private List<Task>? _tasks;
    private CancellationTokenSource? _cts;

    private readonly IPipelineLifetime _pipelineLifetime;

    private int _componentId;

    private Pipeline(IPipelineLifetime pipelineLifetime)
    {
        _pipelineLifetime = pipelineLifetime ?? throw new ArgumentNullException(nameof(pipelineLifetime));
    }

    internal int GenerateId()
    {
        return Interlocked.Increment(ref _componentId);
    }

    public static Pipeline Create(IPipelineLifetime pipelineLifetime)
    {
        return new Pipeline(pipelineLifetime);
    }

    public IPipelineLifetime Lifetime => _pipelineLifetime;

    public void Run()
    {
        _cts = CancellationTokenSource.CreateLinkedTokenSource(_pipelineLifetime.Stopping);
        _tasks = _components.Select(t => t.RunAsync(_cts.Token)).ToList();
    }

    public async Task StopAsync()
    {
        if (_tasks is not null && _tasks.Any(t => !t.IsCompleted))
        {
            _pipelineLifetime.Stop();
            await Task.WhenAll(_tasks.Where(t => !t.IsCompleted));
        }
    }

    public Emitter<TOut> CreateEmitter<TOut>(object owner)
    {
        ArgumentNullException.ThrowIfNull(owner);

        Emitter<TOut> emitter = new BypassEmitter<TOut>(owner, this);
        lock (_syncObject)
        {
            _components.Add(emitter);
        }
        return emitter;
    }

    public Emitter<TOut> CreateEmitter<TOut>(object owner, Func<CancellationToken, Task<TOut>> generateCallback)
    {
        ArgumentNullException.ThrowIfNull(owner);
        ArgumentNullException.ThrowIfNull(generateCallback);

        Emitter<TOut> emitter = new ProcessingEmitter<TOut>(owner, this, generateCallback);
        lock (_syncObject)
        {
            _components.Add(emitter);
        }
        return emitter;
    }
    /// <summary>
    /// Creates passive emitter
    /// </summary>
    /// <typeparam name="TOut"></typeparam>
    /// <param name="owner"></param>
    /// <param name="generateCallback"></param>
    /// <returns></returns>
    public Emitter<TOut> CreateEmitter<TOut>(object owner, Func<CancellationToken, Task> generateCallback)
    {
        ArgumentNullException.ThrowIfNull(owner);
        ArgumentNullException.ThrowIfNull(generateCallback);

        Emitter<TOut> emitter = new PassiveEmitter<TOut>(owner, this, generateCallback);
        lock (_syncObject)
        {
            _components.Add(emitter);
        }
        return emitter;
    }

    public Receiver<TIn> CreateReceiver<TIn>(object owner)
    {
        ArgumentNullException.ThrowIfNull(owner);

        Receiver<TIn> receiver = new BypassReceiver<TIn>(owner, this);
        lock (_syncObject)
        {
            _components.Add(receiver);
        }
        return receiver;
    }

    public Receiver<TIn> CreateReceiver<TIn>(object owner, Func<Message<TIn>, CancellationToken, Task> receiveCallback)
    {
        ArgumentNullException.ThrowIfNull(owner);
        ArgumentNullException.ThrowIfNull(receiveCallback);

        Receiver<TIn> receiver = new ProcessingReceiver<TIn>(owner, this, receiveCallback);
        lock (_syncObject)
        {
            _components.Add(receiver);
        }
        return receiver;
    }

    public void Dispose()
    {
        _cts?.Dispose();
    }
}
