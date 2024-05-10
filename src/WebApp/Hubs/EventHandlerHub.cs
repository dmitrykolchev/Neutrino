using Microsoft.AspNetCore.SignalR;

namespace WebApp.Hubs;

public class EventHandlerHub : Hub
{
    public Task RaiseEvent(EventMessage message)
    {
        return Task.CompletedTask;
    }

    public Task<EventMessage> RaiseEventWithResponse(EventMessage message)
    {
        return Task.FromResult(message);
    }

    public override Task OnConnectedAsync()
    {
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }
}
