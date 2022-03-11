using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PageList<T> : List<T>
    {
        public PageList(
            IEnumerable<T> items,
            int count,
            int pageNumber,
            int pageSize
        )
        {
           this.CurrentPage = pageNumber;
           // Math.ceiling => כדי שלא יתעלם מהשארית שלא מספר שלם
           this.TotalPages = (int) Math.Ceiling(count / (float)pageSize);
           this.PageSize = pageSize;
           this.TotalCount = count;
           AddRange(items);
        }
        
       
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        // פונקציה static כי אנחנו לא צריכים ליצור אובייקט מחדש כדי להשתמש בה
        // אפשר להגיע אליה דרך המחלקה
        public static async Task<PageList<T>> CreateAsync(
            // מה שמקבל מהלקוח
            IQueryable<T> source, // the source data
            int pageNumber,
            int pageSize
        ){
            var count = await source.CountAsync();

            // מספר העמוד שנבחר מהלקוח
            var item = await source
            .Skip((pageNumber -1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

            return new PageList<T>(item, count, pageNumber, pageSize);

        }
    }
}