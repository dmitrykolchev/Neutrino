using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchemaGenerator
{
    static class Extensions
    {
        public static string ToCamelCase(this string value)
        {
            value = value.ToPascalCase();
            return value.Substring(0, 1).ToLower() + value.Substring(1);
        }
        public static string ToPascalCase(this string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                throw new ArgumentNullException(nameof(value));
            }
            return string.Join("", value.Split('_').Select(t => t.Substring(0, 1).ToUpper() + t.Substring(1)));
        }

    }
}
