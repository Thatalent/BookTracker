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
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task CreateBook(Book book)
        {
            var userId = HttpContext.GetUserId();
            book.UserId = userId;
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
        }

        [HttpGet]
        public async Task<List<Book>> GetBooks()
        {
            var userId = HttpContext.GetUserId();

            return await _context.Books
                .Include(x => x.Collection)
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<Book> GetBook(int id)
        {
            var userId = HttpContext.GetUserId();

            return await _context.Books
                .Include(x => x.Collection)
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        }

        [HttpPut]
        public async Task UpdateBook(Book book)
        {
            var userId = HttpContext.GetUserId();

            var entity = await _context.Books
                .Include(x => x.Collection)
                .FirstOrDefaultAsync(x => x.Id == book.Id && x.UserId == userId);

            if (entity is null)
            {
                throw new NotFoundException(nameof(Book), book.Id);
            }

            entity.Author = book.Author;
            entity.CollectionId = book.CollectionId;
            entity.CoverImageUrl = book.CoverImageUrl;
            entity.Genre = book.Genre;
            entity.Pages = book.Pages;
            entity.Publisher = book.Publisher;
            entity.Read = book.Read;
            entity.Title = book.Title;
            entity.YearPublished = book.YearPublished;

            _context.Books.Update(entity);
            await _context.SaveChangesAsync();
        }

        [HttpDelete("{id}")]
        public async Task DeleteBook(int id)
        {
            var userId = HttpContext.GetUserId();

            var entity = await _context.Books
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (entity is null)
            {
                throw new NotFoundException(nameof(Book), id);
            }

            _context.Books.Remove(entity);
            await _context.SaveChangesAsync();
        }

        [HttpPost("{id}/collection/{collectionId}")]
        public async Task AddBookToCollection(int id, int collectionId)
        {
            var userId = HttpContext.GetUserId();

            var bookEntity = await _context.Books
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (bookEntity is null)
            {
                throw new NotFoundException(nameof(Book), id);
            }

            var collectionEntity = await _context.Collections
                .FirstOrDefaultAsync(x => x.Id == collectionId && x.UserId == userId);

            if (collectionEntity is null)
            {
                throw new NotFoundException(nameof(Collection), id);
            }

            bookEntity.CollectionId = collectionId;

            _context.Books.Update(bookEntity);
            await _context.SaveChangesAsync();
        }
    }
}
