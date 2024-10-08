using LitSample.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace LitSample.Controllers;
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }
    public IActionResult Sidebar()
    {
        return View();
    }

    public IActionResult Index()
    {
        return View();
    }
    public IActionResult Colors()
    {
        return View();
    }

    public IActionResult MaterialIcons()
    {
        return View();
    }
    public IActionResult FluentIcons()
    {
        return View();
    }
    public IActionResult FabricIcons()
    {
        return View();
    }

    public IActionResult GridLayout()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
