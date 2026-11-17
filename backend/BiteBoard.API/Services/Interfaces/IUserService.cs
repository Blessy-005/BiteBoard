using BiteBoard.API.DTOs.User;

namespace BiteBoard.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto> CreateStaffAsync(CreateStaffDto dto);

        Task<List<UserResponseDto>> GetAllUsersAsync();

        Task<UserResponseDto?> UpdateUserStatusAsync(
            int id,
            bool isActive);
    }
}