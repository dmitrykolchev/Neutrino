using Microsoft.AspNetCore.Mvc.Razor;

namespace Neutrino.Areas.Core.Home;

public record IndexData(int Id, string Name);

public abstract class IndexView : RazorPage<IndexData>
{
    protected IndexView()
    {
    }

    public IndexData DefaultData { get; } = new IndexData(0, "John Doe");
}


