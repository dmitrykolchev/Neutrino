using LitSample.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace LitSample.Controllers;
public class ArchitectureController : Controller
{
    private readonly ILogger _logger;

    public ArchitectureController(ILogger<ArchitectureController> logger)
    {
        _logger = logger;
    }

    public IActionResult Solid()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
