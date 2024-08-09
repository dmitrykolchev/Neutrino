// <copyright file="Int32Sequence.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines.Generators;

public class Int32Sequence : IProducer<int>
{
    private readonly Pipeline _pipeline;
    private Emitter<int> _out = null!;
    private readonly int _minValue;
    private readonly int _maxValue;
    private readonly int _step;
    private int _value;

    public Int32Sequence(Pipeline pipeline, int minValue = 0, int maxValue = int.MaxValue, int step = 1)
    {
        _pipeline = pipeline ?? throw new ArgumentNullException(nameof(pipeline));
        _minValue = minValue;
        _maxValue = maxValue;
        _step = step;
        _value = _minValue;
    }

    public Pipeline Pipeline => _pipeline;

    public Emitter<int> Out => _out ??= _pipeline.CreateEmitter<int>(this, GenerateAsync);

    private async Task<PipelineComponentState> GenerateAsync(CancellationToken cancellationToken)
    {
        int result = _value;
        if (result < _maxValue)
        {
            _value += _step;
            await Out.PostAsync(new Message<int>(result, this), cancellationToken);
            return PipelineComponentState.Active;
        }
        return PipelineComponentState.Completed;
    }
}

