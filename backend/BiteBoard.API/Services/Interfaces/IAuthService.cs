using BiteBoard.API.DTOs.Auth;

namespace BiteBoard.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);

        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    }
}