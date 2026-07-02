public class Platform
{
    public long PlatformId { get; set; }
    public string Name { get; set; }

    public ICollection<Game> Games { get; set; }
}