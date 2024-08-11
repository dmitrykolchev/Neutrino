// <copyright file="Zip{TIn1, TIn2, TOut}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines.Operators;

public class Zip<TOut1, TOut2> : IProducer<(TOut1, TOut2)>
{
    public Zip(IProducer<TOut1> out1, IProducer<TOut2> out2)
    {
        Pipeline pipeline = out1.Out.Pipeline;
        Consumer1 = new SimpleConsumer<TOut1>(this, pipeline);
        Consumer2 = new SimpleConsumer<TOut2>(this, pipeline);
        out1.PipeTo(Consumer1);
        out2.PipeTo(Consumer2);
        Out = pipeline.CreateEmitter<(TOut1, TOut2)>(this, GenerateInternalAsync);
    }

    private SimpleConsumer<TOut1> Consumer1 { get; }
    
    private SimpleConsumer<TOut2> Consumer2 { get; }

    public Emitter<(TOut1, TOut2)> Out { get; }

    public PipelineComponentState State => PipelineComponentState.Active;

    private async Task<(TOut1, TOut2)> GenerateInternalAsync(CancellationToken cancellationToken)
    {
        Task<Message<TOut1>> message1 = Consumer1.In.DequeueAsync(cancellationToken);
        Task<Message<TOut2>> message2 = Consumer2.In.DequeueAsync(cancellationToken);
        await Task.WhenAll(message1, message2);
        return (message1.Result.Data, message2.Result.Data);
    }
}
