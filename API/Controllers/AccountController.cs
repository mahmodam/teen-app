using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly ILogger<AccountController> _logger;

        private readonly DataContext _context;

        public AccountController(DataContext context)
        {
            this._context = context;
        }

        [HttpPost("register")]

        public async Task<ActionResult<AppUser>> Register( RegisterDto registerDto)
        {
            // אלגוריתם לסיסמה ליצירת האש מתוך הסיסמה
            using var hmac = new HMACSHA512();
            // בדיקה אם משתמש קיים
            if(await UserExists(registerDto.Username)) return BadRequest("Username alredy exists");
            // יצירת משתמש
            var user = new AppUser 
            {
                
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

              _context.Users.Add(user);
              await _context.SaveChangesAsync();

              return user;
        }

         [HttpPost("login")] // api/account/login
        public async Task<ActionResult<AppUser>> Login(LoginDto loginDto )
        {
            var user = await this._context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
            if(user == null) return Unauthorized("invalid username");
            // שחזור הסיסמה של הלקוח באמצעות Passwordsalt
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var ComputedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));
            // בדיקה אם הם שווים
            for (int i = 0; i < ComputedHash.Length; i++)
            {
                if(ComputedHash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");
            }

            return user;
        }



        // פונקציה לוודות שאין כפלויות של משתמשים
         private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }

    }
}