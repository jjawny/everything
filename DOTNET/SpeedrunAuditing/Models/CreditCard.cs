namespace SpeedrunAuditing.Models;

public class CreditCard
{
  public Guid Id { get; set; }
  public string Name { get; set; } = null!;
  public string Bank { get; set; } = null!;
  public int Number { get; set; }
  public DateTime Expiry { get; set; }
  public int CVV { get; set; }
  public Audit Audit { get; set; } = new();
}
