using System.Globalization;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;
namespace LitSample;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.Hosting.Lifetime", Serilog.Events.LogEventLevel.Information)
            .ReadFrom.Configuration(builder.Configuration)
            .Enrich.FromLogContext()
            .Enrich.WithClientIp() 
            .WriteTo.Console(formatProvider: CultureInfo.CurrentCulture)
            .CreateLogger();

        // Use Serilog as the logging provider
        builder.Host.UseSerilog();

#if !DEBUG
        builder.Host.UseWindowsService();
#endif

        // Add services to the container.
        builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();
        builder.Services.AddHttpContextAccessor();

        var app = builder.Build();

        // Настройка чтения заголовков X-Forwarded-For и X-Forwarded-Proto
        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
            KnownIPNetworks = { },
            KnownProxies = { }
        });
        // Configure HTTP Request logging via Serilog
        app.UseSerilogRequestLogging();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Home/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        //app.UseHttpsRedirection();
        app.UseStaticFiles();
        //app.UseDirectoryBrowser();

        app.UseRouting();

        app.UseAuthorization();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");

        app.Run();
    }
}
