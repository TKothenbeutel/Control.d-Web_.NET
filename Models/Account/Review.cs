public class Review
{
    public long ReviewId { get; set; }
    public required Account Account { get; set; }
    public required Game Game { get; set; }
    public float Rating { get; set; }
    public required string Body { get; set; }
    public int Likes { get; set; }
}