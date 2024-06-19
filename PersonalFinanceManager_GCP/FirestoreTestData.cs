using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public static class FirestoreTestData
{
    public static async Task AddTestData(FirestoreDb db)
    {
        // Create test data for accounts
        var accounts = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>
            {
                { "AccountAmount", 1000 },
                { "AccountName", "CASH" }
            },
            new Dictionary<string, object>
            {
                { "AccountAmount", 5000 },
                { "AccountName", "ING" }
            },
            new Dictionary<string, object>
            {
                { "AccountAmount", 2000 },
                { "AccountName", "CREDIT CARD" }
            }
        };

        // Create test data for categories
        var categories = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>
            {
                { "Name", "Groceries" }
            },
            new Dictionary<string, object>
            {
                { "Name", "Utilities" }
            },
            new Dictionary<string, object>
            {
                { "Name", "Entertainment" }
            },
            new Dictionary<string, object>
            {
                { "Name", "Transportation" }
            },
            new Dictionary<string, object>
            {
                { "Name", "Health" }
            },
            new Dictionary<string, object>
            {
                { "Name", "Education" }
            },
            new Dictionary<string, object>
            {
                { "Name", "Dining" }
            },
            new Dictionary<string, object>
            {
                { "Name", "Shopping" }
            }
        };

        // Create test data for transactions
        var transactions = new List<Dictionary<string, object>>();
        var random = new Random();
        var accountsList = new List<string> { "CASH", "ING", "CREDIT CARD" };
        var categoriesList = new List<string> { "Groceries", "Utilities", "Entertainment", "Transportation", "Health", "Education", "Dining", "Shopping" };

        for (int i = 0; i < 30; i++)
        {
            var transaction = new Dictionary<string, object>
            {
                { "Account", accountsList[random.Next(accountsList.Count)] },
                { "Amount", random.Next(10, 1000) },
                { "Category", categoriesList[random.Next(categoriesList.Count)] },
                { "Date", Timestamp.FromDateTime(DateTime.SpecifyKind(DateTime.UtcNow.AddDays(-random.Next(30)), DateTimeKind.Utc)) },
                { "Note", $"Transaction note {i + 1}" },
                { "Place", $"Place {i + 1}" },
                { "Positive", random.Next(0, 2) }
            };
            transactions.Add(transaction);
        }

        // Create test data for daily balance snapshots
        var dailyBalanceSnapshots = new List<Dictionary<string, object>>();
        for (int i = 0; i < 10; i++)
        {
            var snapshot = new Dictionary<string, object>
            {
                { "SnapshotDate", Timestamp.FromDateTime(DateTime.SpecifyKind(DateTime.UtcNow.AddDays(-i), DateTimeKind.Utc)) },
                { "TotalBalance", random.Next(1000, 20000) }
            };
            dailyBalanceSnapshots.Add(snapshot);
        }

        // Add data to Firestore
        await AddDataToCollection(db, "accounts", accounts);
        await AddDataToCollection(db, "categories", categories);
        await AddDataToCollection(db, "transactions", transactions);
        await AddDataToCollection(db, "dailyBalanceSnapshots", dailyBalanceSnapshots);

        Console.WriteLine("Test data added successfully.");
    }

    private static async Task AddDataToCollection(FirestoreDb db, string collectionName, List<Dictionary<string, object>> items)
    {
        CollectionReference collectionRef = db.Collection(collectionName);
        WriteBatch batch = db.StartBatch();

        foreach (var item in items)
        {
            DocumentReference documentRef = collectionRef.Document();
            batch.Set(documentRef, item);
        }

        await batch.CommitAsync();
    }
}
