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

    public AsyncQueue(int maxSize)
    {
        if (maxSize <= 0)
        {
            maxSize = Environment.ProcessorCount;
        }
        _inputSemaphore = new SemaphoreSlim(maxSize, maxSize);
        _outputSemaphore = new SemaphoreSlim(0, maxSize);
    }

    public int Count => _items.Count;

    public bool IsEmpty => _items.IsEmpty;

    public async Task EnqueueAsync(T item, CancellationToken cancellationToken = default)
    {
        await _inputSemaphore.WaitAsync(cancellationToken);
        _items.Enqueue(item);
        _outputSemaphore.Release();
    }

    public async Task<T> DequeueAsync(CancellationToken cancellationToken = default)
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
