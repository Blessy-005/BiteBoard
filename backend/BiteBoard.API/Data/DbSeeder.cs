using BiteBoard.API.Models;
using BiteBoard.API.Services;
using Microsoft.EntityFrameworkCore;

namespace BiteBoard.API.Data
{
    public class DbSeeder
    {
        public static async Task SeedAdminAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var context = scope.ServiceProvider
                .GetRequiredService<AppDbContext>();

            var passwordService = scope.ServiceProvider
                .GetRequiredService<PasswordService>();

            var configuration = scope.ServiceProvider
                .GetRequiredService<IConfiguration>();

            var name = configuration["AdminSeed:Name"];
            var email = configuration["AdminSeed:Email"]?
                .Trim().ToLowerInvariant();
            var password = configuration["AdminSeed:Password"];

            if (string.IsNullOrWhiteSpace(name) ||
                string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password))
            {
                throw new InvalidOperationException(
                    "Admin seed configuration is missing.");
            }

            var existingUser = await context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (existingUser != null)
            {
                if (existingUser.Role != "Admin")
                {
                    throw new InvalidOperationException(
                        "The configured Admin email already belongs to a non-Admin user.");
                }

                return;
            }

            var admin = new User
            {
                Name = name,
                Email = email,
                Role = "Admin",
                IsActive = true
            };

            admin.PasswordHash = passwordService.HashPassword(
                admin, password);

            context.Users.Add(admin);

            await context.SaveChangesAsync();
        }
    }
}
