using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ReviewLikes
{
    public long ReviewId { get; set; }
    public long AccountId { get; set; }
}