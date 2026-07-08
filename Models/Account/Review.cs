using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Review
{
    [Required]
    public long ReviewId { get; set; }
    [Required]
    public long AccountId { get; set; }
    [Required]
    public long GameId { get; set; }

    [Required]
    public DateOnly ReviewDate { get; set; }
    
    [Required]
    public float Rating { get; set; }
    [Required]
    public string Title { get; set; }
    public string Body { get; set; }
    public int Likes { get; set; } = 0;

    public ICollection<Account> Likers { get; set; }

    public string AccountUsername { get; set; }
    public string GameName { get; set; }

    public Account Account { get; set; }
    public Game Game { get; set; }
}