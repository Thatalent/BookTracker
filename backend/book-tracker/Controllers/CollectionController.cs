using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using book_tracker.Common;
using book_tracker.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace book_tracker.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CollectionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CollectionController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("{userId}")]
        public async Task CreateCollection(Collection collection)
        {
            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();
        }

        [HttpGet("{userId}")]
        public async Task<List<Collection>> GetCollections(string userId)
        {
            return await _context.Collections
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        [HttpGet("{id}/{userId}")]
        public async Task<Collection> GetCollection(int id, string userId)
        {
            return await _context.Collections
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        }

        [HttpPut("{userId}")]
        public async Task UpdateCollection(Collection collection, string userId)
        {
            var entity = await _context.Collections
                .FirstOrDefaultAsync(x => x.Id == collection.Id && x.UserId == userId);

            if (entity is null)
            {
                throw new NotFoundException(nameof(Collection), collection.Id);
            }

            _context.Collections.Update(collection);
            await _context.SaveChangesAsync();
        }

        [HttpDelete("{id}/{userId}")]
        public async Task DeleteCollection(int id, string userId)
        {
            var entity = await _context.Collections
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (entity is null)
            {
                throw new NotFoundException(nameof(Collection), id);
            }

            _context.Collections.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
