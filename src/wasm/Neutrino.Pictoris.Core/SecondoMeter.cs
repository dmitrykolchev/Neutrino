// <copyright file="Secundomer.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics;

namespace Neutrino.Pictoris;

public class SecondoMeter : IDisposable
{
    private readonly Stopwatch _stopwatch;
    private readonly string _name;

    public SecondoMeter(string name)
    {
        _name = name;
        _stopwatch = Stopwatch.StartNew();
    }

    public void Dispose()
    {
        _stopwatch.Stop();
        Console.WriteLine($"{_name}: Elapsed time: {_stopwatch.ElapsedMilliseconds} ms");
    }
}
