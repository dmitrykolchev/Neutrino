// <copyright file="CudaMemory.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Neutrino.Cuda.Sample;

public unsafe struct CudaMemory<T> where T : unmanaged
{
    private T* _ptr;
    private nint _length;

    internal CudaMemory(T* ptr, nint length)
    {
        _ptr = ptr;
        _length = length;
    }

    public CudaPointer<T> ToPointer() => GetPointer(0);

    public CudaPointer<T> GetPointer(nint index) => new (GetAddress(index));

    public T* Ptr => _ptr;

    public nint Length => _length;

    public unsafe T* GetAddress(nint index)
    {
        if (index < 0 || index >= _length)
        {
            throw new ArgumentOutOfRangeException("index");
        }
        return &_ptr[index];
    }

    internal void Free()
    {
        if (_ptr is not null)
        {
            CublasException.ThrowOnError(CublasNative.cublasFree((nint)_ptr));
            _ptr = null;
            _length = IntPtr.Zero;
        }
    }

    public static implicit operator CudaPointer<T>(CudaMemory<T> memory) => memory.ToPointer();

    public ref T this[nint index] => ref _ptr[index];
}

public unsafe static class CudaMemory
{
    public static void Free<T>(CudaMemory<T> memory) where T: unmanaged => memory.Free();

    public static CudaMemory<T> Alloc<T>(int length) where T: unmanaged
    {
        CublasException.ThrowOnError(CublasNative.cublasAlloc(length, sizeof(T), out nint ptr));
        return new CudaMemory<T>((T*)ptr, length);
    }
}
