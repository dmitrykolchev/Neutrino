namespace SchemaCompare.Data.Schema;

public class DefaultConstraint : TableConstraint
{
    public DefaultConstraint()
    {
    }
    public string Expression { get; set; }
}
