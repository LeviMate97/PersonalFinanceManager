using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Transaction = PersonalFinanceManager.Models.Transaction;

namespace PersonalFinanceManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly FirestoreDb _db;

        public TransactionsController(FirestoreDb db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetTransactions()
        {
            CollectionReference collectionReference = _db.Collection("transactions");
            Console.WriteLine(collectionReference);
            QuerySnapshot querySnapshot = await collectionReference.GetSnapshotAsync();


            List<Transaction> transactions = new List<Transaction>();
            foreach (DocumentSnapshot documentSnapshot in querySnapshot.Documents)
            {
                Transaction transaction = documentSnapshot.ConvertTo<Transaction>();
                transactions.Add(transaction);
            }

            return Ok(transactions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransaction(string id)
        {
            DocumentReference docRef = _db.Collection("transactions").Document(id);
            DocumentSnapshot documentSnapshot = await docRef.GetSnapshotAsync();

            if (documentSnapshot.Exists)
            {
                Transaction transaction = documentSnapshot.ConvertTo<Transaction>();

                return Ok(transaction);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(string id, TransactionInsert transaction)
        {
            DocumentReference docRef = _db.Collection("transactions").Document(id);
            await docRef.SetAsync(transaction, SetOptions.Overwrite);
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(TransactionInsert transaction)
        {
            transaction.Date = DateTime.SpecifyKind(transaction.Date, DateTimeKind.Utc);
            CollectionReference collectionReference = _db.Collection("transactions");
            await collectionReference.AddAsync(transaction);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(string id)
        {
            DocumentReference docRef = _db.Collection("transactions").Document(id);
            await docRef.DeleteAsync();
            return NoContent();
        }

        [HttpGet("totalSpendMonth")]
        public async Task<ActionResult<double>> GetTotalSpendMonth()
        {
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            Query spendQuery = _db.Collection("transactions")
                .WhereGreaterThanOrEqualTo("Date", Timestamp.FromDateTime(startDate.ToUniversalTime()))
                .WhereLessThan("Date", Timestamp.FromDateTime(endDate.ToUniversalTime()))
                .WhereEqualTo("Positive", 0);

            QuerySnapshot spendSnapshot = await spendQuery.GetSnapshotAsync();
            double totalSpend = spendSnapshot.Documents
                .Sum(doc => doc.GetValue<double>("Amount"));

            return Ok(totalSpend);
        }

        [HttpGet("totalSpendYear")]
        public async Task<ActionResult<double>> GetTotalSpendYear()
        {
            var startDate = new DateTime(DateTime.Now.Year, 1, 1);
            var endDate = startDate.AddYears(1);

            Query spendQuery = _db.Collection("transactions")
                .WhereGreaterThanOrEqualTo("Date", Timestamp.FromDateTime(startDate.ToUniversalTime()))
                .WhereLessThan("Date", Timestamp.FromDateTime(endDate.ToUniversalTime()))
                .WhereEqualTo("Positive", 0);

            QuerySnapshot spendSnapshot = await spendQuery.GetSnapshotAsync();
            double totalSpend = spendSnapshot.Documents
                .Sum(doc => doc.GetValue<double>("Amount"));

            return Ok(totalSpend);
        }

        [HttpGet("totalIncomeMonth")]
        public async Task<ActionResult<double>> GetTotalIncomeMonth()
        {
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var endDate = startDate.AddMonths(1);

            Query incomeQuery = _db.Collection("transactions")
                .WhereGreaterThanOrEqualTo("Date", Timestamp.FromDateTime(startDate.ToUniversalTime()))
                .WhereLessThan("Date", Timestamp.FromDateTime(endDate.ToUniversalTime()))
                .WhereEqualTo("Positive", 1);

            QuerySnapshot incomeSnapshot = await incomeQuery.GetSnapshotAsync();

            double totalIncome = incomeSnapshot.Documents
                .Sum(doc => doc.GetValue<double>("Amount"));

            return Ok(totalIncome);
        }

        [HttpGet("currentMonthDaily")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetCurrentMonthDaily()
        {
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var endDate = startDate.AddMonths(1);

            Query dailyQuery = _db.Collection("transactions")
                .WhereGreaterThanOrEqualTo("Date", Timestamp.FromDateTime(startDate.ToUniversalTime()))
                .WhereLessThan("Date", Timestamp.FromDateTime(endDate.ToUniversalTime()));

            QuerySnapshot dailySnapshot = await dailyQuery.GetSnapshotAsync();

            List<Transaction> transactions = new List<Transaction>();
            foreach (DocumentSnapshot document in dailySnapshot.Documents)
            {
                Transaction transaction = document.ConvertTo<Transaction>();
                transactions.Add(transaction);
            }

            return transactions;
        }

        [HttpPost("snapshot")]
        public async Task<ActionResult> CreateOrUpdateDailyBalanceSnapshot()
        {
            var currentDate = DateTime.UtcNow.Date;
            Query snapshotQuery = _db.Collection("dailyBalanceSnapshots")
                .WhereEqualTo("SnapshotDate", Timestamp.FromDateTime(currentDate));

            QuerySnapshot snapshotQuerySnapshot = await snapshotQuery.GetSnapshotAsync();

            DocumentReference snapshotRef;
            DailyBalanceSnapshotInsert snapshot;

            // Sum the account amounts manually
            Query accountsQuery = _db.Collection("accounts");
            QuerySnapshot accountsSnapshot = await accountsQuery.GetSnapshotAsync();

            double totalBalance = accountsSnapshot.Documents
                .Sum(doc => doc.GetValue<double>("AccountAmount"));

            if (snapshotQuerySnapshot.Documents.Count > 0)
            {
                DocumentSnapshot snapshotDoc = snapshotQuerySnapshot.Documents[0];
                snapshot = snapshotDoc.ConvertTo<DailyBalanceSnapshotInsert>();
                snapshot.TotalBalance = totalBalance;
                snapshotRef = snapshotDoc.Reference;
                await snapshotRef.SetAsync(snapshot, SetOptions.Overwrite);
            }
            else
            {
                snapshot = new DailyBalanceSnapshotInsert
                {
                    SnapshotDate = currentDate,
                    TotalBalance = totalBalance
                };
                snapshotRef = _db.Collection("dailyBalanceSnapshots").Document();
                await snapshotRef.SetAsync(snapshot);
            }

            return Ok(snapshot);
        }

        [HttpGet("snapshot")]
        public async Task<ActionResult<IEnumerable<DailyBalanceSnapshot>>> GetDailyBalanceSnapshot()
        {
            Query snapshotsQuery = _db.Collection("dailyBalanceSnapshots");
            QuerySnapshot snapshotsSnapshot = await snapshotsQuery.GetSnapshotAsync();

            List<DailyBalanceSnapshot> snapshots = new List<DailyBalanceSnapshot>();
            foreach (DocumentSnapshot document in snapshotsSnapshot.Documents)
            {
                DailyBalanceSnapshot snapshot = document.ConvertTo<DailyBalanceSnapshot>();
                snapshots.Add(snapshot);
            }

            // Order the snapshots by date in ascending order (oldest to newest)
            List<DailyBalanceSnapshot> orderedSnapshots = snapshots.OrderBy(s => s.SnapshotDate).ToList();

            return orderedSnapshots;
        }
    }
}
