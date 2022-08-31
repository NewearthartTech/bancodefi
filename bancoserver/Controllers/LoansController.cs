using bancoserver.services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace bancoserver.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{

    readonly ILogger<LoansController> _logger;
    readonly IDbService _db;

    public LoansController(
        IDbService db,
        ILogger<LoansController> logger)
    {
        _logger = logger;
        _db = db;
    }


    [HttpGet("byBorrowerEvmAddress/{evmAddress}")]
    public async Task<ALoan[]> LoanByBorrowerEvmAddress(string evmAddress)
    {
        var loanCollection = _db.getCollection<ALoan>();

#pragma warning disable CS8602 // Dereference of a possibly null reference.
        return (await loanCollection.Find(l => l.RequesterEvmAddress == evmAddress).ToListAsync()).ToArray();
#pragma warning restore CS8602 // Dereference of a possibly null reference.

    }

    [HttpGet("byBorrowerTzAddress/{tzAddress}")]
    public async Task<ALoan[]> LoanByBorrowerTzAddress(string tzAddress)
    {
        var loanCollection = _db.getCollection<ALoan>();

#pragma warning disable CS8602 // Dereference of a possibly null reference.
        return (await loanCollection.Find(l => l.RequesterTzAddress == tzAddress).ToListAsync()).ToArray();
#pragma warning restore CS8602 // Dereference of a possibly null reference.

    }


    [HttpGet("byLenderEvmAddress/{evmAddress}")]
    public async Task<ALoan[]> LoanByLenderEvmAddress(string evmAddress)
    {
        var loanCollection = _db.getCollection<ALoan>();

#pragma warning disable CS8602 // Dereference of a possibly null reference.
        return (await loanCollection.Find(l => l.Lender.EvmAddress == evmAddress).ToListAsync()).ToArray();
#pragma warning restore CS8602 // Dereference of a possibly null reference.

    }

    [HttpGet("byLenderTzAddress/{tzAddress}")]
    public async Task<ALoan[]> LoanByLenderTzAddress(string tzAddress)
    {
        var loanCollection = _db.getCollection<ALoan>();

#pragma warning disable CS8602 // Dereference of a possibly null reference.
        return (await loanCollection.Find(l => l.Lender.TzAddress == tzAddress).ToListAsync()).ToArray();
#pragma warning restore CS8602 // Dereference of a possibly null reference.

    }

    [HttpGet("byId/{loanId}")]
    public async Task<ALoan> LoanById(string loanId)
    {
        var loanCollection = _db.getCollection<ALoan>();

        return await loanCollection.Find(l => l.id == loanId).SingleAsync();
        
    }

    [HttpGet("listLoans/{status}")]
    public async Task<ALoan[]> List(LoanStatus status)
    {
        var loanCollection = _db.getCollection<ALoan>();

        var loans = await  loanCollection.Find(l => l.LoanStatus == status).Limit(50).ToListAsync();

        return loans.ToArray();
    }

    [HttpPost("update")]
    public async Task<ALoan> Update([FromBody] ALoan loan)
    {
        var loanCollection = _db.getCollection<ALoan>();

        //dee: todo: We need to get the loan status from Blockchain and update it, not just
        //TRUST the front end

        await loanCollection.ReplaceOneAsync(l => l.id == loan.id, loan, new ReplaceOptions
        {
            IsUpsert = true
        });

        return loan;
    }
}



