// <copyright file="Benchmarks.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using BenchmarkDotNet.Attributes;
using DataStream;
using MessagePack;

namespace DataStreamBenchmarks;

[MemoryDiagnoser]
public class Benchmarks
{
    private Employee[] _employee = null!;
    private MemoryStream _stream0 = null!;
    private MemoryStream _stream1 = null!;


    [GlobalSetup]
    public void GlobalSetup()
    {
        _employee = new Employee[100];
        for (int i = 0; i < 100; i++)
        {
            _employee[i] = new()
            {
                Gid = Guid.NewGuid(),
                Id = 1,
                State = EmployeeState.Active,
                OficeWorker = true,
                Salary = 23423.33,
                Name = "Dmitry Kolchev",
                DateOfBirth = new DateTime(1968, 6, 4),
                FireDate = null,
                Organization = new() { Id = 2, Name = "ООО \"Василёк\"" },
                SalaryDecimal = 7473737,
                CreatedDate = DateTime.UtcNow,
                Avatar = [
                     0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
                    10, 11, 12, 13, 14, 15, 16, 17, 18, 19
                ]
            };
        }

        _stream0 = new();
        DataStreamSerializer.Serialize(_stream0, _employee[0]);
        _stream1 = new();
        MessagePackSerializer.Serialize(_stream1, _employee[0]);
    }

    [Benchmark]
    public void DataStreamSerializeBenchmark()
    {
        _stream0.Position = 0;
        DataStreamSerializer.Serialize(_stream0, _employee[0]);
    }

    [Benchmark]
    public void MessagePackSerializeBenchmark()
    {
        _stream1.Position = 0;
        MessagePackSerializer.Serialize(_stream1, _employee[0]);
    }

    [Benchmark]
    public Employee DataStreamDeserializeBenchmark()
    {
        _stream0.Position = 0;
        return DataStreamSerializer.Deserialize<Employee>(_stream0);
    }

    [Benchmark]
    public Employee MessagePackDeserializeBenchmark()
    {
        _stream1.Position = 0;
        return MessagePackSerializer.Deserialize<Employee>(_stream1);
    }
}
