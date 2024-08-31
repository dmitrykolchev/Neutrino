// <copyright file="CublasException.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.InteropServices;
using System.Text;

namespace Neutrino.Cuda.Sample;

public class CublasException : Exception
{
    internal CublasException(CublasStatus status): base(GetStatusString(status))
    {
        Status = status;
    }

    private CublasException(CublasStatus status, string message) : base(message)
    {
        Status = status;
    }

    public CublasStatus Status { get; }

    public static void ThrowOnError(CublasStatus status)
    {
        if (status != CublasStatus.Success)
        {
            throw new CublasException(status, GetStatusString(status));
        }
    }

    public static string GetStatusString(CublasStatus status)
    {
        unsafe
        {
            byte* data = CublasNative.cublasGetStatusString(status);
            ReadOnlySpan<byte> span = MemoryMarshal.CreateReadOnlySpanFromNullTerminated(data);
            return Encoding.ASCII.GetString(span);
        }
    }
}
