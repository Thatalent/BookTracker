using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using book_tracker.Common;
using book_tracker.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace book_tracker.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CollectionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CollectionController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task CreateCollection(Collection collection)
        {
            var userId = HttpContext.GetUserId();
            collection.UserId = userId;
            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();
        }

        [HttpGet]
        public async Task<List<Collection>> GetCollections()
        {
            var userId = HttpContext.GetUserId();

            return await _context.Collections
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<Collection> GetCollection(int id)
        {
            var userId = HttpContext.GetUserId();

            return await _context.Collections
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        }

        [HttpPut]
        public async Task UpdateCollection(Collection collection)
        {
            var userId = HttpContext.GetUserId();

            var entity = await _context.Collections
                .FirstOrDefaultAsync(x => x.Id == collection.Id && x.UserId == userId);

            if (entity is null)
            {
                throw new NotFoundException(nameof(Collection), collection.Id);
            }

            entity.Name = collection.Name;

            _context.Collections.Update(entity);
            await _context.SaveChangesAsync();
        }

        [HttpDelete("{id}")]
        public async Task DeleteCollection(int id)
        {
            var userId = HttpContext.GetUserId();

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
