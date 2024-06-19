namespace PersonalFinanceManager.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Place { get; set; }
        public string Note { get; set; }
        public string Category { get; set; }
        public string Account { get; set; }
        public decimal Amount { get; set; }
        public int Positive { get; set; }
    }
}