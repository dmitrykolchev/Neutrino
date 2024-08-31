// <copyright file="CublasNative.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.InteropServices;
using static Neutrino.Cuda.Sample.CublasNative;

namespace Neutrino.Cuda.Sample;

internal unsafe class CublasApiTable
{
    private const string CUBLAS_LIBRARY = "cublas64_12";

    public delegate* unmanaged[Stdcall]<CublasStatus> cublasInit;
    public delegate* unmanaged[Stdcall]<CublasStatus> cublasShutdown;
    public delegate* unmanaged[Stdcall]<CublasStatus> cublasGetError;
    public delegate* unmanaged[Stdcall]<int*, CublasStatus> cublasGetVersion;
    public delegate* unmanaged[Stdcall]<int, int, nint*, CublasStatus> cublasAlloc;
    public delegate* unmanaged[Stdcall]<nint, CublasStatus> cublasFree;

    //[DllImport(CUBLAS_LIBRARY)]
    //public static extern CublasStatus cublasSetKernelStream(CudaStream stream);

    public delegate* unmanaged[Stdcall]<CublasHandle*, CublasStatus> cublasCreate_v2;
    public delegate* unmanaged[Stdcall]<CublasHandle, CublasStatus> cublasDestroy_v2;
    public delegate* unmanaged[Stdcall]<CublasHandle, int*, CublasStatus> cublasGetVersion_v2;
    public delegate* unmanaged[Stdcall]<LibraryPropertyType, int*, CublasStatus> cublasGetProperty;
    public delegate* unmanaged[Stdcall]<nint> cublasGetCudartVersion;

    //[DllImport(CUBLAS_LIBRARY)]
    //public static extern CublasStatus cublasSetWorkspace_v2(CublasHandle handle, void* workspace, nint workspaceSizeInBytes);

    //[DllImport(CUBLAS_LIBRARY)]
    //public static extern CublasStatus cublasSetStream_v2(CublasHandle handle, CudaStream streamId);

    //[DllImport(CUBLAS_LIBRARY)]
    //public static extern CublasStatus cublasGetStream_v2(CublasHandle handle, out CudaStream streamId);

    public delegate* unmanaged[Stdcall]<CublasHandle, PointerMode*, CublasStatus> cublasGetPointerMode_v2;
    public delegate* unmanaged[Stdcall]<CublasHandle, PointerMode, CublasStatus> cublasSetPointerMode_v2;
    public delegate* unmanaged[Stdcall]<CublasHandle, AtomicsMode*, CublasStatus> cublasGetAtomicsMode;
    public delegate* unmanaged[Stdcall]<CublasHandle, AtomicsMode, CublasStatus> cublasSetAtomicsMode;
    public delegate* unmanaged[Stdcall]<CublasHandle, MathMode*, CublasStatus> cublasGetMathMode;
    public delegate* unmanaged[Stdcall]<CublasHandle, MathMode, CublasStatus> cublasSetMathMode;
    public delegate* unmanaged[Stdcall]<CublasHandle, int*, CublasStatus> cublasGetSmCountTarget;
    public delegate* unmanaged[Stdcall]<CublasHandle, int, CublasStatus> cublasSetSmCountTarget;

    public delegate* unmanaged[Stdcall]<CublasStatus, byte*> cublasGetStatusName;

    public delegate* unmanaged[Stdcall]<CublasStatus, byte*> cublasGetStatusString;

    //[DllImport(CUBLAS_LIBRARY)]
    //public static extern CublasStatus cublasLoggerConfigure(int logIsOn,
    //                                                        int logToStdOut,
    //                                                        int logToStdErr,
    //                                                        byte* logFileName);

    //[DllImport(CUBLAS_LIBRARY)]
    //public static extern CublasStatus cublasSetLoggerCallback(CublasLogCallback userCallback);

    //[DllImport(CUBLAS_LIBRARY)]
    //public static extern CublasStatus cublasGetLoggerCallback(out CublasLogCallback userCallback);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetVector(int n, int elemSize, /*const*/ void* x, int incx, void* devicePtr, int incy);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetVector_64(long n, long elemSize, /*const*/ void* x, long incx, void* devicePtr, long incy);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetVector(int n, int elemSize, /*const*/ void* devicePtr, int incx, void* y, int incy);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetVector_64(long n, long elemSize, /*const*/ void* devicePtr, long incx, void* y, long incy);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetMatrix(int rows, int cols, int elemSize, /*const*/ void* A, int lda, void* B, int ldb);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetMatrix_64(long rows, long cols, long elemSize, /*const*/ void* A, long lda, void* B, long ldb);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetMatrix(int rows, int cols, int elemSize, /*const*/ void* A, int lda, void* B, int ldb);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetMatrix_64(long rows, long cols, long elemSize, /*const*/ void* A, long lda, void* B, long ldb);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetVectorAsync(int n, int elemSize, /*const*/ void* hostPtr,
        int incx, void* devicePtr, int incy, CudaStream stream);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetVectorAsync_64(
    long n, long elemSize, /*const*/ void* hostPtr, long incx, void* devicePtr, long incy, CudaStream stream);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetVectorAsync(
        int n, int elemSize, /*const*/ void* devicePtr, int incx, void* hostPtr, int incy, CudaStream stream);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetVectorAsync_64(
    long n, long elemSize, /*const*/ void* devicePtr, long incx, void* hostPtr, long incy, CudaStream stream);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetMatrixAsync(int rows, int cols, int elemSize, /*const*/  void* A, int lda, void* B, int ldb, CudaStream stream);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetMatrixAsync_64(long rows,
                                                              long cols,
                                                              long elemSize,
                                                              /*const*/  void* A,
                                                              long lda,
                                                              void* B,
                                                              long ldb,
                                                              CudaStream stream);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetMatrixAsync(int rows, int cols, int elemSize, /*const*/  void* A, int lda, void* B, int ldb, CudaStream stream);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetMatrixAsync_64(long rows,
                                                    long cols,
                                                    long elemSize,
                                                    /*const*/  void* A,
                                                    long lda,
                                                    void* B,
                                                    long ldb,
                                                    CudaStream stream);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern void cublasXerbla([MarshalAs(UnmanagedType.LPStr)] string srName, int info);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIsamax_v2(CublasHandle handle, int n, /* const */ float* x, int incx, int* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIsamax_v2_64(CublasHandle handle, long n, /* const */ float* x, long incx, long* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIdamax_v2(CublasHandle handle, int n, /* const */ double* x, int incx, int* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIdamax_v2_64(CublasHandle handle, long n, /* const */ double* x, long incx, long* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIcamax_v2(CublasHandle handle, int n, /* const */ cuComplex* x, int incx, int* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIcamax_v2_64(CublasHandle handle, long n, /* const */ cuComplex* x, long incx, long* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIzamax_v2(CublasHandle handle, int n, /* const */ cuDoubleComplex* x, int incx, int* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIzamax_v2_64(CublasHandle handle, long n, /* const */ cuDoubleComplex* x, long incx, long* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIamaxEx(CublasHandle handle, int n, /* const */ void* x, CudaDataType xType, int incx, int* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIamaxEx_64(CublasHandle handle, long n, /* const */ void* x, CudaDataType xType, long incx, long* result);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasIsamin_v2(CublasHandle handle, int n, /* const */ float* x, int incx, int* result);

}
