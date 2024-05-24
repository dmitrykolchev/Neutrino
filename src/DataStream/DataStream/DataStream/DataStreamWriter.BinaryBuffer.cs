// <copyright file="DataStreamWriter.BinaryBuffer.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Runtime.CompilerServices;

namespace DataStream;

internal partial class DataStreamWriter
{
    private class BinaryBuffer
    {
        private readonly Stream _stream;
        private readonly byte[] _buffer;
        private int _position;

        public BinaryBuffer(Stream stream, byte[] buffer)
        {
            _stream = stream;
            _buffer = buffer;
            _position = 0;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void WriteByte(byte value)
        {
            if (_position >= _buffer.Length)
            {
                Flush();
            }
            _buffer[_position++] = value;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Write(byte[] data, int offset, int count)
        {
            if (count - offset <= _buffer.Length - _position)
            {
                Array.Copy(data, offset, _buffer, _position, count);
                _position += count - offset;
            }
            else
            {
                Flush();
                _stream.Write(data, offset, count);
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Write(in ReadOnlySpan<byte> data)
        {
            if (data.Length <= _buffer.Length - _position)
            {
                data.CopyTo(new Span<byte>(_buffer, _position, data.Length));
                _position += data.Length;
            }
            else
            {
                Flush();
                _stream.Write(data);
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Flush()
        {
            if (_position > 0)
            {
                _stream.Write(_buffer, 0, _position);
                _position = 0;
            }
            _stream.Flush();
        }
    }
}
