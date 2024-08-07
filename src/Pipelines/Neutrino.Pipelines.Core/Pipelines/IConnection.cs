// <copyright file="IConnector.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public interface IConnection<TData>
{
    Emitter<TData> From { get; }

    Receiver<TData> To { get; }
}
