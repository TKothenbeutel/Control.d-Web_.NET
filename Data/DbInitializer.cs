public static class DbInitializer
{
    public static void Initialize(ControldContext context)
    {
        context.Database.EnsureCreated();

        if (context.Accounts.Any())
        {
            return; //Data already initialized
        }

        //Add initial data

        var accounts = new Account[]
        {
            new Account{Email="fake@mail.com", Username="foobar", Password="hihi"},
            new Account{Email="test@mail.com", Username="Jane_Doe", Password="1234"}
        };
        //Added later to inclue favorited game

        var publishers = new Publisher[]
        {
            new Publisher{Name="Valve"}
        }; 
        context.Publishers.AddRange(publishers);
        context.SaveChanges();

        var platforms = new Platform[]
        {
            new Platform{Name="PC"},
            new Platform{Name="Nintendo Switch"},
            new Platform{Name="Xbox 360"},
            new Platform{Name="PS5"}
        };
        context.Platforms.AddRange(platforms);
        context.SaveChanges();

        var genres = new Genre[]
        {
            new Genre{Name="Puzzle"},
            new Genre{Name="Platformer"}
        };
        context.Genres.AddRange(genres);
        context.SaveChanges();

        var games = new Game[]
        {
            new Game{Name="Portal", ReleaseDate=DateOnly.Parse("2007-10-10"), Description="Set in the mysterious Aperture Science Laboratories, Portal has been called one of the most innovative new games on the horizon and will offer gamers hours of unique gameplay.", ReviewCount=1, RatingTotal=4.5F, Publisher=publishers[0], Genres=new HashSet<Genre>{genres[0],genres[1]}, Platforms=new HashSet<Platform>{platforms[0],platforms[1],platforms[2]}}
        };
        context.Games.AddRange(games);
        context.SaveChanges();

        //Favorited game addition
        accounts[0].FavoriteGames = new HashSet<Game>{games[0]};
        context.Accounts.AddRange(accounts);
        context.SaveChanges();

        var reviews = new Review[]
        {
            new Review{Rating=4.5F, Title="Very good game!", Body="Oh my goodness this game is awesome! I love being able to go through the portals and also experience the story. I hope they make a sequel!", Likes=0, ReviewDate=DateOnly.Parse("2026-01-01"), AccountId=accounts[0].AccountId, GameId=games[0].GameId}
        };
        context.Reviews.AddRange(reviews);
        context.SaveChanges();
    }
}