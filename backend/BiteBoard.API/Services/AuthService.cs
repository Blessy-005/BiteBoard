using BiteBoard.API.Data;
using BiteBoard.API.DTOs.Auth;
using BiteBoard.API.Models;
using BiteBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BiteBoard.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly PasswordService _passwordService;
        private readonly IConfiguration _configuration;

        public AuthService(
            AppDbContext context,
            PasswordService passwordService,
            IConfiguration configuration)
        {
            _context = context;
            _passwordService = passwordService;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var email = registerDto.Email.Trim().ToLowerInvariant();

            var existingUser = await _context.Users
                .AnyAsync(u => u.Email == email);

            if (existingUser)
            {
                throw new InvalidOperationException(
                    "An account with this email already exists.");
            }

            var user = new User
            {
                Name = registerDto.Name.Trim(),
                Email = email,
                Role = "Customer",
                IsActive = true
            };

            user.PasswordHash = _passwordService.HashPassword(
                user,
                registerDto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return GenerateAuthResponse(user);
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var email = loginDto.Email.Trim().ToLowerInvariant();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !user.IsActive)
            {
                return null;
            }

            var isPasswordValid = _passwordService.VerifyPassword(
                user,
                loginDto.Password);

            if (!isPasswordValid)
            {
                return null;
            }

            return GenerateAuthResponse(user);
        }

        private AuthResponseDto GenerateAuthResponse(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var secretKey = jwtSettings["SecretKey"]
                ?? throw new InvalidOperationException("JWT SecretKey is missing.");

            var issuer = jwtSettings["Issuer"]
                ?? throw new InvalidOperationException("JWT Issuer is missing.");

            var audience = jwtSettings["Audience"]
                ?? throw new InvalidOperationException("JWT Audience is missing.");

            var expiryMinutes = int.Parse(
                jwtSettings["ExpiryMinutes"]
                ?? throw new InvalidOperationException("JWT ExpiryMinutes is missing."));

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials);

            var tokenString = new JwtSecurityTokenHandler()
                .WriteToken(token);

            return new AuthResponseDto
            {
                Token = tokenString,
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}