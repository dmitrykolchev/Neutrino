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
        Transformer transformer = new(pipeline);
        ConsoleLogger logger = new(pipeline);

        sequence.PipeTo(transformer);
        sequence.PipeTo(logger);
        transformer.PipeTo(logger);

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
        }

        protected override async Task<PipelineComponentState> OnReceiveAsync(CancellationToken cancellationToken)
        {
            Message<int> message = await In.GetMessageAsync(cancellationToken);
            int result = message.Data * 2;
            await Out.PostAsync(new Message<int>(result, this), cancellationToken);
            return PipelineComponentState.Active;
        }
    }

    public class ConsoleLogger : IConsumer<int>
    {
        private int _count;

        public ConsoleLogger(Pipeline pipeline)
        {
            In = pipeline.CreateReceiver<int>(this, OnReceiveAsync);
        }

        private async Task<PipelineComponentState> OnReceiveAsync(CancellationToken cancellationToken)
        {
            Message<int> message = await In.GetMessageAsync(cancellationToken);
            Console.WriteLine($"{++_count,4}: message received at {DateTime.Now} is {message.Data} from {message.Sender}");
            return PipelineComponentState.Active;
        }

        public Receiver<int> In { get; }
    }
}

