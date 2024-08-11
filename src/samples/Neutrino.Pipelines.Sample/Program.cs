// <copyright file="Program.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Immutable;
using Neutrino.Pipelines.Generators;

namespace Neutrino.Pipelines.Sample;

internal class Program
{
    private static readonly PipelineLifetime lifetime = new PipelineLifetime();

    private static async Task Main(string[] args)
    {
        Console.CancelKeyPress += Console_CancelKeyPress;

        ImmutableArray<object> test = [];
        object obj1 = new();
        object obj2 = new();
        test = test.Add(obj1);
        test = test.Add(obj2);
        test = test.Add(obj1);

        using Pipeline pipeline = Pipeline.Create(lifetime);

        CancellationTokenSource source = new();

        Int32Sequence sequence = new(pipeline, 0, 100);

        Int32Sequence sequence2 = new(pipeline, 200, 300);

        MovingAverage movingAverage = new(pipeline, 10);
        
        TimeSequence timer = new(pipeline, 
            DateTimeOffset.UtcNow.AddSeconds(10), 
            DateTimeOffset.MaxValue, 
            TimeSpan.FromMilliseconds(30));

        Transformer transformer = new(pipeline);
        
        ConsoleLogger logger = new(pipeline);

        sequence
            .Join(sequence2)
            .PipeTo(transformer)
            .PipeTo(movingAverage)
            .Zip(timer)
            .PipeTo(logger);

        pipeline.Run();

        Console.WriteLine("Press enter to exit");
        Console.ReadLine();

        await pipeline.StopAsync();
    }

    private static void Console_CancelKeyPress(object? sender, ConsoleCancelEventArgs e)
    {
        Console.WriteLine("Ctrl-C pressed...");
        lifetime.Stop();
        e.Cancel = true;
    }

    public class Transformer : ConsumerProducer<int, int>
    {
        public Transformer(Pipeline pipeline) : base(pipeline, nameof(Transformer))
        {
            State = PipelineComponentState.Active;
        }

        protected override Task<int> OnReceiveAsync(Message<int> message, CancellationToken cancellationToken) 
            => Task.FromResult(message.Data * 2);
    }

    public class MovingAverage: ConsumerProducer<int, double>
    {
        private int[] _window;
        private int _count;

        public MovingAverage(Pipeline pipeline, int count): base(pipeline, nameof(MovingAverage))
        {
            _window = new int[count];
            _count = 0;
        }

        protected override Task<double> OnReceiveAsync(Message<int> data, CancellationToken cancellationToken)
        {
            _window[_count % _window.Length] = data.Data;
            _count++;
            double result;
            if (_count < _window.Length)
            {
                result = _window.Take(_count).Average();
            }
            else
            {
                result = _window.Average();
            }
            return Task.FromResult(result);
        }
    }

    public class ConsoleLogger : IConsumer<(double, DateTimeOffset)>
    {
        private int _count;

        public ConsoleLogger(Pipeline pipeline)
        {
            In = pipeline.CreateReceiver<(double, DateTimeOffset)>(this, OnReceiveAsync);
        }
        public Receiver<(double, DateTimeOffset)> In { get; }

        public PipelineComponentState State { get; private set; } = PipelineComponentState.Active;

        private Task OnReceiveAsync(Message<(double, DateTimeOffset)> message, CancellationToken cancellationToken)
        {
            Console.WriteLine($"{++_count,4}: message received at {message.Data.Item2:hh:mm:ss.ffff} ({DateTimeOffset.UtcNow:hh:mm:ss.ffff}) is {message.Data.Item1,4} from {message.Sender}");
            return Task.CompletedTask;
        }
    }
}

