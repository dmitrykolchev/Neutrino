using LitSample.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace LitSample.Controllers;
public class TricksController : Controller
{
    private readonly ILogger _logger;

    public TricksController(ILogger<TricksController> logger)
    {
        _logger = logger;
    }

    public IActionResult SpinningBorder()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
