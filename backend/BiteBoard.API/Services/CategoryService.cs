
using BiteBoard.API.Data;
using BiteBoard.API.DTOs.Category;
using BiteBoard.API.Models;
using BiteBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiteBoard.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Category> CreateCategoryAsync(CreateCategoryDto dto)
        {
            // Validate category name
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ArgumentException("Category name is required.");
            }

            // Remove unnecessary spaces
            var categoryName = dto.Name.Trim();

            // Check for duplicate category name
            bool exists = await _context.Categories
                .AnyAsync(c => c.Name.ToLower() == categoryName.ToLower());

            if (exists)
            {
                throw new InvalidOperationException("Category already exists.");
            }

            // Create category object
            var category = new Category
            {
                Name = categoryName,
                Description = dto.Description?.Trim()
            };

            // Save category
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }
    }
}
