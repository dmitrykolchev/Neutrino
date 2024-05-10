// <copyright file="EventMessage.cs" company="E5">
// Copyright (c) 2022-23 E5. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace WebApp.Hubs;

/// <summary>
/// const message = { Id: 1, Name: "Dmitry Kolchev", Active: true, CreatedDate: new Date() }
/// </summary>
public class EventMessage
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public bool Active { get; set; }

    public DateTime CreatedDate { get; set; }
}
