using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;

namespace PersonalFinanceManager.Models
{
    [FirestoreData]
    public class AccountInsert
    {
        [FirestoreProperty]
        public string AccountName { get; set; }

        [FirestoreProperty]
        public double AccountAmount { get; set; }
    }

    [FirestoreData]
    public class Account : AccountInsert
    {
        [FirestoreDocumentId]
        public string Id { get; set; }
    }
}
