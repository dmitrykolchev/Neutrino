// <copyright file="Mime.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

namespace Xobex.Net;

/// <summary>
/// Common MIME types
/// </summary>
public static class Mime
{
    public const string Xml = "application/xml";
    public const string Html = "text/html";
    public const string JavaScript = "text/javascript";
    public const string Css = "text/css";
    public const string PlainText = "text/plain";
    public const string Json = "application/json";
    public const string Binary = "application/octet-stream";
    public const string OctetStream = "application/octet-stream";
    public const string DataStream = "application/vnd.xobex.data-stream";
    public const string MessagePack = "application/vnd.xobex.message-pack";
    public const string Zip = "application/zip";
    /// <summary>
    /// Common MIME with UTF-8 encoding
    /// </summary>
    public static class UTF8
    {
        /// <summary>
        /// mime: application/json; charset=utf-8
        /// </summary>
        public const string Json = Mime.Json + "; charset=utf-8";
        /// <summary>
        /// mime: text/plain; charset=utf-8
        /// </summary>
        public const string PlainText = Mime.PlainText + "; charset=utf-8";
        /// <summary>
        /// mime: application/xml; charset=utf-8
        /// </summary>
        public const string Xml = Mime.Xml + "; charset=utf-8";
    }
}
