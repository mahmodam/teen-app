using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
   
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _context;
        
        public BuggyController(DataContext context)
        {
            _context = context;
            
        }

        [Authorize]
        [HttpGet("auth")]
        // 401 unauthorized
        public ActionResult<string> GetSecret(){
            return "Secret string";
        }

        [HttpGet("not-found")]
         // 404 not found
        public ActionResult<AppUser> GetNotFound(){
           var thing = _context.Users.Find(-1);
           if(thing == null){
               return NotFound();
           } 
           return Ok();
        }

        [HttpGet("server-error")]
        // 500 server error
        public ActionResult<string> GetServerError(){
            var thing = _context.Users.Find(-1);
            var thingToString = thing.ToString();
            return thingToString;
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest(){
            return BadRequest("this was not good request");
        }

    }
}