using BiteBoard.API.DTOs.User;
using BiteBoard.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiteBoard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("staff")]
        public async Task<IActionResult> CreateStaff(CreateStaffDto dto)
        {
            try
            {
                var staff = await _userService.CreateStaffAsync(dto);

                return StatusCode(201, staff);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();

            return Ok(users);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> UpdateUserStatus(
            int id,
            [FromQuery] bool isActive)
        {
            try
            {
                var user = await _userService.UpdateUserStatusAsync(
                    id,
                    isActive);

                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
