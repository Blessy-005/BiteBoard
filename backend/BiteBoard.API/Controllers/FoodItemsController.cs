
using BiteBoard.API.DTOs.FoodItem;
using BiteBoard.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BiteBoard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodItemsController : ControllerBase
    {
        private readonly IFoodItemService _foodItemService;

        public FoodItemsController(IFoodItemService foodItemService)
        {
            _foodItemService = foodItemService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFoodItem(CreateFoodItemDto dto)
        {
            try
            {
                var foodItem = await _foodItemService.CreateFoodItemAsync(dto);

                return StatusCode(201, foodItem);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFoodItems(
            [FromQuery] string? search,
            [FromQuery] int? categoryId)
        {
            var foodItems = await _foodItemService.GetAllFoodItemsAsync(
                search,
                categoryId);

            return Ok(foodItems);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetFoodItemById(int id)
        {
            var foodItem = await _foodItemService.GetFoodItemByIdAsync(id);

            if (foodItem == null)
                return NotFound(new { message = "Food item not found." });

            return Ok(foodItem);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateFoodItem(
            int id,
            UpdateFoodItemDto dto)
        {
            try
            {
                var foodItem = await _foodItemService.UpdateFoodItemAsync(id, dto);

                if (foodItem == null)
                    return NotFound(new { message = "Food item not found." });

                return Ok(foodItem);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteFoodItem(int id)
        {
            var deleted = await _foodItemService.DeleteFoodItemAsync(id);

            if (!deleted)
                return NotFound(new { message = "Food item not found." });

            return NoContent();
        }
    }
}
