using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Neutrino.Identity.Server.Models;

namespace Neutrino.Identity.Server.Pages;

public class SigninModel : PageModel
{
    public void OnGet()
    {
    }

    [BindProperty]
    public SignInRequest? SignInRequest { get; set; }

    public async Task<IActionResult> OnPostAsync()
    {
        if(!ModelState.IsValid)
        {
            return Page();
        }
        
        await Task.CompletedTask;

        return Redirect("https://localhost:7155/Hello");
    }
}
