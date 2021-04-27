using book_tracker.Models;
using Microsoft.EntityFrameworkCore;

namespace book_tracker
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<Book> Books { get; set; }

        public DbSet<Collection> Collections { get; set; }
    }
}