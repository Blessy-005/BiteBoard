
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
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Category name is required.");

            var categoryName = dto.Name.Trim();

            bool exists = await _context.Categories
                .AnyAsync(c => c.Name.ToLower() == categoryName.ToLower());

            if (exists)
                throw new InvalidOperationException("Category already exists.");

            var category = new Category
            {
                Name = categoryName,
                Description = dto.Description?.Trim()
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<Category?> UpdateCategoryAsync(
            int id,
            UpdateCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Category name is required.");

            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return null;

            var categoryName = dto.Name.Trim();

            bool exists = await _context.Categories
                .AnyAsync(c => c.Id != id &&
                    c.Name.ToLower() == categoryName.ToLower());

            if (exists)
                throw new InvalidOperationException("Category already exists.");

            category.Name = categoryName;
            category.Description = dto.Description?.Trim();

            await _context.SaveChangesAsync();

            return category;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return false;

            bool hasFoodItems = await _context.FoodItems
                .AnyAsync(f => f.CategoryId == id);

            if (hasFoodItems)
            {
                throw new InvalidOperationException(
                    "Cannot delete this category because it contains food items.");
            }

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
