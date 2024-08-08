// <copyright file="PipelineLifetime.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Pipelines;

public class PipelineLifetime : IPipelineLifetime
{
    private readonly CancellationTokenSource _stoppingSource = new ();
    private readonly CancellationTokenSource _stoppedSource = new ();

    /// <summary>
    /// Triggered when the application host is performing a graceful shutdown.
    /// Request may still be in flight. Shutdown will block until this event completes.
    /// </summary>
    public CancellationToken Stopping => _stoppingSource.Token;

    /// <summary>
    /// Triggered when the application host is performing a graceful shutdown.
    /// All requests should be complete at this point. Shutdown will block
    /// until this event completes.
    /// </summary>
    public CancellationToken Stopped => _stoppedSource.Token;


    public void Stop()
    {
        lock (_stoppingSource)
        {
            try
            {
                _stoppingSource.Cancel();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }

    public void NotifyStopped()
    {
        try
        {
            _stoppedSource.Cancel();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
        }
    }
}
