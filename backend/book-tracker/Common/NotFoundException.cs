using System;

namespace book_tracker.Common
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string name, int key)
            : base($"Entity \"{name}\" ({key}) was not found.")
        { }
    }
}
