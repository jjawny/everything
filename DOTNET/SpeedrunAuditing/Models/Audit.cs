namespace SpeedrunAuditing.Models;

public class Audit
{
  public Guid? CreatedBy { get; set; }
  public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
  public Guid? ModifiedBy { get; set; }
  public DateTime? ModifiedAt { get; set; }
  public bool IsDeleted { get; set; } = false;
}
