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

    [HttpGet("listLoans")]
    public async Task<ALoan[]> List()
    {
        var loanCollection = _db.getCollection<ALoan>();

        var loans = await  loanCollection.Find(l => true).Limit(50).ToListAsync();

        return loans.ToArray();
    }

    [HttpPost("apply")]
    public async Task<ALoan> Apply([FromBody] ALoan loan)
    {
        var loanCollection = _db.getCollection<ALoan>();

        if (!string.IsNullOrWhiteSpace(loan.id))
            throw new NotImplementedException();

        await loanCollection.InsertOneAsync(loan);

        return loan;
    }
}



