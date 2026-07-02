public class AccountDTO
{
    public long AccountId { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }

    public ICollection<Game> FavoriteGames { get; set; }
}