using WebApp.Hubs;
using Serilog;
using WebApp.Services;
using WebApp.Areas;

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
        builder.Services.AddControllersWithViews()
            .AddRazorOptions(options =>
            {
                // {0} - View Name
                // {1} - Action
                // {2} - Feature Name
                // {3} - Area Name
                // Replace normal view location entirely
                options.AreaViewLocationFormats.Clear();
                options.AreaViewLocationFormats.Add("/Areas/{3}/{2}/{0}.cshtml");
                options.AreaViewLocationFormats.Add("/Areas/{3}/{2}/{1}/{0}.cshtml");
                options.AreaViewLocationFormats.Add("/Areas/{3}/{2}/{0}/{0}.cshtml");
                options.AreaViewLocationFormats.Add("/Areas/{3}/Shared/{0}.cshtml");
                options.AreaViewLocationFormats.Add("/Areas/Shared/{0}.cshtml");
                options.ViewLocationExpanders.Add(new ViewLocationExpander());
            });
        ;
        builder.Services.AddSignalR().AddMessagePackProtocol();
        builder.Services.AddHostedService<NotificationWorker>();
        //builder.Services.AddOpenApi(options =>
        //{
        //    options.ShouldInclude = (desc) =>
        //    {
        //        return true;
        //    };
        //});

        WebApplication app = builder.Build();

        //app.MapOpenApi();

        app.MapScalarApiReference(options =>
        {
            options.DarkMode = true;
            options.Title = "Neutrino API Explorer";
            options.EndpointPathPrefix = "/scalar";
        });


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

        app.MapAreaControllerRoute(
            name: "Core",
            areaName: "Core",
            pattern: "Core/{controller=Home}/{action=Index}/{id?}");

        app.MapControllerRoute(
            name: "default",
            pattern: "{area=Core}/{controller=Home}/{action=Index}/{id?}");

        app.MapHub<EventHandlerHub>("/EventHandlerHub");
        app.Run();
    }
}
