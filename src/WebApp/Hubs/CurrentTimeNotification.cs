// <copyright file="CurrentTimeNotification.cs" company="E5">
// Copyright (c) 2022-23 E5. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using MessagePack;

namespace WebApp.Hubs;

[MessagePackObject]
public class CurrentTimeNotification
{
    [Key(nameof(CurrentTime))]
    public DateTime CurrentTime { get; set; }
}
