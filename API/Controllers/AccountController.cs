using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    
    public class AccountController : BaseApiController
    {

        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            this._context = context;
            this._tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register( RegisterDto registerDto)
        {
            // אלגוריתם לסיסמה ליצירת האש מתוך הסיסמה
            using var hmac = new HMACSHA512();
            if(await UserExists(registerDto.Username)) return BadRequest("Username alredy exists");

            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username;
            user.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;
           
              _context.Users.Add(user);
              await _context.SaveChangesAsync();

              return new UserDto{
                  Username = user.UserName,
                  Token = _tokenService.CreateToken(user),
                  KnownAs = user.KnownAs
              };
        }

         [HttpPost("login")] // api/account/login
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto )
        {
            var user = await this._context.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
            if(user == null) return Unauthorized("invalid username");
            // שחזור הסיסמה של הלקוח באמצעות Passwordsalt
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var ComputedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));
            // בדיקה אם הם שווים
            for (int i = 0; i < ComputedHash.Length; i++)
            {
                if(ComputedHash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");
            }

            return new UserDto{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }



        // פונקציה לוודות שאין כפלויות של משתמשים
         private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }

    }
}