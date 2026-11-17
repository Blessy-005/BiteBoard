using BiteBoard.API.DTOs.Category;
using BiteBoard.API.Models;

namespace BiteBoard.API.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<Category> CreateCategoryAsync(CreateCategoryDto dto);
    }
}