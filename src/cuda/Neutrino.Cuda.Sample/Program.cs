// <copyright file="Program.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Diagnostics;

namespace Neutrino.Cuda.Sample;

internal unsafe class Program
{
    private static void Main(string[] args)
    {
        CublasNative.cublasInit();

        using Cublas blas = Cublas.Create();

        int version = blas.Version;
        Console.WriteLine($"CUBLAS Version: {version / 10000}.{version / 100 % 100}.{version % 100}");
        int major = Cublas.GetProperty(CublasLibraryProperty.MajorVersion);
        int minor = Cublas.GetProperty(CublasLibraryProperty.MinorVersion);
        int patchLevel = Cublas.GetProperty(CublasLibraryProperty.PatchLevel);
        Console.WriteLine($"Properties: MAJOR:{major} MINOR:{minor} PATCH LEVEL:{patchLevel}");
        Console.WriteLine($"Cuda RT version: {Cublas.CudartVersion}");
        Console.WriteLine($"Pointer mode: {blas.PointerMode}");
        Console.WriteLine($"Atomic mode: {blas.AtomicMode}");
        Console.WriteLine($"Math mode: {blas.MathMode}");
        Console.WriteLine($"Sm count target: {blas.SmCountTarget}");

        int count = 1024 * 1024;
        CudaMemory<float> cudaBuffer = CudaMemory.Alloc<float>(count);

        float[] hostBuffer = new float[count];
        for (int i = 0; i < hostBuffer.Length; i++)
        {
            hostBuffer[i] = Random.Shared.NextSingle();
        }

        Cublas.SetVector(hostBuffer.Length, hostBuffer, 1, cudaBuffer.ToPointer(), 1);

        int samples = 1000;
        Stopwatch sw = Stopwatch.StartNew();
        for (int index = 0; index < samples; ++index)
        {
            float maxV = hostBuffer.Max();
            //Console.WriteLine($"Max value: {maxV}");
            float minV = hostBuffer.Min();
            //Console.WriteLine($"Min value: {minV}");
        }
        sw.Stop();
        Console.WriteLine($"Elapsed: {sw.ElapsedMilliseconds} ms");

        CudaMemory<int> minimum = CudaMemory.Alloc<int>(1024);
        CudaMemory<int> maximum = CudaMemory.Alloc<int>(1024);
        
        blas.PointerMode = PointerMode.Device;
        sw = Stopwatch.StartNew();
        for (int index = 0; index < samples; ++index)
        {
            blas.AMax(count, cudaBuffer, 1, out maximum[index]);
            //Console.WriteLine($"Max value: {hostBuffer[n - 1]}");
            blas.AMin(count, cudaBuffer, 1, out minimum[index]);
            //Console.WriteLine($"Min value: {hostBuffer[n - 1]}");
        }
        sw.Stop();
        Console.WriteLine($"Elapsed: {sw.ElapsedMilliseconds} ms");
        int[] resultMax = Cublas.GetVector<int>(1024, maximum);
        int[] resultMin = Cublas.GetVector<int>(1024, minimum);

        CudaMemory.Free(cudaBuffer);

        Console.WriteLine($"Maximum: {hostBuffer[resultMax[0] - 1]}");
        Console.WriteLine($"Minimum: {hostBuffer[resultMin[0] - 1]}");

        CublasNative.cublasShutdown();
        CublasNative.cublasGetError();
    }
}
