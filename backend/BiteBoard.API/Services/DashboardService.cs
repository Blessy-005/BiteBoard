using BiteBoard.API.Data;
using BiteBoard.API.DTOs.Dashboard;
using BiteBoard.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiteBoard.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            return new DashboardStatsDto
            {
                TotalFoodItems = await _context.FoodItems.CountAsync(),

                TotalCategories = await _context.Categories.CountAsync(),

                AvailableFoodItems = await _context.FoodItems
                    .CountAsync(f => f.IsAvailable),

                UnavailableFoodItems = await _context.FoodItems
                    .CountAsync(f => !f.IsAvailable)
            };
        }
    }
}