namespace SchemaCompare.Data.Schema;

public enum ColumnSortOrder
{
    Unspecified,
    Ascending,
    Descending
}

public class TableIndexColumnSpecification
{
    public TableColumn Column { get; set; }

    public ColumnSortOrder SortOrder { get; set; }

    public override bool Equals(object obj)
    {
        if (object.ReferenceEquals(this, obj))
        {
            return true;
        }
        if (obj is not TableIndexColumnSpecification indexColumn)
        {
            return false;
        }
        if (Column?.Equals(indexColumn.Column) ?? false)
        {
            return SortOrder == indexColumn.SortOrder;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return (Column?.GetHashCode() ?? 0) ^ SortOrder.GetHashCode();
    }
}
