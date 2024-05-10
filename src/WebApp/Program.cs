using WebApp.Hubs;
using Serilog;
using WebApp.Services;

namespace WebApp;

public class Program
{
    public static void Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Console()
            .CreateLogger();

        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.Services.AddLogging((configure) =>
        {
            configure.ClearProviders();
        });

        builder.Services.AddSerilog((services, configuration) => configuration
            .ReadFrom.Configuration(builder.Configuration)
            .ReadFrom.Services(services));

        // Add services to the container.
        builder.Services.AddControllersWithViews();
        builder.Services.AddSignalR().AddMessagePackProtocol();
        builder.Services.AddHostedService<NotificationWorker>();


        WebApplication app = builder.Build();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Home/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseSerilogRequestLogging();

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
        app.MapHub<EventHandlerHub>("/EventHandlerHub");
        app.Run();
    }
}
