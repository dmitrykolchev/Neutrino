using System;

namespace SchemaCompare.Data.Schema;

public class TableColumn: IDatabaseNamedObject
{
    private string? _defaultContraint;

    public int Ordinal { get; set; }

    public string Name { get; set; } = null!;

    public DataType DataType { get; set; }

    public bool IsIdentity { get; set; }

    public bool IsUnicode { get; set; }

    public bool Nullable { get; set; }

    public int Precision { get; set; }

    public int Scale { get; set; }

    public int MaxLength { get; set; }

    public string? DefaultConstraint
    {
        get => _defaultContraint;
        set => _defaultContraint = string.IsNullOrWhiteSpace(value) ? default : value.Trim().ToLowerInvariant();
    }

    public override string ToString()
    {
        return $"{Name} {DataType}";
    }

    public override bool Equals(object? obj)
    {
        if (obj is TableColumn column)
        {
            return Equals(this, column);
        }
        return false;
    }

    public override int GetHashCode()
    {
        return DataType.GetHashCode() ^ Ordinal.GetHashCode() ^ Name.GetHashCode();
    }

    public static bool Equals(TableColumn column1, TableColumn column2)
    {
        if (object.ReferenceEquals(column1, column2))
        {
            return true;
        }
        if (column1 == null || column2 == null)
        {
            return false;
        }
        if (column1.Name != column2.Name)
        {
            Console.WriteLine($"Column: {column1.Name}, Name differs");
            return false;
        }
        if (column1.DataType != column2.DataType)
        {
            Console.WriteLine($"Column: {column1.Name}, DataType differs");
            return false;
        }
        if (column1.IsIdentity != column2.IsIdentity)
        {
            Console.WriteLine($"Column: {column1.Name}, IsIdentity differs");
            return false;
        }
        if (column1.Nullable != column2.Nullable)
        {
            Console.WriteLine($"Column: {column1.Name}, Nullable differs");
            return false;
        }
        if (column1.Precision != column2.Precision)
        {
            Console.WriteLine($"Column: {column1.Name}, Precision differs");
            return false;
        }
        if (column1.Scale != column2.Scale)
        {
            Console.WriteLine($"Column: {column1.Name}, Scale differs");
            return false;
        }
        if (column1.MaxLength != column2.MaxLength)
        {
            Console.WriteLine($"Column: {column1.Name}, MaxLength differs");
            return false;
        }
        if (column1.DefaultConstraint != column2.DefaultConstraint && !column1.IsIdentity && !column2.IsIdentity)
        {
            Console.WriteLine($"Column: {column1.Name}, DefaultConstraint differs");
            return false;
        }
        return true;
    }
}
