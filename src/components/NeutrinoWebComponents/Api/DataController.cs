using Microsoft.AspNetCore.Mvc;

namespace LitSample.Api;

[Route("api/[controller]")]
[ApiController]
public class DataController : ControllerBase
{
    private static readonly string[] departments = ["Engineering", "Marketing", "Sales", "HR", "Support"];
    [HttpGet]
    public IActionResult Get([FromQuery] int? page, [FromQuery] int? pageSize, [FromQuery] bool? all)
    {
        int start = 0;
        int end = 100000;

        if (all == true)
        {

        }
        else if(page.HasValue && pageSize.HasValue)
        {
            start = (page.Value - 1) * pageSize.Value;
            end = start + pageSize.Value;
        }
        List<object> list = new();
        for (var index = start; index < end; ++index)
        {
            list.Add(new
            {
                Id = index + 1,
                Name = $"User {index + 1}",
                Email = $"user{index + 1}@example.com",
                Role = index % 3 == 0 ? "Admin" : index % 3 == 1 ? "Editor" : "Viewer",
                Status = index % 2 == 0 ? "Active" : "Inactive",
                Department = departments[index % 5],
                LastLogin = (DateTime.Now - TimeSpan.FromTicks(Random.Shared.Next(1_000_000_000))).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                Value = Math.Floor(Random.Shared.NextDouble() * 10000),
            });
        }
        return Ok(new
        {
            Data = list,
            Total = 100000,
            Page = page.HasValue ? page.Value : 1,
            PageSize = pageSize.HasValue ? pageSize.Value : int.MaxValue
        });
    }
}
