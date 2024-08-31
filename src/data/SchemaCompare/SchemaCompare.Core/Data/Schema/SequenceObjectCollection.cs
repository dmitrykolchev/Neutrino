using System.Collections.ObjectModel;

namespace SchemaCompare.Data.Schema;

public class SequenceObjectCollection : Collection<SequenceObject>
{
    public SequenceObjectCollection()
    {

    }

    public SequenceObject Add(string sequenceName, SchemaObject schema)
    {
        SequenceObject sequence = new()
        {
            Name = sequenceName,
            Schema = schema
        };
        Add(sequence);
        return sequence;
    }
}
