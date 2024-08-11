// <copyright file="Zip{TIn1, TIn2, TOut}.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines.Operators;

public class Join<T> : IProducer<T>
{
    private Task<Message<T>>? _message1;
    private Task<Message<T>>? _message2;

    public Join(IProducer<T> out1, IProducer<T> out2)
    {
        Pipeline pipeline = out1.Out.Pipeline;
        Consumer1 = new SimpleConsumer<T>(this, pipeline);
        Consumer2 = new SimpleConsumer<T>(this, pipeline);
        out1.PipeTo(Consumer1);
        out2.PipeTo(Consumer2);
        Out = pipeline.CreateEmitter<T>(this, GenerateInternalAsync);
    }

    private SimpleConsumer<T> Consumer1 { get; }
    
    private SimpleConsumer<T> Consumer2 { get; }

    public Emitter<T> Out { get; }

    public PipelineComponentState State => PipelineComponentState.Active;

    private async Task<T> GenerateInternalAsync(CancellationToken cancellationToken)
    {
        for (; ; )
        {
            if (_message1?.IsCompleted == true)
            {
                Message<T> result = _message1.Result;
                _message1 = null;
                return result.Data;
            }
            if (_message2?.IsCompleted == true)
            {
                Message<T> result = _message2.Result;
                _message2 = null;
                return result.Data;
            }
            _message1 ??= Consumer1.In.DequeueAsync(cancellationToken);
            _message2 ??= Consumer2.In.DequeueAsync(cancellationToken);
            await Task.WhenAny(_message1, _message2);
        }
        throw new InvalidOperationException();
    }
}
