namespace SpeedrunAuditing.Models;

public class CreditCard
{
  public Guid Id { get; set; }
  public string? Name { get; set; }
  public string? Bank { get; set; }
  public int? Number { get; set; }
  public DateTime? Expiry { get; set; }
  public int? Cvc { get; set; }
  public Audit Audit { get; set; } = new();
}
