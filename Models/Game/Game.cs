public class Game
{
    public long GameId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public int ReviewCount { get; set; }

    private float ratingTotal;
    public float AddRating
    {
        set {ratingTotal += value;}
    }


    public float GetAvgRating()
    {
        return ratingTotal / ReviewCount;
    }
}