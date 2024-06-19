namespace PersonalFinanceManager.Models
{
    public class DailyBalanceSnapshot
    {
        public int Id { get; set; }
        public DateTime SnapshotDate { get; set; }
        public decimal TotalBalance { get; set; }
    }
}
