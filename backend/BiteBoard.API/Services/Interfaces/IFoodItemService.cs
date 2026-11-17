
using BiteBoard.API.DTOs.FoodItem;
using BiteBoard.API.Models;

namespace BiteBoard.API.Services.Interfaces
{
    public interface IFoodItemService
    {
        Task<FoodItem> CreateFoodItemAsync(CreateFoodItemDto dto);

        Task<List<FoodItem>> GetAllFoodItemsAsync(
            string? search,
            int? categoryId);

        Task<FoodItem?> GetFoodItemByIdAsync(int id);

        Task<FoodItem?> UpdateFoodItemAsync(int id, UpdateFoodItemDto dto);

        Task<bool> DeleteFoodItemAsync(int id);
    }
}
