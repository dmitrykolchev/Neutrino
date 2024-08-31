// <copyright file="SigninRequest.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.ComponentModel.DataAnnotations;

namespace Neutrino.Identity.Server.Models;

public class SignInRequest
{
    public SignInRequest()
    {
    }

    [Required]
    public string UserName { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;
}
