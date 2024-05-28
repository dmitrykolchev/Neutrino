// <copyright file="Class1.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Net.Http.Headers;
using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using Xobex.Net;

namespace Xobex.AspNetCore.Mvc;

public abstract class ApiControllerBase
{
    public static readonly MediaTypeHeaderValue ApplicationJson = MediaTypeHeaderValue.Parse(Mime.Json);
    public static readonly MediaTypeHeaderValue ApplicationDataStream = MediaTypeHeaderValue.Parse(Mime.DataStream);
    public static readonly MediaTypeHeaderValue ApplicationMessagePack = MediaTypeHeaderValue.Parse(Mime.MessagePack);


    //protected async Task<IActionResult> List<TItem, TOptions>(
    //    TOptions options,
    //    Func<TOptions, Task<IList<TItem>>> getListAsync,
    //    Func<TOptions, Task<int>> getCountAsync)
    //    where TOptions : LoadOptions
    //{
    //    ArgumentNullException.ThrowIfNull(options);
    //    ArgumentNullException.ThrowIfNull(getListAsync);
    //    ArgumentNullException.ThrowIfNull(getCountAsync);
    //    try
    //    {
    //        IList<TItem> items = await getListAsync(options);

    //        int totalCount = (options.NoCount || items.Count < options.Take.GetValueOrDefault(int.MaxValue))
    //                       ? items.Count
    //                       : await getCountAsync(options);

    //        return Json(new { totalCount, items });
    //    }
    //    catch (Exception ex)
    //    {
    //        return ErrorResult(ex);
    //    }
    //}
}
