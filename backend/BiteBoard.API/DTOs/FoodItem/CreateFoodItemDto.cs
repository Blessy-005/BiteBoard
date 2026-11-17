
using System.ComponentModel.DataAnnotations;

namespace BiteBoard.API.DTOs.FoodItem
{
    public class CreateFoodItemDto
    {
        [Required(ErrorMessage = "Food name is required.")]
        [StringLength(100, ErrorMessage = "Food name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Range(0.01, 99999999.99, ErrorMessage = "Price must be greater than zero.")]
        public decimal Price { get; set; }

        public string? ImageUrl { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid category.")]
        public int CategoryId { get; set; }

        public bool IsAvailable { get; set; } = true;
    }
}
