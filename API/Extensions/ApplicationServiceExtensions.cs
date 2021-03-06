using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Helpers;
using API.interfaces;
using API.Services;
using API.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
         public static IServiceCollection AddApplicationServices(this IServiceCollection services , IConfiguration config)
        {
            services.AddSingleton<PresenceTracker>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<LogUserActivity>();
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<IPhotoService, PhotoService>();
            // jwt
            services.AddScoped<ITokenService, TokenService>();

            services.AddScoped<IUserRepository, UserRepository>();

            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

            services.AddDbContext<DataContext>(options =>
            options.UseSqlite(config.GetConnectionString("DefaultConnection")));

            return services;
        }
    }
}