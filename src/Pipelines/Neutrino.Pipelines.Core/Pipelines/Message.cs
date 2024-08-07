// <copyright file="Message.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public abstract class Message
{
    private static int MessageCounter = 0;

    protected Message()
    {
        Id = Interlocked.Increment(ref MessageCounter);
    }

    protected Message(bool endOfStream)
    {
        Id = int.MaxValue;
    }

    public int Id { get; }

    public bool IsEndOfStream => Id == int.MaxValue;

    public abstract object? GetData();
}
