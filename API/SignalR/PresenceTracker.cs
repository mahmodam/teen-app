using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnlineUsers = new Dictionary<string, List<string>>();

        public Task UserConnected(string connectionId, string userName)
        {
            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(userName))
                {
                    OnlineUsers.Add(userName, new List<string>());
                }

                OnlineUsers[userName].Add(connectionId);
            }
            return Task.CompletedTask;
        }

        public Task UserDisconnected(string connectionId, string userName)
        {
            lock (OnlineUsers)
            {

                if (!OnlineUsers.ContainsKey(userName))
                {
                    return Task.CompletedTask;
                }

                OnlineUsers[userName].Remove(connectionId);

                if (OnlineUsers[userName].Count.Equals(0))
                {
                    OnlineUsers.Remove(userName);
                }
            }
            return Task.CompletedTask;
        }

        public Task<string[]> GetConnections()
        {
            string[] Connections;
            lock (OnlineUsers)
            {
                Connections = OnlineUsers.OrderBy(x => x.Key).Select(x => x.Key).ToArray();
            }
            return Task.FromResult(Connections);
        }
    }
}