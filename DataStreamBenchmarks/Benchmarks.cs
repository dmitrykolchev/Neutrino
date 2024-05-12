// <copyright file="Benchmarks.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Text;
using BenchmarkDotNet.Attributes;
using DataStream;
using MessagePack;

namespace DataStreamBenchmarks;

[MemoryDiagnoser]
public class Benchmarks
{
    private Employee _employee = null!;

    [GlobalSetup]
    public void GlobalSetup()
    {
        _employee = new()
        {
            Id = 1,
            State = EmployeeState.Active,
            Name = "Dmitry Kolchev"
            //DateOfBirth = new DateOnly(1968, 6, 4),
            //CreatedDate = DateTime.UtcNow
        };
    }

    [Benchmark]
    public void CustomSerializerBenchmark()
    {
        using MemoryStream stream = new();
        DataStreamWriter writer = new (stream);
        DataStreamWriterContext context = new ()
        {
            Options = DataStreamSerializer<Employee>.DefaultOptions
        };
        writer.WritePropertyName(context, nameof(Employee.Id));
        writer.Write(_employee.Id);
        writer.WritePropertyName(context, nameof(Employee.State));
        writer.Write((short)_employee.State);
        writer.WritePropertyName(context, nameof(Employee.Name));
        writer.Write(_employee.Name);
    }

    [Benchmark]
    public void DataStreamBenchmark()
    {
        using MemoryStream stream = new();
        DataStreamSerializer<Employee> employeeSerializer = new();
        employeeSerializer.Serialize(stream, _employee);
    }

    [Benchmark]
    public void MessagePackBenchmark()
    {
        using MemoryStream stream = new();
        MessagePackSerializer.Serialize<Employee>(stream, _employee);
    }
}
