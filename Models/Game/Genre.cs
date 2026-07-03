using System.ComponentModel.DataAnnotations;

public class Genre
{
    [Required]
    public long GenreId { get; set; }
    [Required]
    public string Name { get; set; }

    public ICollection<Game> Games { get; set; }
}