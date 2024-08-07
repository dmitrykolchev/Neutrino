// <copyright file="AsyncQueue{T}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Concurrent;

namespace Neutrino.Pipelines;

public class AsyncQueue<T>
{
    private readonly ConcurrentQueue<T> _items = new();
    private readonly SemaphoreSlim _inputSemaphore;
    private readonly SemaphoreSlim _outputSemaphore;

    public AsyncQueue() : this(1)
    {
    }

    public AsyncQueue(int size)
    {
        _inputSemaphore = new SemaphoreSlim(size, size);
        _outputSemaphore = new SemaphoreSlim(0, size);
    }

    public int Count => _items.Count;

    public bool IsEmpty => _items.IsEmpty;

    public Task EnqueueAsync(T item)
    {
        return EnqueueAsync(item, default);
    }

    public async Task EnqueueAsync(T item, CancellationToken cancellationToken)
    {
        await _inputSemaphore.WaitAsync(cancellationToken);
        _items.Enqueue(item);
        _outputSemaphore.Release();
    }

    public Task<T> DequeueAsync()
    {
        return DequeueAsync(default);
    }

    public async Task<T> DequeueAsync(CancellationToken cancellationToken)
    {
        await _outputSemaphore.WaitAsync(cancellationToken);
        if (!_items.TryDequeue(out T? item))
        {
            throw new InvalidOperationException();
        }
        _inputSemaphore.Release();
        return item;
    }

    public bool TryPeek(out T? value)
    {
        return _items.TryPeek(out value);
    }
}
