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
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("{userId}")]
        public async Task CreateBook(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
        }

        [HttpGet("{userId}")]
        public async Task<List<Book>> GetBooks(string userId)
        {
            return await _context.Books
                .Include(x => x.Collection)
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        [HttpGet("{id}/{userId}")]
        public async Task<Book> GetBook(int id, string userId)
        {
            return await _context.Books
                .Include(x => x.Collection)
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        }

        [HttpPut("{userId}")]
        public async Task UpdateBook(Book book, string userId)
        {
            var entity = await _context.Books
                .Include(x => x.Collection)
                .FirstOrDefaultAsync(x => x.Id == book.Id && x.UserId == userId);

            if (entity is null)
            {
                throw new NotFoundException(nameof(Book), book.Id);
            }

            _context.Books.Update(book);
            await _context.SaveChangesAsync();
        }

        [HttpDelete("{id}/{userId}")]
        public async Task DeleteBook(int id, string userId)
        {
            var entity = await _context.Books
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (entity is null)
            {
                throw new NotFoundException(nameof(Book), id);
            }

            _context.Books.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
