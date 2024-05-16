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

    [GlobalSetup]
    public void GlobalSetup()
    {
        _employee = new Employee[100];
        for (int index = 0; index < _employee.Length; ++index)
        {
            _employee[index] = new()
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
                CreatedDate = DateTime.UtcNow
            };
        }
        DataStreamSerializer.CreateSerializer<Employee>();
    }

    [Benchmark]
    public void DataStreamSerializeBenchmark()
    {
        using MemoryStream stream = new();
        DataStreamSerializer<Employee> serializer = DataStreamSerializer.CreateSerializer<Employee>();
        serializer.Serialize(stream, _employee[0]);
    }

    [Benchmark]
    public void MessagePackSerializeBenchmark()
    {
        using MemoryStream stream = new();
        MessagePackSerializer.Serialize<Employee>(stream, _employee[0]);
    }

    [Benchmark]
    public Employee DataStreamDeserializeBenchmark()
    {
        using MemoryStream stream = new();
        DataStreamSerializer<Employee> serializer = DataStreamSerializer.CreateSerializer<Employee>();
        serializer.Serialize(stream, _employee[0]);
        stream.Position = 0;
        return serializer.Deserialize(stream);
    }

    [Benchmark]
    public Employee MessagePackDeserializeBenchmark()
    {
        using MemoryStream stream = new();
        MessagePackSerializer.Serialize<Employee>(stream, _employee[0]);
        stream.Position = 0;
        return MessagePackSerializer.Deserialize<Employee>(stream);
    }
}
