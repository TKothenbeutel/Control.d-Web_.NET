public class Account
{
    public long AccountId { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string Password { get; set; } 
    
    public ICollection<Game> FavoriteGames { get; set; }

}