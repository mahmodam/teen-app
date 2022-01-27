using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime date){
            var age = DateTime.Today.Year - date.Year;
            if(date.AddYears(age) > DateTime.Today) age--;
            return age;
        }
    }
}