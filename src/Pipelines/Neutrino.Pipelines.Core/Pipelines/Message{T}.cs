// <copyright file="Message{T}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public class Message<T> : Message
{
    public Message(T data)
    {
        Data = data;
    }

    public T Data { get; }

    public override object? GetData() => Data;

    public override string ToString()
    {
        return $"{nameof(Message<T>)}[{Id}]: {Data}";
    }
}
