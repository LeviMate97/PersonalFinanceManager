using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinanceManager.Data;
using PersonalFinanceManager.Models;

namespace PersonalFinanceManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly FinanceContext _context;

        public TransactionsController(FinanceContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            return await _context.Transactions.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return transaction;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
        {
            if (id != transaction.Id)
            {
                return BadRequest();
            }

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            if (transaction == null || string.IsNullOrEmpty(transaction.Account))
            {
                return BadRequest();
            }

            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountName == transaction.Account);
            if (account == null)
            {
                return NotFound();
            }

            account.AccountAmount += (transaction.Positive == 1) ? transaction.Amount : -transaction.Amount;

            _context.Transactions.Add(transaction);
            _context.Accounts.Update(account);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("totalSpendMonth")]
        public async Task<ActionResult<decimal>> GetTotalSpendMonth()
        {
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var totalSpend = await _context.Transactions
                .Where(t => t.Date >= startDate && t.Date <= endDate && t.Positive == 0)
                .SumAsync(t => t.Amount);

            return Ok(totalSpend);
        }

        [HttpGet("totalSpendYear")]
        public async Task<ActionResult<decimal>> GetTotalSpendYear()
        {
            var startDate = new DateTime(DateTime.Now.Year, 1, 1);
            var totalSpend = await _context.Transactions
                .Where(t => t.Date >= startDate && t.Positive == 0)
                .SumAsync(t => t.Amount);

            return Ok(totalSpend);
        }

        [HttpGet("totalIncomeMonth")]
        public async Task<ActionResult<decimal>> GetTotalIncomeMonth()
        {
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var totalIncome = await _context.Transactions
                .Where(t => t.Date >= startDate && t.Date <= endDate && t.Positive == 1)
                .SumAsync(t => t.Amount);

            return Ok(totalIncome);
        }

        [HttpGet("currentMonthDaily")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetLastMonthDaily()
        {
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);
            var transactions = await _context.Transactions
                .Where(t => t.Date >= startDate && t.Date <= endDate)
                .ToListAsync();

            return Ok(transactions);
        }

        [HttpPost("snapshot")]
        public async Task<ActionResult> CreateOrUpdateDailyBalanceSnapshot()
        {
            var currentDate = DateTime.Now.Date;
            var existingSnapshot = await _context.DailyBalanceSnapshots
                .FirstOrDefaultAsync(s => s.SnapshotDate == currentDate);

            DailyBalanceSnapshot snapshot;

            if (existingSnapshot != null)
            {
                existingSnapshot.TotalBalance = await _context.Accounts.SumAsync(a => a.AccountAmount);
                _context.DailyBalanceSnapshots.Update(existingSnapshot);
                snapshot = existingSnapshot;
            }
            else
            {
                snapshot = new DailyBalanceSnapshot
                {
                    SnapshotDate = currentDate,
                    TotalBalance = await _context.Accounts.SumAsync(a => a.AccountAmount)
                };
                _context.DailyBalanceSnapshots.Add(snapshot);
            }

            await _context.SaveChangesAsync();

            return Ok(snapshot);
        }

        [HttpGet("snapshot")]
        public async Task<ActionResult<IEnumerable<DailyBalanceSnapshot>>> GetDailyBalanceSnapshot()
        {
            return await _context.DailyBalanceSnapshots.ToListAsync();
        }

        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.Id == id);
        }
    }
}
