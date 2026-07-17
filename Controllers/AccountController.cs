using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// dotnet aspnet-codegenerator controller -name TodoItemsController -async -api -m TodoItem -dc TodoContext -outDir Controllers

namespace ControlDWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ControldContext _context;

        public AccountController(ControldContext context)
        {
            _context = context;
        }

        // GET: api/Account
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDTO>>> GetAccounts()
        {
            return await _context.Accounts
                .Select(x => AccountToDTO(x))
                .ToListAsync();
        }

        // GET: api/Account/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AccountDTO>> GetAccount(long id)
        {
            var account = await _context.Accounts
                .Include(a => a.FavoriteGames).ThenInclude(g => g.Publisher)
                .Include(a => a.Followers)
                .Include(a => a.Following)
                .Select(a => new AccountDTO
                {
                    AccountId = a.AccountId,
                    Email = a.Email,
                    Username = a.Username,
                    FavoriteGames = a.FavoriteGames.Select(g => new Game{GameId=g.GameId, Name=g.Name, Publisher=g.Publisher, ReviewCount=g.ReviewCount, RatingTotal=g.RatingTotal}).ToArray(),
                    Followers = a.Followers.Select(f => new Account{AccountId=f.AccountId, Username=f.Username}).ToArray(),
                    Following = a.Following.Select(f => new Account{AccountId=f.AccountId, Username=f.Username}).ToArray()
                })
                .FirstOrDefaultAsync(a => a.AccountId == id);

            if (account == null)
            {
                return NotFound();
            }

            return account;//AccountToDTO(account);
        }

        // PUT: api/Account/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount(long id, AccountDTO account)
        {
            if (id != account.AccountId)
            {
                return BadRequest();
            }

            _context.Entry(account).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(id))
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

        [HttpDelete("{id}/FavoriteGame/{gameId}")]
        public async Task<IActionResult> RemoveFavoriteGame(long id, long gameId)
        {
            //TODO: add security to ensure person is signed into this account
            var account = await _context.Accounts.Include(a => a.FavoriteGames).FirstOrDefaultAsync(a => a.AccountId == id);
            if(account == null)
            {
                return BadRequest();
            }

            var game = account.FavoriteGames.FirstOrDefault(g => g.GameId == gameId);
            if(game == null)
            {
                return BadRequest();
            }

            var hm = account.FavoriteGames.Remove(game);
            _context.Entry(account).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/FavoriteGame")]
        public async Task<IActionResult> AddFavoriteGame(long id, Game game)
        {
            //TODO: add security to ensure person is signed into this account
            var account = await _context.Accounts.Include(a => a.FavoriteGames).FirstOrDefaultAsync(a => a.AccountId == id);
            if(account == null)
            {
                return BadRequest();
            }
            game = await _context.Games.FindAsync(game.GameId);
            if(game == null)
            {
                return BadRequest();
            }
            account.FavoriteGames.Add(game);
            _context.Entry(account).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/Follow/{followId}")]
        public async Task<IActionResult> FollowAccount(long id, long followId)
        {
            var ownAccount = await _context.Accounts.Include(a => a.Following).FirstOrDefaultAsync(a => a.AccountId == id);
            if(ownAccount == null)
            {
                return BadRequest();
            }

            var followAccount = await _context.Accounts.Include(a => a.Followers).FirstOrDefaultAsync(a => a.AccountId == followId);
            if(followAccount == null)
            {
                return BadRequest();
            }

            ownAccount.Following.Add(followAccount);
            followAccount.Followers.Add(ownAccount);
            _context.Entry(ownAccount).State = EntityState.Modified;
            _context.Entry(followAccount).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}/Follow/{followId}")]
        public async Task<IActionResult> UnFollowAccount(long id, long followId)
        {
            var ownAccount = await _context.Accounts.Include(a => a.Following).FirstOrDefaultAsync(a => a.AccountId == id);
            if(ownAccount == null)
            {
                return BadRequest();
            }

            var followAccount = await _context.Accounts.Include(a => a.Followers).FirstOrDefaultAsync(a => a.AccountId == followId);
            if(followAccount == null)
            {
                return BadRequest();
            }

            ownAccount.Following.Remove(followAccount);
            followAccount.Followers.Remove(ownAccount);
            _context.Entry(ownAccount).State = EntityState.Modified;
            _context.Entry(followAccount).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // POST: api/Account
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AccountDTO>> PostAccount(Account account)
        {
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAccount), new { id = account.AccountId }, account);
        }

        // DELETE: api/Account/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(long id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AccountExists(long id)
        {
            return _context.Accounts.Any(e => e.AccountId == id);
        }

        private static AccountDTO AccountToDTO(Account account) =>
            new AccountDTO
            {
                AccountId = account.AccountId,
                Email = account.Email,
                Username = account.Username,
                FavoriteGames = account.FavoriteGames
            };
    }
}
