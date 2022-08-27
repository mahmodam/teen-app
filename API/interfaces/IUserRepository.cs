using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.interfaces
{
    public interface IUserRepository
    {
       void Update(AppUser user);

       void DeleteUser(AppUser user);

       Task<bool> SaveAllAsync();

       Task<IEnumerable<AppUser>> GetUsersAsync();

       Task<AppUser> GetUserByIdAsync(int id);

       Task<AppUser> GetUserByUserNameAsync(string username);

       Task<PageList<MemberDto>> GetMembersAsync(UserParams userParams);

       Task<MemberDto> GetMemberAsync(string username);
    }
}