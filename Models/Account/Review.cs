public class Review
{
    public long ReviewId { get; set; }
    public long AccountId { get; set; }
    public long GameId { get; set; }
    
    public float Rating { get; set; }
    public string Body { get; set; }
    public int Likes { get; set; }

    public Account Account { get; set; }
    public Game Game { get; set; }
}