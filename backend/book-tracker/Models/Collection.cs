using System;

namespace book_tracker.Models
{
    public class Collection
    {
        public int Id { get; set; }

        public string UserId { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Name { get; set; }
    }
}
