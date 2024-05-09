using Microsoft.AspNetCore.SignalR;

namespace MyFramework.Hubs;

public class EventHandlerHub : Hub
{
    public Task RaiseEvent(string message)
    {
        return Task.CompletedTask;
    }

    public async Task RaiseEventWithResponse(string message)
    {
        await Clients.All.SendAsync("RaiseEventCompleted", message);
    }
}
