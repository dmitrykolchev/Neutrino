// <copyright file="EventMessage.cs" company="E5">
// Copyright (c) 2022-23 E5. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using MessagePack;

namespace WebApp.Hubs;

/// <summary>
/// const message = { Id: 1, Name: "Dmitry Kolchev", Active: true, CreatedDate: new Date() }
/// </summary>
[MessagePackObject]
public class EventMessage
{
    [Key(nameof(Id))]
    public int Id { get; set; }
    [Key(nameof(Name))]
    public string? Name { get; set; }
    [Key(nameof(Active))]
    public bool Active { get; set; }
    [Key(nameof(CreatedDate))]
    public DateTime CreatedDate { get; set; }
}
