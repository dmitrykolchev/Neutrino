using MessagePack;
using DataStream;

namespace DataAccess.Sample;

[MessagePackObject]
[DataStreamSerializable]
public class Organization
{
    [Key(nameof(Id))]
    public int Id { get; set; }

    [Key(nameof(Name))]
    [Property(Internable = false)]
    public string? Name { get; set; }
}

