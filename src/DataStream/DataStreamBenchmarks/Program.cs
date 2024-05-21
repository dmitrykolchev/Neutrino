// <copyright file="Program.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Data.SqlTypes;
using System.Diagnostics;
using BenchmarkDotNet.Running;
using MessagePack;

namespace DataStreamBenchmarks;

public enum EmployeeState : short
{
    Unknown,
    Active,
    Inactive
}

[MessagePackObject]
public class Organization
{
    [Key(nameof(Id))]
    public int Id { get; set; }

    [Key(nameof(Name))]
    public string? Name { get; set; }
}


[MessagePackObject]
public class Employee
{
    [Key(nameof(Gid))]
    public Guid Gid { get; set; }

    [Key(nameof(Id))]
    public int Id { get; set; }

    [Key(nameof(State))]
    public EmployeeState State { get; set; }

    [Key(nameof(State1))]
    public Nullable<EmployeeState> State1 { get; set; }

    [Key(nameof(OficeWorker))]
    public bool OficeWorker { get; set; }

    [Key(nameof(Salary))]
    public double Salary { get; set; }

    [Key(nameof(SalaryDecimal))]
    public decimal SalaryDecimal { get; set; }

    [Key(nameof(Name))]
    public string? Name { get; set; }

    [Key(nameof(DateOfBirth))]
    public DateTime? DateOfBirth { get; set; }

    [Key(nameof(FireDate))]
    public DateTime? FireDate { get; set; }
    [Key(nameof(Avatar))]
    public byte[]? Avatar { get; set; }

    [Key(nameof(Organization))]
    public Organization? Organization { get; set; }

    [Key(nameof(ParentOrganization))]
    public Organization? ParentOrganization { get; set; }

    [Key(nameof(CreatedDate))]
    public DateTime CreatedDate { get; set; }
}


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
