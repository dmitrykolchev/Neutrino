// <copyright file="ViewLocationExpander.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using Microsoft.AspNetCore.Mvc.Razor;

namespace WebApp.Areas;

public class ViewLocationExpander : IViewLocationExpander
{
    public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
    {
        foreach (string location in viewLocations)
        {
            yield return string.Format(location, "{0}", "{1}", context.ControllerName, context.AreaName);
        }
    }

    public void PopulateValues(ViewLocationExpanderContext context)
    {
    }
}
