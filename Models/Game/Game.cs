using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Game
{
    [Required]
    public long GameId { get; set; }

    [Required]
    public string Name { get; set; }
    public string Description { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public int ReviewCount { get; set; } = 0;
    public float RatingTotal { get; set; } = 0;

    [ForeignKey("PublisherId")]
    [Required]
    public Publisher Publisher { get; set; }

    public ICollection<Platform> Platforms { get; set; }
    public ICollection<Genre> Genres { get; set; }


    public float GetAvgRating()
    {
        if(ReviewCount == 0) return 0;
        return RatingTotal / ReviewCount;
    }
}