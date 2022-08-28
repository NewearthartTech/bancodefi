using Microsoft.AspNetCore.Mvc;

namespace bancoserver.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{

    private readonly ILogger<LoansController> _logger;

    public LoansController(ILogger<LoansController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}

public class ALoad

