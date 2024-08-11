// <copyright file="IStatefull.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public enum PipelineComponentState
{
    Active,
    Completed
}


public interface IStatefull
{
    PipelineComponentState State { get; }
}
