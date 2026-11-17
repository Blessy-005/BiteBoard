namespace BiteBoard.API.DTOs.Dashboard
{
    public class DashboardStatsDto
    {
        public int TotalFoodItems { get; set; }

        public int TotalCategories { get; set; }

        public int AvailableFoodItems { get; set; }

        public int UnavailableFoodItems { get; set; }
    }
}