using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ControlDWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly ControldContext _context;

        public GameController(ControldContext context)
        {
            _context = context;
        }

        // GET: api/Game
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames([FromQuery] GameQuery query)
        {
            var q = _context.Games.AsNoTracking();

            q = ApplyFilters(q, query);

            var total = await q.CountAsync();

            q = ApplySort(q, query);

            var items = await q
                .Skip(query.Skip)
                .Take(query.ClampedPageSize)
                .ToListAsync();

            return items;
        }

        // GET: api/Game/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Game>> GetGame(long id)
        {
            var game = await _context.Games
                .Include(g => g.Publisher)
                .Include(g => g.Genres)
                .Include(g => g.Platforms)
                .FirstOrDefaultAsync(g => g.GameId == id);

            if (game == null)
            {
                return NotFound();
            }

            return game;
        }

        // PUT: api/Game/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGame(long id, Game game)
        {
            if (id != game.GameId)
            {
                return BadRequest();
            }

            _context.Entry(game).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Game
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Game>> PostGame(Game game)
        {
            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGame", new { id = game.GameId }, game);
        }

        // DELETE: api/Game/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(long id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GameExists(long id)
        {
            return _context.Games.Any(e => e.GameId == id);
        }

        private static IQueryable<Game> ApplyFilters(IQueryable<Game> query, GameQuery q)
        {
            if(!string.IsNullOrWhiteSpace(q.ByPublisher))
                query = query.Where(g =>
                    g.Publisher.Name.Contains(q.ByPublisher)
                );

            if(!q.HasGenres.IsNullOrEmpty())
                query = query.Where(g =>
                    g.Genres.Intersect(q.HasGenres).Count() == q.HasGenres.Count()
                );

            if(!q.OnPlatforms.IsNullOrEmpty())
                query = query.Where(g =>
                    g.Platforms.Intersect(q.OnPlatforms).Count() > 0
                );

            if(!string.IsNullOrWhiteSpace(q.Search))
                query = query.Where(g => 
                    g.Name.Contains(q.Search) ||
                    g.Description.Contains(q.Search)
                );

            return query;
        }

        private static IQueryable<Game> ApplySort(IQueryable<Game> query, GameQuery q)
        {
            var ascending = q.SortDir.Equals("asc", StringComparison.OrdinalIgnoreCase);
            return q.SortBy.ToLower() switch
            {
                "toprated" => ascending ? query.OrderBy(g => g.GetAvgRating()) : query.OrderByDescending(g => g.GetAvgRating()),
                "mostreviewed" => ascending ? query.OrderBy(g => g.ReviewCount) : query.OrderByDescending(g => g.ReviewCount),
                "name" => ascending ? query.OrderBy(g => g.Name) : query.OrderByDescending(g => g.Name),
                _ => query.OrderByDescending(g => g.GetAvgRating())
            };
        }
    }

    public record GameQuery(
        Genre[] HasGenres = null,
        Platform[] OnPlatforms = null,
        string ByPublisher = null,
        string Search = null,
        string SortBy = "topRated",
        string SortDir = "desc",
        int Page = 1,
        int PageSize = 20
    )
    {
        public int ClampedPageSize => Math.Min(PageSize, 50);
        public int Skip => (Page - 1) * ClampedPageSize;
    }
}
