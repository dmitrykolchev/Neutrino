// <copyright file="TimeSequence.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines.Generators;
public class TimeSequence : IProducer<DateTimeOffset>, IStatefull
{
    private readonly DateTimeOffset _start;
    private readonly DateTimeOffset _end;
    private readonly TimeSpan _interval;
    private DateTimeOffset _nextEvent;

    public TimeSequence(Pipeline pipeline, DateTimeOffset start, DateTimeOffset end, TimeSpan interval)
    {
        Pipeline = pipeline ?? throw new ArgumentNullException(nameof(pipeline));
        Out = pipeline.CreateEmitter<DateTimeOffset>(this, GenerateAsync);
        _start = start.ToUniversalTime();
        _end = end.ToUniversalTime();
        _interval = interval;
        DateTimeOffset current = DateTimeOffset.UtcNow + _interval;
        _nextEvent = current <= _start ? _start : current;
    }

    public Pipeline Pipeline { get; }

    public Emitter<DateTimeOffset> Out { get; }

    public PipelineComponentState State => _nextEvent < _end
        ? PipelineComponentState.Active
        : PipelineComponentState.Completed;

    private async Task<DateTimeOffset> GenerateAsync(CancellationToken cancellationToken)
    {
        TimeSpan delayTimeout = _interval - TimeSpan.FromMilliseconds(1);
        DateTimeOffset result = _nextEvent;
        while(State == PipelineComponentState.Active)
        {
            if(delayTimeout.TotalMilliseconds > 1)
            {
                await Task.Delay(delayTimeout);
            }
            SpinWait.SpinUntil(() => DateTimeOffset.UtcNow > _nextEvent, TimeSpan.FromMilliseconds(-1));
            DateTimeOffset now = DateTimeOffset.UtcNow;
            if (now > _nextEvent)
            {
                _nextEvent += _interval;
                return now;
            }
        }
        return DateTimeOffset.MinValue;
    }
}
