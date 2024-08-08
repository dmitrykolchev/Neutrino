// <copyright file="EmitterReceiverExtensions.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public static class ProducerExtensions
{
    public static IConnection<T> PipeTo<T>(this IProducer<T> producer, IConsumer<T> consumer)
    {
        ArgumentNullException.ThrowIfNull(consumer);
        Pipeline pipeline = producer.Out.Pipeline;
        return pipeline.CreateConnection<T>(producer.Out, consumer.In);
    }
}
