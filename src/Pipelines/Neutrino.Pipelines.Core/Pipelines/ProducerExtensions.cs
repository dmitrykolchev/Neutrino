// <copyright file="EmitterReceiverExtensions.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using Neutrino.Pipelines.Operators;

namespace Neutrino.Pipelines;

public static class ProducerExtensions
{
    public static TConsumer PipeTo<T, TConsumer>(this IProducer<T> producer, TConsumer consumer)
        where TConsumer: IConsumer<T>
    {
        ArgumentNullException.ThrowIfNull(consumer);
        Pipeline pipeline = producer.Out.Pipeline;
        producer.Out.Subscribe(consumer.In);
        return consumer;
    }

    public static IProducer<(TIn1,TIn2)> Zip<TIn1, TIn2>(this IProducer<TIn1> p1, IProducer<TIn2> p2)
    {
        ArgumentNullException.ThrowIfNull(p1);
        ArgumentNullException.ThrowIfNull(p2);
        return new Zip<TIn1,TIn2>(p1, p2) ;
    }
    public static IProducer<T> Join<T>(this IProducer<T> p1, IProducer<T> p2)
    {
        ArgumentNullException.ThrowIfNull(p1);
        ArgumentNullException.ThrowIfNull(p2);
        return new Join<T>(p1, p2);
    }
}
