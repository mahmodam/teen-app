using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
     [Authorize]
    public class PresenceHub: Hub
    {
        private readonly PresenceTracker _presenceTracker;
        public PresenceHub(PresenceTracker presenceTracker)
        {
            _presenceTracker = presenceTracker;
            
        }
       
        public override async Task OnConnectedAsync()
        {
           await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());
           await _presenceTracker.UserConnected(Context.ConnectionId, Context.User.GetUsername());

           var currentUser = await _presenceTracker.GetConnections();
           await Clients.All.SendAsync("GetOnlineUsers", currentUser);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
            
            var currentUsers = await _presenceTracker.GetConnections();
            await Clients.All.SendAsync("GetOnlineUsers", currentUsers);

            await base.OnDisconnectedAsync(exception);
        }
    }
}