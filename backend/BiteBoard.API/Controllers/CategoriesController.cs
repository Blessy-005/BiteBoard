
using BiteBoard.API.DTOs.Category;
using BiteBoard.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BiteBoard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
        {
            try
            {
                var category = await _categoryService.CreateCategoryAsync(dto);
                return StatusCode(201, category);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCategory(
            int id,
            UpdateCategoryDto dto)
        {
            try
            {
                var category = await _categoryService.UpdateCategoryAsync(id, dto);

                if (category == null)
                    return NotFound(new { message = "Category not found." });

                return Ok(category);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var deleted = await _categoryService.DeleteCategoryAsync(id);

                if (!deleted)
                    return NotFound(new { message = "Category not found." });

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }
}
