using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenQA.Selenium.DevTools;
using PersonalFinanceManager.Models;

namespace PersonalFinanceManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly FirestoreDb _db;

        public AccountsController(FirestoreDb db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAccounts()
        {
            CollectionReference collectionReference = _db.Collection("accounts");
            Console.WriteLine(collectionReference);
            QuerySnapshot querySnapshot = await collectionReference.GetSnapshotAsync();


            List<Account> accounts = new List<Account>();
            foreach (DocumentSnapshot documentSnapshot in querySnapshot.Documents)
            {
                Account account = documentSnapshot.ConvertTo<Account>();
                accounts.Add(account);
            }

            return Ok(accounts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccount(string id)
        {
            DocumentReference docRef = _db.Collection("accounts").Document(id);
            DocumentSnapshot documentSnapshot = await docRef.GetSnapshotAsync();

            if (documentSnapshot.Exists)
            {
                Account account = documentSnapshot.ConvertTo<Account>();
                return Ok(account);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddAccount(AccountInsert account)
        {
            CollectionReference collectionReference = _db.Collection("accounts");
            await collectionReference.AddAsync(account);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount(string id, AccountInsert account)
        {
            DocumentReference docRef = _db.Collection("accounts").Document(id);
            await docRef.SetAsync(account, SetOptions.Overwrite);
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(string id)
        {
            DocumentReference docRef = _db.Collection("accounts").Document(id);
            await docRef.DeleteAsync();
            return NoContent();
        }

        [HttpGet("totalNetworth")]
        public async Task<IActionResult> GetTotalNetworth()
        {
            CollectionReference allAccountsQuery = _db.Collection("accounts");
            QuerySnapshot allAccountsSnapshot = await allAccountsQuery.GetSnapshotAsync();

            double totalNetworth = allAccountsSnapshot.Documents
                .Sum(doc => doc.GetValue<double>("AccountAmount"));

            return Ok(totalNetworth);
        }
    }
}
