// <copyright file="Program.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using BenchmarkDotNet.Running;
using DataStream;
using MessagePack;

namespace DataStreamBenchmarks;

public enum EmployeeState : short
{
    Unknown,
    Active,
    Inactive
}

[MessagePackObject]
public class Employee
{
    [Key(nameof(Id))]
    public int Id { get; set; }

    [Key(nameof(State))]
    public EmployeeState State { get; set; }

    [Key(nameof(OficeWorker))]
    public bool OficeWorker { get; set; }

    [Key(nameof(Salary))]
    public double Salary { get; set; }

    [Key(nameof(Name))]
    public string? Name { get; set; }

    [Key(nameof(DateOfBirth))]
    public DateTime? DateOfBirth { get; set; }

    [Key(nameof(FireDate))]
    public DateTime? FireDate { get; set; }
    [Key(nameof(Avatar))]
    public byte[]? Avatar { get; set; }

    //public DateTime CreatedDate { get; set; }
}


internal class Program
{
    private static void Main(string[] args)
    {
        BenchmarkRunner.Run<Benchmarks>();

        //Employee employee = new()
        //{
        //    Id = 1,
        //    State = EmployeeState.Active,
        //    Name = "Dmitry Kolchev",
        //    DateOfBirth = new DateTime(1968, 6, 4),
        //    FireDate = null,
        //    Avatar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        //              10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
        //    //CreatedDate = DateTime.UtcNow
        //};

        //using (MemoryStream stream = new())
        //{
        //    DataStreamSerializer<Employee> employeeSerializer = new();
        //    employeeSerializer.Serialize(stream, employee);

        //    MessagePackSerializer.Serialize<Employee>(stream, employee);

        //    //    DataStreamSerializer<Employee> employeeSerializer1 = new();
        //    //    employeeSerializer.Serialize(stream, employee);
        //}

        //var writerParameter = Expression.Parameter(typeof(DataStreamWriter<Employee>), "writer");
        //var itemParameter = Expression.Parameter(typeof(Employee), "item");

        //Expression<Action<DataStreamWriter<Employee>, Employee>> expression = Expression.Lambda<Action<DataStreamWriter<Employee>, Employee>>(body, writerParameter, itemParameter);

        //Action<DataStreamWriter<Employee>, Employee> write = expression.Compile();
        //write(writer, employee);
    }
}
