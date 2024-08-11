// <copyright file="Int32Sequence.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines.Generators;

public class RandomSequence : IProducer<int>, IStatefull
{
    private readonly Random _random;
    private int _count;

    public RandomSequence(Pipeline pipeline, int count, int seed = 0)
    {
        Pipeline = pipeline ?? throw new ArgumentNullException(nameof(pipeline));
        _random = seed == 0 ? new Random() : new Random(seed); 
        _count = count; 
        Out = pipeline.CreateEmitter<int>(this, GenerateAsync);
    }

    public Pipeline Pipeline { get; }

    public Emitter<int> Out { get; }

    public PipelineComponentState State => _count > 0
        ? PipelineComponentState.Active 
        : PipelineComponentState.Completed;

    private Task<int> GenerateAsync(CancellationToken cancellationToken)
    {
        int result = _random.Next();
        if (_count > 0)
        {
            _count--;
        }
        return Task.FromResult(result);
    }
}

