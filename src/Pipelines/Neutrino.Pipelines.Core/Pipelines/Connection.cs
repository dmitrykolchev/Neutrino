// <copyright file="Connection.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>


namespace Neutrino.Pipelines;

public class Connection<TData> : IConnection<TData>
{
    private readonly Emitter<TData> _from;
    private readonly Receiver<TData> _to;

    public Connection(Pipeline pipeline, Emitter<TData> from, Receiver<TData> to)
    {
        _from = from ?? throw new ArgumentNullException(nameof(from));
        _to = to ?? throw new ArgumentNullException(nameof(to));
    }

    public Emitter<TData> From => _from;

    public Receiver<TData> To => _to;
}
