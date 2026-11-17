using BiteBoard.API.Data;
using BiteBoard.API.DTOs.User;
using BiteBoard.API.Models;
using BiteBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiteBoard.API.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly PasswordService _passwordService;

        public UserService(
            AppDbContext context,
            PasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        public async Task<UserResponseDto> CreateStaffAsync(
            CreateStaffDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();

            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == email);

            if (emailExists)
            {
                throw new InvalidOperationException(
                    "An account with this email already exists.");
            }

            var staff = new User
            {
                Name = dto.Name.Trim(),
                Email = email,
                Role = "Staff",
                IsActive = true
            };

            staff.PasswordHash = _passwordService.HashPassword(
                staff,
                dto.Password);

            _context.Users.Add(staff);

            await _context.SaveChangesAsync();

            return MapToResponseDto(staff);
        }

        public async Task<List<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _context.Users
                .OrderBy(u => u.Id)
                .ToListAsync();

            return users.Select(MapToResponseDto).ToList();
        }

        public async Task<UserResponseDto?> UpdateUserStatusAsync(
            int id,
            bool isActive)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return null;
            }

            if (user.Role == "Admin")
            {
                throw new InvalidOperationException(
                    "Admin account status cannot be changed here.");
            }

            user.IsActive = isActive;

            await _context.SaveChangesAsync();

            return MapToResponseDto(user);
        }

        private static UserResponseDto MapToResponseDto(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive
            };
        }
    }
}
