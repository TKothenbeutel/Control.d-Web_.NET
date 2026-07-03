using System.ComponentModel.DataAnnotations;

public class Publisher
{
    [Required]
    public long PublisherId { get; set; }
    [Required]
    public string Name { get; set; }
}