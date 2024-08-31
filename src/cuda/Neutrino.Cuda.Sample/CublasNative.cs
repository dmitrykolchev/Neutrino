// <copyright file="CublasNative.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.InteropServices;

namespace Neutrino.Cuda.Sample;

public enum CudaDataType
{
    CUDA_R_16F = 2, /* real as a half */
    CUDA_C_16F = 6, /* complex as a pair of half numbers */
    CUDA_R_16BF = 14, /* real as a nv_bfloat16 */
    CUDA_C_16BF = 15, /* complex as a pair of nv_bfloat16 numbers */
    CUDA_R_32F = 0, /* real as a float */
    CUDA_C_32F = 4, /* complex as a pair of float numbers */
    CUDA_R_64F = 1, /* real as a double */
    CUDA_C_64F = 5, /* complex as a pair of double numbers */
    CUDA_R_4I = 16, /* real as a signed 4-bit int */
    CUDA_C_4I = 17, /* complex as a pair of signed 4-bit int numbers */
    CUDA_R_4U = 18, /* real as a unsigned 4-bit int */
    CUDA_C_4U = 19, /* complex as a pair of unsigned 4-bit int numbers */
    CUDA_R_8I = 3, /* real as a signed 8-bit int */
    CUDA_C_8I = 7, /* complex as a pair of signed 8-bit int numbers */
    CUDA_R_8U = 8, /* real as a unsigned 8-bit int */
    CUDA_C_8U = 9, /* complex as a pair of unsigned 8-bit int numbers */
    CUDA_R_16I = 20, /* real as a signed 16-bit int */
    CUDA_C_16I = 21, /* complex as a pair of signed 16-bit int numbers */
    CUDA_R_16U = 22, /* real as a unsigned 16-bit int */
    CUDA_C_16U = 23, /* complex as a pair of unsigned 16-bit int numbers */
    CUDA_R_32I = 10, /* real as a signed 32-bit int */
    CUDA_C_32I = 11, /* complex as a pair of signed 32-bit int numbers */
    CUDA_R_32U = 12, /* real as a unsigned 32-bit int */
    CUDA_C_32U = 13, /* complex as a pair of unsigned 32-bit int numbers */
    CUDA_R_64I = 24, /* real as a signed 64-bit int */
    CUDA_C_64I = 25, /* complex as a pair of signed 64-bit int numbers */
    CUDA_R_64U = 26, /* real as a unsigned 64-bit int */
    CUDA_C_64U = 27, /* complex as a pair of unsigned 64-bit int numbers */
    CUDA_R_8F_E4M3 = 28, /* real as a nv_fp8_e4m3 */
    CUDA_R_8F_E5M2 = 29, /* real as a nv_fp8_e5m2 */
}

public enum PointerMode
{
    Host = 0,
    Device = 1
}

public enum AtomicsMode
{
    NotAllowed = 0,
    Allowed = 1
}

/*Enum for default math mode/tensor operation*/
public enum MathMode
{
    DefaultMath = 0,
    /* deprecated, same effect as using CUBLAS_COMPUTE_32F_FAST_16F, will be removed in a future release */
    TensorOpMath = 1,
    /* same as using matching _PEDANTIC compute type when using cublas<T>routine calls or cublasEx() calls with
       cudaDataType as compute type */
    PedanticMath = 2,
    /* allow accelerating single precision routines using TF32 tensor cores */
    TF32TensorOpMath = 3,
    /* flag to force any reductons to use the accumulator type and not output type in case of mixed precision routines
       with lower size output type */
    MathDisallowReducedPrecisionReduction = 16,
}

public enum CublasStatus
{
    Success = 0,
    NotInitialized = 1,
    AllocFailed = 3,
    InvalidValue = 7,
    ArchMismatch = 8,
    MappingError = 11,
    ExecutionFailed = 13,
    InternalError = 14,
    NotSupported = 15,
    LicenseError = 16
}

[StructLayout(LayoutKind.Sequential)]
public struct cuComplex
{
    public float re;
    public float im;
}

[StructLayout(LayoutKind.Sequential)]
public struct cuDoubleComplex
{
    public double re;
    public double im;
}


internal unsafe class CublasNative
{
    private const string CUBLAS_LIBRARY = "cublas64_12";

    public enum LibraryPropertyType
    {
        MAJOR_VERSION,
        MINOR_VERSION,
        PATCH_LEVEL
    }


    [StructLayout(LayoutKind.Sequential)]
    public struct CublasHandle
    {
        public nint Pointer;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct CudaStream
    {
        public nint Pointer;
    }

    public delegate void CublasLogCallback([MarshalAs(UnmanagedType.LPStr)] string msg);


    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasInit();

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasShutdown();

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetError();

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetVersion(out int version);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasAlloc(int n, int elemSize, out nint devicePtr);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasFree(nint devicePtr);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetKernelStream(CudaStream stream);


    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasCreate_v2(out CublasHandle handle);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasDestroy_v2(CublasHandle handle);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetVersion_v2(CublasHandle handle, out int version);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetProperty(LibraryPropertyType type, out int value);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern nint cublasGetCudartVersion();

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetWorkspace_v2(CublasHandle handle, void* workspace, nint workspaceSizeInBytes);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetStream_v2(CublasHandle handle, CudaStream streamId);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetStream_v2(CublasHandle handle, out CudaStream streamId);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetPointerMode_v2(CublasHandle handle, out PointerMode mode);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetPointerMode_v2(CublasHandle handle, PointerMode mode);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetAtomicsMode(CublasHandle handle, out AtomicsMode mode);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetAtomicsMode(CublasHandle handle, AtomicsMode mode);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetMathMode(CublasHandle handle, out MathMode mode);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetMathMode(CublasHandle handle, MathMode mode);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetSmCountTarget(CublasHandle handle, out int smCountTarget);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetSmCountTarget(CublasHandle handle, int smCountTarget);

    [DllImport(CUBLAS_LIBRARY)]
    [return: MarshalAs(UnmanagedType.LPStr)]
    public static extern byte* cublasGetStatusName(CublasStatus status);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern byte* cublasGetStatusString(CublasStatus status);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasLoggerConfigure(int logIsOn,
                                                            int logToStdOut,
                                                            int logToStdErr,
                                                            byte* logFileName);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasSetLoggerCallback(CublasLogCallback userCallback);

    [DllImport(CUBLAS_LIBRARY)]
    public static extern CublasStatus cublasGetLoggerCallback(out CublasLogCallback userCallback);

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
