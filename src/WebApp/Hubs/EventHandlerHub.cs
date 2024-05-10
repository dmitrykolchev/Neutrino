using Microsoft.AspNetCore.SignalR;

namespace WebApp.Hubs;

public class EventHandlerHub : Hub
{
    public Task RaiseEvent(EventMessage message)
    {
        return Task.CompletedTask;
    }

    public async Task<EventMessage> RaiseEventWithResponse(EventMessage message)
    {
        await Clients.All.SendAsync("RaiseEventCompleted", message);
        return message;
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
