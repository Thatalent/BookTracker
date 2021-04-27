namespace book_tracker.Models
{
    public class Book
    {
        public int Id { get; set; }

        public string UserId { get; set; }

        public string Author { get; set; }

        public int CollectionId { get; set; }
        public Collection Collection { get; set; }

        public string CoverImageUrl { get; set; }

        public string Genre { get; set; }

        public int Pages { get; set; }

        public string Publisher { get; set; }

        public bool Read { get; set; }

        public int YearPublished { get; set; }
    }
}
