using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SpeedrunAuditing.Models;

namespace SpeedrunAuditing.Configs;

public class AuditInterceptor : SaveChangesInterceptor
{
  private readonly IHttpContextAccessor _httpContextAccessor;

  public AuditInterceptor(IHttpContextAccessor httpContextAccessor)
  {
    _httpContextAccessor = httpContextAccessor;
  }

  public override InterceptionResult<int> SavingChanges(
    DbContextEventData eventData,
    InterceptionResult<int> result
  )
  {
    if (eventData.Context != null) PerformAudit(eventData.Context);
    return base.SavingChanges(eventData, result);
  }

  public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
    DbContextEventData eventData,
    InterceptionResult<int> result,
    CancellationToken cancelToken = default
  )
  {
    if (eventData.Context != null) PerformAudit(eventData.Context);
    return base.SavingChangesAsync(eventData, result, cancelToken);
  }

  private void PerformAudit(DbContext ctx)
  {
    if (ctx == null) return;

    // var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value ?? Guid.Empty.ToString();
    var userId = Guid.NewGuid(); // DUMMY FOR NOW

    foreach (var entry in ctx.ChangeTracker.Entries())
    {
      _ = entry.State switch
      {
        EntityState.Deleted => AuditDelete(entry, userId),
        EntityState.Modified => AuditModify(entry, userId),
        EntityState.Added => AuditAdd(entry, userId),
        _ => false
      };
    }
  }

  private bool AuditDelete(EntityEntry entry, Guid userId)
  {
    if (entry.Entity is Audit entity)
    {
      entry.State = EntityState.Modified;
      entity.ModifiedAt = DateTime.UtcNow;
      entity.ModifiedBy = userId;
      entity.IsDeleted = true;

      entry.Property(nameof(entity.CreatedBy)).IsModified = false;
      entry.Property(nameof(entity.CreatedAt)).IsModified = false;

      return true;
    }
    return false;
  }

  private bool AuditModify(EntityEntry entry, Guid userId)
  {
    if (entry.Entity is Audit entity)
    {
      entity.ModifiedAt = DateTime.UtcNow;
      entity.ModifiedBy = userId;

      entry.Property(nameof(entity.CreatedBy)).IsModified = false;
      entry.Property(nameof(entity.CreatedAt)).IsModified = false;
      entry.Property(nameof(entity.IsDeleted)).IsModified = false;

      return true;
    }
    return false;
  }

  private bool AuditAdd(EntityEntry entry, Guid userId)
  {
    if (entry.Entity is Audit entity)
    {
      entity.CreatedAt = DateTime.UtcNow;
      entity.CreatedBy = userId;

      entry.Property(nameof(entity.ModifiedBy)).IsModified = false;
      entry.Property(nameof(entity.ModifiedAt)).IsModified = false;
      entry.Property(nameof(entity.IsDeleted)).IsModified = false;

      return true;
    }
    return false;
  }
}
