// <copyright file="Employee.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using MessagePack;
using DataStream;

namespace DataAccess.Sample;

public enum EmployeeState : short
{
    Unknown,
    Active,
    Inactive
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
    [Property(Internable = false)]
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
