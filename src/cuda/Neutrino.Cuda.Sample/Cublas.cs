// <copyright file="Cublas.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Buffers.Text;
using System.Runtime.InteropServices;

namespace Neutrino.Cuda.Sample;

public enum CublasLibraryProperty
{
    MajorVersion = CublasNative.LibraryPropertyType.MAJOR_VERSION,
    MinorVersion = CublasNative.LibraryPropertyType.MINOR_VERSION,
    PatchLevel = CublasNative.LibraryPropertyType.PATCH_LEVEL
}


public class Cublas : IDisposable
{
    private CublasNative.CublasHandle _handle;

    private Cublas(CublasNative.CublasHandle handle)
    {
        _handle = handle;
    }

    ~Cublas()
    {
        if (_handle.Pointer != IntPtr.Zero)
        {
            CublasNative.cublasDestroy_v2(_handle);
        }
    }

    public static Cublas Create()
    {
        CublasException.ThrowOnError(CublasNative.cublasCreate_v2(out CublasNative.CublasHandle handle));
        return new Cublas(handle);
    }

    public void Dispose()
    {
        CublasNative.cublasDestroy_v2(_handle);
        _handle.Pointer = nint.Zero;
        GC.SuppressFinalize(this);
    }

    public static nint CudartVersion => CublasNative.cublasGetCudartVersion();

    public int Version
    {
        get
        {
            CublasException.ThrowOnError(CublasNative.cublasGetVersion_v2(_handle, out int version));
            return version;
        }
    }

    public PointerMode PointerMode
    {
        get
        {
            CublasException.ThrowOnError(CublasNative.cublasGetPointerMode_v2(_handle, out PointerMode value));
            return value;
        }
        set => CublasException.ThrowOnError(CublasNative.cublasSetPointerMode_v2(_handle, value));
    }

    public AtomicsMode AtomicMode
    {
        get
        {
            CublasException.ThrowOnError(CublasNative.cublasGetAtomicsMode(_handle, out AtomicsMode value));
            return value;
        }
        set => CublasException.ThrowOnError(CublasNative.cublasSetAtomicsMode(_handle, value));
    }

    public MathMode MathMode
    {
        get
        {
            CublasException.ThrowOnError(CublasNative.cublasGetMathMode(_handle, out MathMode value));
            return value;
        }
        set => CublasException.ThrowOnError(CublasNative.cublasSetMathMode(_handle, value));
    }

    public int SmCountTarget
    {
        get
        {
            CublasException.ThrowOnError(CublasNative.cublasGetSmCountTarget(_handle, out int value));
            return value;
        }
        set => CublasException.ThrowOnError(CublasNative.cublasSetSmCountTarget(_handle, value));
    }

    public static int GetProperty(CublasLibraryProperty property)
    {
        CublasException.ThrowOnError(CublasNative.cublasGetProperty((CublasNative.LibraryPropertyType)property, out int value));
        return value;
    }

    public static unsafe void SetVector<T>(int n, T[] x, int incx, CudaPointer<T> y, int incy) where T : unmanaged
    {
        fixed (T* ptr = &x[0])
        {
            CublasException.ThrowOnError(
                CublasNative.cublasSetVector(n, Marshal.SizeOf<T>(), ptr, incx, y.Pointer, incy));
        }
    }

    public static unsafe T[] GetVector<T>(int n, CudaPointer<T> x, int incx = 1) where T : unmanaged
    {
        T[] y = new T[n];
        GetVector<T>(n, x, incx, y, 1);
        return y;
    }

    public static unsafe void GetVector<T>(int n, CudaPointer<T> x, int incx, T[] y, int incy) where T : unmanaged
    {
        fixed (T* ptr = &y[0])
        {
            CublasException.ThrowOnError(
                CublasNative.cublasGetVector(n, Marshal.SizeOf<T>(), x.Pointer, incx, ptr, incy));
        }
    }

    /// <summary>
    /// This function finds the (smallest) index of the element of the maximum magnitude. 
    /// Notice that the returning value is 1-based indexing used for compatibility with Fortran.
    /// </summary>
    /// <param name="n">number of elements in the vector x</param>
    /// <param name="x">vector with elements (device)/param>
    /// <param name="incx">stride between consecutive elements of x</param>
    /// <param name="result">the resulting index, which is 0 if n,incx<=0. (host or device)</param>
    public void AMax(int n, CudaPointer<float> x, int incx, out int result)
    {
        unsafe
        {
            fixed (int* ptr = &result)
            {
                CublasException.ThrowOnError(
                    CublasNative.cublasIsamax_v2(_handle, n, x.Pointer, incx, ptr)
                );
            }
        }
    }

    /// <summary>
    /// This function finds the (smallest) index of the element of the minimum magnitude. 
    /// Notice that the returning value is 1-based indexing used for compatibility with Fortran.
    /// </summary>
    /// <param name="n">number of elements in the vector x</param>
    /// <param name="x">vector with elements (device)/param>
    /// <param name="incx">stride between consecutive elements of x</param>
    /// <param name="result">the resulting index, which is 0 if n,incx<=0. (host or device)</param>
    public void AMin(int n, CudaPointer<float> x, int incx, out int result)
    {
        unsafe
        {
            fixed (int* ptr = &result)
            {

                CublasException.ThrowOnError(
                    CublasNative.cublasIsamin_v2(_handle, n, x.Pointer, incx, ptr)
                );
            }
        }
    }
}
