using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace bancoserver.services;

/// <summary>
/// src/pages/apply/state/FormState.tsx : interface FormState
/// </summary>
[MongoCollection("loans")]
[BsonIgnoreExtraElements]
public class ALoan
{
    /// <summary>
    /// This is actually calculated by the EVM contract
    /// </summary>
    [BsonRepresentation(BsonType.String)]
    public string id { get; set; } = "";


    [Required]
    public bool NftVerified { get; set; }

    [Required]
    public string ERCaddress { get; set; } = "";

    [Required]
    public string TokenAddress { get; set; } = "";

    /// <summary>
    /// in tzx
    /// </summary>
    [Required]
    public float LoanAmount { get; set; }

    /// <summary>
    /// defined by LoanDurationWindow
    /// </summary>
    [Required]
    public long LoanDuration { get; set; }

    [Required]
    public LoanDurationWindow LoanDurationWindow { get; set; }


    /// <summary>
    /// in eth
    /// </summary>
    [Required]
    public float InterestAmount { get; set; }


    public LoanStatus LoanStatus {get;set;}

    [Required]
    public string RequesterTzAddress { get; set; } = "";

    [Required]
    public string RequesterEvmAddress { get; set; } = "";

    
    public LenderDetails? Lender { get; set; }
}

[Newtonsoft.Json.JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
[System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
public enum LoanDurationWindow { days, months, years}

[Newtonsoft.Json.JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
[System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
public enum LoanStatus {
    state_created = 0,
    state_bobFunded = 1,
    state_movedToEscrow = 2,
    state_refundToBob = 3,
    state_refundToAlex = 4,
    state_returned = 5,
    state_defaulted = 6,
    state_released = 7,
    state_fortified = 8,
}

public class LenderDetails
{
    [Required]
    public string TzAddress { get; set; } = "";

    [Required]
    public string EvmAddress { get; set; } = "";

}



