
using BiteBoard.API.Data;
using BiteBoard.API.DTOs.FoodItem;
using BiteBoard.API.Models;
using BiteBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiteBoard.API.Services
{
    public class FoodItemService : IFoodItemService
    {
        private readonly AppDbContext _context;

        public FoodItemService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<FoodItem> CreateFoodItemAsync(CreateFoodItemDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Food name is required.");

            bool categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.CategoryId);

            if (!categoryExists)
                throw new ArgumentException("Selected category does not exist.");

            var foodItem = new FoodItem
            {
                Name = dto.Name.Trim(),
                Description = dto.Description?.Trim(),
                Price = dto.Price,
                ImageUrl = dto.ImageUrl?.Trim(),
                CategoryId = dto.CategoryId,
                IsAvailable = dto.IsAvailable
            };

            _context.FoodItems.Add(foodItem);
            await _context.SaveChangesAsync();

            return foodItem;
        }

        public async Task<List<FoodItem>> GetAllFoodItemsAsync()
        {
            return await _context.FoodItems
                .Include(f => f.Category)
                .OrderBy(f => f.Name)
                .ToListAsync();
        }

        public async Task<FoodItem?> GetFoodItemByIdAsync(int id)
        {
            return await _context.FoodItems
                .Include(f => f.Category)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<FoodItem?> UpdateFoodItemAsync(
            int id,
            UpdateFoodItemDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Food name is required.");

            var foodItem = await _context.FoodItems.FindAsync(id);

            if (foodItem == null)
                return null;

            bool categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.CategoryId);

            if (!categoryExists)
                throw new ArgumentException("Selected category does not exist.");

            foodItem.Name = dto.Name.Trim();
            foodItem.Description = dto.Description?.Trim();
            foodItem.Price = dto.Price;
            foodItem.ImageUrl = dto.ImageUrl?.Trim();
            foodItem.CategoryId = dto.CategoryId;
            foodItem.IsAvailable = dto.IsAvailable;

            await _context.SaveChangesAsync();

            return foodItem;
        }

        public async Task<bool> DeleteFoodItemAsync(int id)
        {
            var foodItem = await _context.FoodItems.FindAsync(id);

            if (foodItem == null)
                return false;

            _context.FoodItems.Remove(foodItem);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
