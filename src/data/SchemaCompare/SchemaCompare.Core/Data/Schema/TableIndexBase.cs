using System.Linq;

namespace SchemaCompare.Data.Schema;

public abstract class TableIndexBase : TableConstraint
{
    public TableIndexBase()
    {
        Columns = new TableIndexColumnSpecificationCollection();
    }

    public TableIndexColumnSpecificationCollection Columns { get; }

    public static bool Equals(TableIndexBase i1, TableIndexBase i2)
    {
        if (object.ReferenceEquals(i1, i2))
        {
            return true;
        }
        if (i1 is null || i2 is null)
        {
            return false;
        }
        if (i1.GetType() == i2.GetType())
        {
            if (i1.Name == i2.Name && i1.Schema.Name == i2.Schema.Name)
            {
                return Enumerable.SequenceEqual(i1.Columns, i2.Columns);
            }
        }
        return false;
    }

    public override bool Equals(object? obj)
    {
        if (obj is TableIndexBase index)
        {
            return Equals(this, index);
        }
        return false;
    }

    public override int GetHashCode()
    {
        return Name?.GetHashCode() ?? 0;
    }
}

public class TableIndex : TableIndexBase
{
    public TableIndex()
    {
    }

    public string FilterDefinition { get; set; }

    public static bool Equals(TableIndex i1, TableIndex i2)
    {
        if (object.ReferenceEquals(i1, i2))
        {
            return true;
        }
        if (i1 is null || i2 is null)
        {
            return false;
        }
        if (i1.GetType() == i2.GetType())
        {
            if (i1.Name == i2.Name && i1.Schema.Name == i2.Schema.Name)
            {
                if (Enumerable.SequenceEqual(i1.Columns, i2.Columns))
                {
                    return i1.FilterDefinition == i2.FilterDefinition;
                }
            }
        }
        return false;
    }

    public override bool Equals(object obj)
    {
        if (obj is TableIndex index)
        {
            return Equals(this, index);
        }
        return false;
    }

    public override int GetHashCode()
    {
        return Name?.GetHashCode() ?? 0;
    }
}
