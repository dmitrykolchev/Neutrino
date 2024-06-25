// <copyright file="ValuesController1.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApp.Areas.Core.Api;
[Route("api/[controller]")]
[ApiController]
[EndpointGroupName("GroupNameOnController")]
public class ValuesController1 : ControllerBase
{
    // GET: api/<ValuesController1>
    [HttpGet]
    [EndpointGroupName("GroupNameOnAction")]
    public IEnumerable<string> Get()
    {
        return ["value1", "value2"];
    }

    // GET api/<ValuesController1>/5
    [EndpointDescription("Endpoint description")]
    [EndpointSummary("Endpoint summary")]
    [HttpGet("{id}")]
    public string Get(int id)
    {
        return "value";
    }

    // POST api/<ValuesController1>
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/<ValuesController1>/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/<ValuesController1>/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
}
