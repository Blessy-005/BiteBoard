using System.ComponentModel.DataAnnotations;
namespace BiteBoard.API.DTOs.Category

{
    public class CreateCategoryDto
    {
        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}