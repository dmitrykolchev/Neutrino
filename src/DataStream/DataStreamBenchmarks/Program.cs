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
        DataStreamSerializer.CreateSerializer<Employee>();
        TestSerializer();
#endif
    }

    private static short OptimizationTests()
    {
        Optimizations o = new ();
        short v = o.ReadInt16();
        return v;
    }

    private static Employee TestSerializer()
    {
        Console.WriteLine($"LittleEndian = {BitConverter.IsLittleEndian}");
        Employee employee = new()
        {
            Gid = Guid.NewGuid(),
            Id = 1,
            State = EmployeeState.Active,
            Name = "Dmitry Kolchev",
            DateOfBirth = new DateTime(1968, 6, 4),
            FireDate = null,
            Avatar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                      10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
            Organization = new() { Id = 2, Name = "ООО \"Василёк\"" },
            Salary = 12322.23,
            SalaryDecimal = 7473737,
            CreatedDate = DateTime.UtcNow
        };

        employee = new()
        {
            Gid = Guid.NewGuid(),
            Id = 1,
            State = EmployeeState.Active,
            OficeWorker = true,
            Salary = 23423.33,
            Name = "Dmitry Kolchev",
            DateOfBirth = new DateTime(1968, 6, 4),
            FireDate = null,
            Avatar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                      10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
            Organization = new() { Id = 2, Name = "ООО \"Василёк\"" },
            SalaryDecimal = 7473737,
            CreatedDate = DateTime.UtcNow
        };

        Employee result = null!;
        using (MemoryStream stream = new())
        {
            DataStreamSerializer<Employee> employeeSerializer = DataStreamSerializer.CreateSerializer<Employee>();
            employeeSerializer.Serialize(stream, employee);
            stream.Position = 0;
            result = employeeSerializer.Deserialize(stream);
        }
        return result;

        //using (MemoryStream stream = new())
        //{
        //    MessagePackSerializer.Serialize<Employee>(stream, employee);
        //}
    }
}
