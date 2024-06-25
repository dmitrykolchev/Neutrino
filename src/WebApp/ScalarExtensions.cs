// <copyright file="ScalarExtensions.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Text.Json;
using System.Text.Json.Serialization;
using Scalar.AspNetCore;

namespace WebApp;

public static class ScalarExtensions
{
    private static readonly JsonSerializerOptions JsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public static IEndpointConventionBuilder MapScalarApiReference(
        this IEndpointRouteBuilder endpoints,
        Action<ScalarOptions> configureOptions)
    {
        ScalarOptions options = new ();
        configureOptions(options);

        string configurationJson = JsonSerializer.Serialize(options, JsonSerializerOptions);

        return endpoints.MapGet(options.EndpointPathPrefix + "/{documentName=v1}", (string documentName) =>
        {
            string title = options.Title ?? $"Scalar API Reference -- {documentName}";
            return Results.Content(
                $$"""
                          <!doctype html>
                          <html>
                          <head>
                              <title>{{title}}</title>
                              <meta charset="utf-8" />
                              <meta name="viewport" content="width=device-width, initial-scale=1" />
                          </head>
                          <body>
                              <script id="api-reference" data-url="/openapi/{{documentName}}.json"></script>
                              <script>
                              var configuration = {
                                  {{configurationJson}}
                              }
                          
                              document.getElementById('api-reference').dataset.configuration =
                                  JSON.stringify(configuration)
                              </script>
                              <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
                          </body>
                          </html>
                          """, "text/html");
        })
            .ExcludeFromDescription();
    }
}
