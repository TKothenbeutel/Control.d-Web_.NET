using System.ComponentModel.DataAnnotations;

public class RefreshToken
{
    [Required]
    public long Id { get; set; }
    [Required]
    public Account Account { get; set; }
    [Required]
    public string Token { get; set; }
    [Required]
    public DateTime ExpiresAt { get; set; }
    
    
}