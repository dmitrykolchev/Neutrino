using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace Sam.CommandLine;

public class CommandLineParser<TOptions> where TOptions : class, new()
{
    private readonly List<ArgumentInfo> _arguments = new List<ArgumentInfo>();

    public CommandLineParser()
    {
        Initialize();
    }

    public void GetHelp(TextWriter writer)
    {
        writer.WriteLine("Parameters:");
        foreach (ArgumentInfo argument in _arguments.OrderBy(t => t.Name))
        {
            if (argument.HasValue)
            {
                writer.Write($"\t/{argument.Name}:<{argument.PropertyType.Name}>");
            }
            if (!string.IsNullOrEmpty(argument.Description))
            {

            }
            if (!string.IsNullOrEmpty(argument.ShortName))
            {
                writer.Write($"(/{argument.ShortName}) - {(argument.Required ? "required" : "optional")}");
            }
            writer.WriteLine();
            writer.WriteLine();
        }
    }

    public TOptions ParseCommandLine(IEnumerable<string> args)
    {
        TOptions options = new TOptions();
        List<ArgumentInfo> list = new List<ArgumentInfo>(_arguments);

        foreach (string argument in args)
        {
            if (!argument.StartsWith("/") && !argument.StartsWith("-"))
            {
                throw new InvalidOperationException($"invalid argument {argument}");
            }
            int colonIndex = argument.IndexOf(':');
            string argumentName;
            string? argumentValue;
            if (colonIndex > 0)
            {
                argumentName = argument.Substring(1, colonIndex - 1);
                argumentValue = argument.Substring(colonIndex + 1);
            }
            else
            {
                argumentName = argument.Substring(1);
                argumentValue = null;
            }
            ArgumentInfo argumentInfo = FindArgument(argumentName);
            if (argumentInfo.HasValue && string.IsNullOrEmpty(argumentValue))
            {
                throw new InvalidOperationException($"argument /{argumentName} must have a value");
            }
            list.Remove(argumentInfo);

            if (argumentInfo.HasValue)
            {
                if (argumentInfo.PropertyType == typeof(string))
                {
                    argumentInfo.Property.SetValue(options, argumentValue);
                }
                else
                {
                    argumentInfo.Property.SetValue(options, ParseArgumentValue(argumentInfo.PropertyType, argumentValue));
                }
            }
            else
            {
                argumentInfo.Property.SetValue(options, true);
            }
        }
        ArgumentInfo? required = list.FirstOrDefault(t => t.Required);
        if (required != null)
        {
            throw new InvalidOperationException($"argument /{required.Name} is required");
        }

        return options;
    }

    private object? ParseArgumentValue(Type propertyType, string? argumentValue)
    {
        ArgumentNullException.ThrowIfNull(argumentValue);

        if (propertyType == typeof(string[]))
        {
            return argumentValue.Split(',');
        }
        if (propertyType == typeof(bool))
        {
            return bool.Parse(argumentValue);
        }
        if (propertyType == typeof(int))
        {
            return int.Parse(argumentValue);
        }
        if (propertyType.IsArray)
        {
            Type elementType = propertyType.GetElementType()!;
            string[] items = argumentValue.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            if (items.Length > 0)
            {
                Array result = Array.CreateInstance(elementType, items.Length);
                for (int index = 0; index < items.Length; ++index)
                {
                    result.SetValue(Enum.Parse(elementType, items[index], true), index);
                }
                return result;
            }
            return null;
        }
        if (typeof(IDictionary).IsAssignableFrom(propertyType))
        {
            throw new NotImplementedException();
        }
        if (typeof(IList).IsAssignableFrom(propertyType))
        {
            throw new NotImplementedException();
        }
        throw new InvalidOperationException($"unsupported argument type {propertyType.Name}");
    }

    private ArgumentInfo FindArgument(string name)
    {
        foreach (ArgumentInfo item in _arguments)
        {
            if (string.Compare(item.Name, name, StringComparison.OrdinalIgnoreCase) == 0)
            {
                return item;
            }
            else if (!string.IsNullOrEmpty(item.ShortName) && string.Compare(item.ShortName, name, StringComparison.OrdinalIgnoreCase) == 0)
            {
                return item;
            }
        }
        throw new InvalidOperationException($"invalid argument {name}");
    }

    private void Initialize()
    {
        PropertyInfo[] properties = typeof(TOptions).GetProperties(BindingFlags.Instance | BindingFlags.Public);
        foreach (PropertyInfo property in properties)
        {
            ParameterAttribute? parameterAtribute = property.GetCustomAttribute<ParameterAttribute>();
            DescriptionAttribute? descriptionAttribute = property.GetCustomAttribute<DescriptionAttribute>();
            if (parameterAtribute != null)
            {
                ArgumentInfo info = new ArgumentInfo
                {
                    Property = property,
                    Required = parameterAtribute.Required,
                    HasValue = parameterAtribute.HasValue,
                    Name = parameterAtribute.Name ?? property.Name,
                    ShortName = parameterAtribute.ShortName,
                };
                if (descriptionAttribute != null)
                {
                    info.Description = descriptionAttribute.Text;
                }
                _arguments.Add(info);
            }
        }
    }

    private class ArgumentInfo
    {
        public PropertyInfo Property { get; set; } = null!;

        public bool Required { get; set; }

        public string? ShortName { get; set; }

        public string? Name { get; set; }

        public bool HasValue { get; set; }

        public string? Description { get; set; }

        public Type PropertyType => Property.PropertyType;
    }
}
