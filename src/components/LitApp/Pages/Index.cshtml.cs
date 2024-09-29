// <copyright file="Index.cshtml.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace LitApp.Pages;

[ValidateAntiForgeryToken]
public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {

    }

    public record Data(string checkbox1);

    [BindProperty]
    public Data? SubmitData { get; set; }

    public Task<IActionResult> OnPost()
    {
        _logger.LogWarning($"Checkbox [checkbox1] = {SubmitData?.checkbox1}");
        return Task.FromResult((IActionResult)Page());
    }
}
