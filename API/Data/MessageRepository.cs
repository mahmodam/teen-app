using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }
        

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                .OrderByDescending(m => m.MessageSent)
                .AsQueryable();

                query = messageParams.Container switch
                {
                    "Inbox" => query.Where(m => m.Recipient.UserName == messageParams.Username),
                    "Outbox" => query.Where(m => m.Sender.UserName == messageParams.Username),
                    _ => query.Where(m => m.Recipient.UserName == messageParams.Username && m.DateRead == null)
                };

                query = query.Where(m => m.Recipient.UserName == messageParams.Username && !m.RecipientDeleted ||
                            m.Sender.UserName == messageParams.Username && !m.SenderDeleted);

                var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

                return await PageList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentusername, string recipientUsername)
        {
            var messages = await _context.Messages
                .Include(x => x.Sender).ThenInclude(x => x.Photos)
                .Include(x => x.Recipient).ThenInclude(x => x.Photos)
                .Where(m => m.Recipient.UserName == currentusername && m.Sender.UserName == recipientUsername ||
                            m.Recipient.UserName == recipientUsername && m.Sender.UserName == currentusername)
                .Where(m => m.Recipient.UserName == currentusername && !m.RecipientDeleted ||
                            m.Sender.UserName == currentusername && !m.SenderDeleted)
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

                var unReadMessages = messages.Where(m => m.Recipient.UserName == currentusername && m.DateRead == null ).ToList();

                if(unReadMessages.Any()){
                    foreach(var message in unReadMessages){
                        message.DateRead = DateTime.Now;
                    }
                    await _context.SaveChangesAsync();
                }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
            
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}