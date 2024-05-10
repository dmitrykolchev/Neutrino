// <copyright file="NotificationWorker.cs" company="E5">
// Copyright (c) 2022-23 E5. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>


using Microsoft.AspNetCore.SignalR;
using WebApp.Hubs;

namespace WebApp.Services;

public class NotificationWorker : BackgroundService
{
    public NotificationWorker(
        IHubContext<EventHandlerHub> hubContext,
        ILogger<NotificationWorker> logger)
    {
        HubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        Logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    private IHubContext<EventHandlerHub> HubContext { get; }

    private ILogger Logger { get; }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            await Task.Delay(1000, cancellationToken);

            try
            {
                IClientProxy clientProxy = HubContext.Clients.All;

                await clientProxy.SendCoreAsync("NotifyCurrentTime", new object[] {
                    new CurrentTimeNotification() {
                        CurrentTime = DateTime.Now
                    }
                }, cancellationToken);
                Logger.NotificationSent();
            }
            catch (Exception ex)
            {
                Logger.NotificationFailed(ex.Message);
            }
        }
    }
}


internal static partial class NotificationWorkerLoggerExtensions
{
    [LoggerMessage(1, LogLevel.Information, "Notification has been sent successfully", EventName = nameof(NotificationSent))]
    public static partial void NotificationSent(this ILogger logger);

    [LoggerMessage(2, LogLevel.Warning, "Notification failed: {Message}", EventName = nameof(NotificationFailed))]
    public static partial void NotificationFailed(this ILogger logger, string message);
}
