using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceManager.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;

namespace PersonalFinanceManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly FirestoreDb _db;

        public CategoriesController(FirestoreDb db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            CollectionReference collectionReference = _db.Collection("categories");
            QuerySnapshot querySnapshot = await collectionReference.GetSnapshotAsync();

            List<Category> categories = new List<Category>();
            foreach (DocumentSnapshot documentSnapshot in querySnapshot.Documents)
            {
                Category category = documentSnapshot.ConvertTo<Category>();
                categories.Add(category);
            }

            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory(CategoryInsert category)
        {
            CollectionReference collectionReference = _db.Collection("categories");
            await collectionReference.AddAsync(category);
            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            DocumentReference docRef = _db.Collection("categories").Document(id);
            await docRef.DeleteAsync();
            return NoContent();
        }
    }
}
