using System.ComponentModel.DataAnnotations;

public class Platform
{
    [Required]
    public long PlatformId { get; set; }
    [Required]
    public string Name { get; set; }

    public ICollection<Game> Games { get; set; }
}