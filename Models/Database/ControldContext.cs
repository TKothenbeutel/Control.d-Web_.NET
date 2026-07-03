using Microsoft.EntityFrameworkCore;

public class ControldContext(DbContextOptions<ControldContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Review> Reviews { get; set; }

    public DbSet<Game> Games { get; set; }
    public DbSet<Publisher> Publishers { get; set; }
    public DbSet<Platform> Platforms { get; set; }
    public DbSet<Genre> Genres { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //Connect entity to table
        modelBuilder.Entity<Account>().ToTable("Accounts");
        modelBuilder.Entity<Review>().ToTable("Reviews");

        modelBuilder.Entity<Game>().ToTable("Games");
        modelBuilder.Entity<Publisher>().ToTable("Publishers");
        modelBuilder.Entity<Platform>().ToTable("Platforms");
        modelBuilder.Entity<Genre>().ToTable("Genres");

        //Connect Many-to-Many
        modelBuilder.Entity<Platform>()
            .HasMany(e => e.Games)
            .WithMany(e => e.Platforms);
        modelBuilder.Entity<Genre>()
            .HasMany(e => e.Games)
            .WithMany(e => e.Genres);
        modelBuilder.Entity<Account>()
            .HasMany(e => e.FavoriteGames)
            .WithMany();
        modelBuilder.Entity<Account>()
            .HasMany(e => e.Following)
            .WithMany(e => e.Followers);
    }
    
}