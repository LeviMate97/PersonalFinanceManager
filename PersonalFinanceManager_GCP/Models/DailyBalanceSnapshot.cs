using Google.Cloud.Firestore;

namespace PersonalFinanceManager.Models
{
    [FirestoreData]
    public class DailyBalanceSnapshotInsert
    {
        [FirestoreProperty]
        public DateTime SnapshotDate { get; set; }

        [FirestoreProperty]
        public double TotalBalance { get; set; }
    }

    [FirestoreData]
    public class DailyBalanceSnapshot : DailyBalanceSnapshotInsert
    {
        [FirestoreDocumentId]
        public string Id { get; set; }
    }
}
