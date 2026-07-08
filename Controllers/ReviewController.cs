using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControlDWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ControldContext _context;

        public ReviewController(ControldContext context)
        {
            _context = context;
        }

        // GET: api/Review
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews([FromQuery] ReviewQuery query)
        {
            var q = _context.Reviews.AsNoTracking();

            q = ApplyFilters(q, query);

            var total = await q.CountAsync();

            q = ApplySort(q, query);

            var items = await q
                .Skip(query.Skip)
                .Take(query.ClampedPageSize)
                .ToListAsync();

            return items;
        }

        // GET: api/Review/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(long id)
        {
            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
            {
                return NotFound();
            }

            return review;
        }

        // PUT: api/Review/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(long id, Review review)
        {
            if (id != review.ReviewId)
            {
                return BadRequest();
            }

            _context.Entry(review).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id))
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

        // POST: api/Review
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            //Add review
            _context.Reviews.Add(review);
            //Update game review stats
            Game game = await _context.Games.FindAsync(review.GameId);
            game.ReviewCount += 1;
            game.RatingTotal += review.Rating;
            _context.Entry(game).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReview", new { id = review.ReviewId }, review);
        }

        // DELETE: api/Review/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(long id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }
            //Update game review stats
            Game game = await _context.Games.FindAsync(review.GameId);
            game.ReviewCount -= 1;
            game.RatingTotal -= review.Rating;
            _context.Entry(game).State = EntityState.Modified;
            //Remove review
            _context.Reviews.Remove(review);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReviewExists(long id)
        {
            return _context.Reviews.Any(e => e.ReviewId == id);
        }
    
    private static IQueryable<Review> ApplyFilters(IQueryable<Review> query, ReviewQuery q)
        {
            if(q.ForGame != -1)
                query = query.Where(r =>
                    r.GameId == q.ForGame
                );
            
            if(q.ByAccount != -1)
                query = query.Where(r =>
                    r.AccountId == q.ByAccount
                );

            if(q.ExcludeAccount != -1)
                query = query.Where(r =>
                    r.AccountId != q.ExcludeAccount
                );

            if(!string.IsNullOrWhiteSpace(q.Search))
                query = query.Where(r => 
                    r.Title.Contains(q.Search) ||
                    r.Body.Contains(q.Search)
                );

            return query;
        }

        private static IQueryable<Review> ApplySort(IQueryable<Review> query, ReviewQuery q)
        {
            var ascending = q.SortDir.Equals("asc", StringComparison.OrdinalIgnoreCase);
            return q.SortBy.ToLower() switch
            {
                "topliked" => ascending ? query.OrderBy(r => r.Likes) : query.OrderByDescending(r => r.Likes),
                "date" => ascending ? query.OrderBy(r => r.ReviewDate) : query.OrderByDescending(r => r.ReviewDate),
                "name" => ascending ? query.OrderBy(r => r.Title) : query.OrderByDescending(r => r.Title),
                _ => query.OrderByDescending(r => r.Likes)
            };
        }
    }

    public record ReviewQuery(
        long ForGame = -1,
        long ByAccount = -1,
        long ExcludeAccount = -1,
        string Search = null,
        string SortBy = "topLiked",
        string SortDir = "desc",
        int Page = 1,
        int PageSize = 10
    )
    {
        public int ClampedPageSize => Math.Min(PageSize, 10);
        public int Skip => (Page - 1) * ClampedPageSize;
    }
}
