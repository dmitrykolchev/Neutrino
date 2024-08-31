using System;

namespace Sam.CommandLine;

[AttributeUsage(AttributeTargets.Property)]
public class DescriptionAttribute : Attribute
{
    public DescriptionAttribute(string text)
    {
        Text = text;
    }

    public string Text { get; }
}
