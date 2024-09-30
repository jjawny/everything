using Microsoft.AspNetCore.Mvc;
using SpeedrunAuditing.Configs;
using SpeedrunAuditing.Contexts;
using SpeedrunAuditing.Models;

// 1. Add services into DI container:
var builder = WebApplication.CreateBuilder(args);
{
  builder.Services.AddEndpointsApiExplorer();
  builder.Services.AddSwaggerGen();
  builder.Services.AddHttpContextAccessor();
  builder.Services.AddScoped<AuditInterceptor>();
  builder.Services.AddDbContext<NamingThingsIsHardContext>();
}

// 2. Configure the HTTP request (middleware) pipeline:
var app = builder.Build();
{
  if (app.Environment.IsDevelopment())
  {
    app.UseSwagger();
    app.UseSwaggerUI();
  }
  app.UseHttpsRedirection();
}

// 3. Endpoints:
// Validate, sanitize, map, & handle errors
app.MapPost("/api/creditcards", async (
  [FromBody] CreditCard dto,
  [FromServices] NamingThingsIsHardContext ctx
) =>
{
  ctx.CreditCards.Add(dto);
  await ctx.SaveChangesAsync();
  return Results.Created($"/api/creditcards/{dto.Id}", dto);
});

app.MapPatch("/api/creditcards/{id}", async (
  Guid id,
  [FromBody] CreditCard dto,
  [FromServices] NamingThingsIsHardContext ctx
) =>
{
  var entity = await ctx.CreditCards.FindAsync(id);
  if (entity == null) return Results.NotFound();
  entity.Bank = dto.Bank;
  ctx.CreditCards.Update(entity);
  await ctx.SaveChangesAsync();
  return Results.Ok(entity);
});

app.MapDelete("/api/creditcards/{id}", async (
  Guid id,
  [FromServices] NamingThingsIsHardContext ctx
) =>
{
  var entity = await ctx.CreditCards.FindAsync(id);
  if (entity == null) return Results.NotFound();
  ctx.CreditCards.Remove(entity);
  await ctx.SaveChangesAsync();
  return Results.Ok();
});

app.Run();
