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
    [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
    [BsonRepresentation(BsonType.ObjectId)]
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
    public LoanDurationWindow   LoanDurationWindow { get; set; }


    /// <summary>
    /// in eth
    /// </summary>
    [Required]
    public float InterestAmount { get; set; }
}

public enum LoanDurationWindow { days, months, years}



