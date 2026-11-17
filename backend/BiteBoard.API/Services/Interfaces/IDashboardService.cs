using BiteBoard.API.DTOs.Dashboard;

namespace BiteBoard.API.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }
}