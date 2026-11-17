
using System.ComponentModel.DataAnnotations;

namespace BiteBoard.API.DTOs.Auth
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Enter a valid email address.")]
        [StringLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 8,
            ErrorMessage = "Password must contain at least 8 characters.")]
        public string Password { get; set; } = string.Empty;
    }
}
