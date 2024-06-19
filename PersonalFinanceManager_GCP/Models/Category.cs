using Google.Cloud.Firestore;

namespace PersonalFinanceManager.Models
{
    [FirestoreData]
    public class CategoryInsert
    {
        [FirestoreProperty]
        public string Name { get; set; }
    }

    [FirestoreData]
    public class Category : CategoryInsert
    {
        [FirestoreDocumentId]
        public string Id { get; set; }
    }
}
