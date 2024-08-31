// <copyright file="CudaSpan.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Cuda.Sample;

public unsafe ref struct CudaPointer<T> where T : unmanaged
{
    private readonly T* _ptr;

    internal unsafe CudaPointer(T* ptr)
    {
        _ptr = ptr;
    }

    public T* Pointer => _ptr;

    public unsafe T GetAt(nint index)
    {
        T result;
        CublasException.ThrowOnError(
            CublasNative.cublasGetVector(1, sizeof(T), GetAddress(index), 1, &result, 1));
        return result;
    }

    public unsafe void SetAt(nint index, T value)
    {
        CublasException.ThrowOnError(
            CublasNative.cublasSetVector(1, sizeof(T), &value, 1, GetAddress(index), 1));
    }

    public unsafe T* GetAddress(nint index) => &_ptr[index];

    public ref T this[nint index] => ref _ptr[index];
}
