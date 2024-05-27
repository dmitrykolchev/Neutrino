// <copyright file="Program.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics;
using BenchmarkDotNet.Running;

namespace DataStreamBenchmarks;


internal class Program
{
    private static void Main(string[] args)
    {
#if RELEASE
        BenchmarkRunner.Run<Benchmarks>();
#else
        //OptimizationTests();
        TestSerializer();
#endif
    }

    private static void TestSerializer()
    {
        Console.WriteLine($"LittleEndian = {BitConverter.IsLittleEndian}");
        Benchmarks b = new();
        b.GlobalSetup();
        b.DataStreamSerializeArrayBenchmark();
        var result = b.DataStreamDeserializeArrayBenchmark();

        b.MessagePackSerializeArrayBenchmark();
        b.MessagePackDeserializeArrayBenchmark();

        //b.MessagePackSerializeArrayBenchmark();

        //b.DataStreamDeserializeBenchmark();

        //for (int index = 0; index < 1_000_000; ++index)
        //{
        //    b.DataStreamSerializeBenchmark();
        //}
        //for (int index = 0; index < 1_000_000; ++index)
        //{
        //    b.DataStreamDeserializeBenchmark();
        //}

        //Stopwatch sw = Stopwatch.StartNew();
        //for (int index = 0; index < 10_000_000; ++index)
        //{
        //    b.DataStreamSerializeBenchmark();
        //}
        //sw.Stop();
        //Console.WriteLine($"{sw.ElapsedMilliseconds * 1000000.0 / 10_000_000} ns");

        Stopwatch sw = Stopwatch.StartNew();
        for (int index = 0; index < 10_000_000; ++index)
        {
            b.DataStreamDeserializeBenchmark();
        }
        sw.Stop();
        Console.WriteLine($"{sw.ElapsedMilliseconds} ns");
    }
}
