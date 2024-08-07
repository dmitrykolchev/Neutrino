// <copyright file="Program.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.Immutable;
using Neutrino.Pipelines.Generators;

namespace Neutrino.Pipelines.Sample;

internal class Program
{
    private static async Task Main(string[] args)
    {
        ImmutableArray<object> test = [];
        object obj1 = new();
        object obj2 = new();
        test = test.Add(obj1);
        test = test.Add(obj2);
        test = test.Add(obj1);

        CancellationTokenSource source = new();
        using Pipeline pipeline = Pipeline.Create();
        Int32Sequence sequence = new(pipeline, 0, 100);
        Transformer transformer = new(pipeline);
        ConsoleLogger logger = new(pipeline);
        IConnection<int> sequenceToTransformerConnection = pipeline.CreateConnection(sequence.Out, transformer.In);
        IConnection<int> transformerToLoggerConnection = pipeline.CreateConnection(transformer.Out, logger.In);
        await pipeline.RunAsync(source.Token);

        await Task.Delay(1000);

        source.Cancel();
    }

    public class Transformer : ConsumerProducer<int, int>
    {
        public Transformer(Pipeline pipeline): base(pipeline, nameof(Transformer))
        {
        }

        protected override async Task OnReceive(Message<int> message, CancellationToken cancellationToken)
        {
            if (!message.IsEndOfStream)
            {
                int result = message.Data * 2;
                await Out.PostAsync(new Message<int>(result), cancellationToken);
            }
            else
            {
                await Out.PostAsync(Message<int>.EndOfStream, cancellationToken);
            }
        }
    }

    public class ConsoleLogger : IConsumer<int>
    {
        public ConsoleLogger(Pipeline pipeline)
        {
            In = pipeline.CreateReceiver<int>(this, ReceiveAsync);
        }

        private Task ReceiveAsync(Message<int> value, CancellationToken cancellation)
        {
            if (!value.IsEndOfStream)
            {
                Console.WriteLine($"Message received at {DateTime.Now} is {value.Data}");
            }
            else
            {
                Console.WriteLine("EOS");
            }
            return Task.CompletedTask;
        }

        public Receiver<int> In { get; }
    }
}

