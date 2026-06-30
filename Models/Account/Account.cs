public class Account
{
    public long AccountId { get; set; }
    public required string Email { get; set; }
    public required string Username { get; set; }
    public HashSet<Game> FavoriteGames = new HashSet<Game>();

    public void AddGame(Game game)
    {
        FavoriteGames.Add(game);
    }

    public void RemoveGame(long gameId)
    {
        FavoriteGames.RemoveWhere(game => game.GameId == gameId);
    }

}