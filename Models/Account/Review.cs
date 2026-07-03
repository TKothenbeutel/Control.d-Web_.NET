using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Review
{
    [Required]
    public long ReviewId { get; set; }

    [Required]
    public DateOnly ReviewDate { get; set; }
    
    [Required]
    public float Rating { get; set; }
    [Required]
    public string Title { get; set; }
    public string Body { get; set; }
    public int Likes { get; set; } = 0;

    [ForeignKey("AccountId")]
    [Required]
    public Account Account { get; set; }
    [ForeignKey("GameId")]
    [Required]
    public Game Game { get; set; }
}