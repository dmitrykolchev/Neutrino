// <copyright file="ArchitectureController.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics;
using System.Dynamic;
using LitSample.Models;
using Microsoft.AspNetCore.Mvc;

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

    public IActionResult Components()
    {
        return View();
    }

    public IActionResult Patterns(string path)
    {
        dynamic d = new ExpandoObject();
        d.Path = path;
        return View(d);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
