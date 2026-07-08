using System.ComponentModel.DataAnnotations;

public class Account
{
    [Required]
    public long AccountId { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; } 
    
    public ICollection<Game> FavoriteGames { get; set; }

    public ICollection<Account> Followers { get; set; }
    public ICollection<Account> Following { get; set; }

    //public ICollection<Review> LikedReviews { get; set; }
}