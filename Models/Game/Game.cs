public class Game
{
    public long GameId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public int ReviewCount { get; set; }
    public float RatingTotal { get; set; }


    public float GetAvgRating()
    {
        return RatingTotal / ReviewCount;
    }
}