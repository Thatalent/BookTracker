using Microsoft.AspNetCore.Http;

namespace book_tracker.Common
{
    public static class UserExtensions
    {
        public static string GetUserId(this HttpContext context)
        {
            return context.User.Identity.Name;
        }
    }
}