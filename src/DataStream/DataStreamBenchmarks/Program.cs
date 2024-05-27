// <copyright file="Program.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using BenchmarkDotNet.Running;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace DataStreamBenchmarks;


public struct Point
{
    public double X;
    public double Y;

    public Point()
    {
        X = -1;
        Y = -1;
    }

    public static bool operator==(Point left, Point right)
    {
        return left.Equals(right);
    }

    public static bool operator !=(Point left, Point right)
    {
        return !left.Equals(right);
    }

    public override bool Equals([NotNullWhen(true)] object? obj)
    {
        if (obj is Point that)
        {
            return X == that.X && Y == that.Y;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(X, Y);
    }
}

internal class Program
{
    private static void Main(string[] args)
    {
        Point p = default;
        Point p1 = new();
        if(p == p1)
        {
            Console.WriteLine("Equals");
        }
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
