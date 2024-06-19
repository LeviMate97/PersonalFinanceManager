using Google.Cloud.Firestore;
using System;

namespace PersonalFinanceManager.Models
{
    [FirestoreData]
    public class TransactionInsert
    {
        private DateTime _date;

        [FirestoreProperty]
        public DateTime Date {
            get => _date;
            set => _date = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }

        [FirestoreProperty]
        public string Place { get; set; }

        [FirestoreProperty]
        public string Note { get; set; }

        [FirestoreProperty]
        public string Category { get; set; }

        [FirestoreProperty]
        public string Account { get; set; }

        [FirestoreProperty]
        public double Amount { get; set; }

        [FirestoreProperty]
        public int Positive { get; set; }
    }

    [FirestoreData]
    public class Transaction : TransactionInsert
    {
        [FirestoreDocumentId]
        public string Id { get; set; }
    }
}