using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    
    public class UsersController : BaseApiController
    {
      
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _userRepository = userRepository;
            _mapper = mapper;
        }
       

        [HttpPut]

        public async Task<IActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            _mapper.Map(memberUpdateDto, user);
            _userRepository.Update(user);
            if(await _userRepository.SaveAllAsync()){
                return NoContent();
            }
            return BadRequest("Could not update user");
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<PageList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
           
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
            userParams.CurrentUsername = user.UserName;

            var users = await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            
            return Ok(users);
        }

        [Authorize]
        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
       
        var userToReturn = await _userRepository.GetMemberAsync(username);

           return Ok(userToReturn);
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file){
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            var result = await _photoService.UploadPhotoAsync(file);
            if(result.Error != null){
                return BadRequest(result.Error.Message);
            }
            var photo = new Photo{
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if(user.Photos.Count == 0){
                photo.IsMain = true;
            }
            user.Photos.Add(photo);
            if(await _userRepository.SaveAllAsync()){
                return CreatedAtRoute("GetUser", new {username = user.UserName}, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photos");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId){
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
            if(photo.IsMain){
                return BadRequest("This is already the main photo");
            }
            var currentMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);
            if(currentMainPhoto != null){
                currentMainPhoto.IsMain = false;
            }
            photo.IsMain = true;
            if(await _userRepository.SaveAllAsync()){
                return NoContent();
            }
            return BadRequest("Could not set photo to main");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId){
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if(photo == null){
                return BadRequest("Photo not found");
            }
            if(photo.IsMain){
                return BadRequest("You cannot delete your main photo");
            }
            if(photo.PublicId != null){
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null){
                    return BadRequest(result.Error.Message);
                }
            }
             user.Photos.Remove(photo);
             if(await _userRepository.SaveAllAsync()){
                 return Ok();
             }
             return BadRequest("Failed to delete photo");
        }
        
    }
}