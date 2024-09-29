using Microsoft.EntityFrameworkCore;
using SpeedrunAuditing.Configs;
using SpeedrunAuditing.Models;

namespace SpeedrunAuditing.Contexts;

public class NamingThingsIsHardContext : DbContext
{
  public DbSet<CreditCard> CreditCards { get; set; }
  private readonly string _dbPath;

  private readonly AuditInterceptor _auditInterceptor;

  public NamingThingsIsHardContext(
    DbContextOptions<NamingThingsIsHardContext> opts,
    AuditInterceptor auditInterceptor
  ) : base(opts)
  {
    var rootPath = AppDomain.CurrentDomain.BaseDirectory;
    _dbPath = Path.Combine(rootPath, "NamingThingsIsHardContext.db");
    _auditInterceptor = auditInterceptor;
  }

  protected override void OnConfiguring(DbContextOptionsBuilder opts)
  {
    if (!opts.IsConfigured)
    {
      opts
        .UseSqlite($"Data Source={_dbPath}")
        .AddInterceptors(_auditInterceptor);
    }
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<CreditCard>(entity =>
    {
      entity.OwnsOne(e => e.Audit);
      entity.HasQueryFilter(e => !e.Audit.IsDeleted);
    });
  }

}
