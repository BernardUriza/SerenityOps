# .NET Core & EF Core Optimization Patterns

**Contexto**: Enterprise-grade ASP.NET Core applications
**Audiencia**: Senior Full-Stack Developer interviews
**Stack**: .NET 8, EF Core 8, SQL Server, Redis

---

## Tabla de Contenidos

1. [EF Core Query Optimization](#ef-core-query-optimization)
2. [Caching Strategies](#caching-strategies)
3. [Dependency Injection Lifetimes](#dependency-injection-lifetimes)
4. [Async Patterns & Thread Safety](#async-patterns--thread-safety)
5. [API Performance Best Practices](#api-performance-best-practices)

---

## EF Core Query Optimization

### 1. AsNoTracking() - Performance Boost de 30-40%

**Problema**: EF Core trackea todas las entidades por defecto para change tracking.

```cs
// ❌ MAL - tracking innecesario en read-only
public async Task<List<Employee>> GetEmployees()
{
    return await _context.Employees
        .Where(e => e.IsActive)
        .ToListAsync();
}
```

**Solución**:

```cs
// ✅ BIEN - AsNoTracking para queries de solo lectura
public async Task<List<Employee>> GetEmployees()
{
    return await _context.Employees
        .AsNoTracking()
        .Where(e => e.IsActive)
        .ToListAsync();
}
```

#### Performance Impact

| Métrica | Con Tracking | Con AsNoTracking() |
|---------|--------------|-------------------|
| Query time (1000 records) | 150ms | 95ms |
| Memory usage | Alta | 30-40% menor |
| Change tracking overhead | Sí | No |

#### Cuándo Usar AsNoTracking()

✅ **SÍ usar cuando**:
- Queries read-only (GET endpoints)
- Mapeo a DTOs
- Reportes y exports
- Búsquedas y listados

❌ **NO usar cuando**:
- Necesitas modificar la entidad después (UPDATE/DELETE)
- Usas lazy loading (requiere tracking)
- Necesitas detectar cambios para audit logs

---

### 2. Projection vs Full Entity

**Problema**: Traer entidades completas cuando solo necesitas pocos campos.

```cs
// ❌ MAL - trae TODAS las propiedades + relaciones
public async Task<List<Employee>> GetEmployeeList()
{
    return await _context.Employees
        .Include(e => e.Department)
        .Include(e => e.Manager)
        .ToListAsync();
}

// Employee entity tiene 20+ propiedades, solo usas 3
```

**Solución con Select() (Projection)**:

```cs
// ✅ BIEN - solo campos necesarios
public async Task<List<EmployeeListDto>> GetEmployeeList()
{
    return await _context.Employees
        .Select(e => new EmployeeListDto
        {
            Id = e.Id,
            FullName = e.FirstName + " " + e.LastName,
            DepartmentName = e.Department.Name
        })
        .ToListAsync();
}

public class EmployeeListDto
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string DepartmentName { get; set; }
}
```

#### SQL Generado

```sql
-- ❌ Sin projection (Include)
SELECT e.*, d.*, m.*
FROM Employees e
LEFT JOIN Departments d ON e.DepartmentId = d.Id
LEFT JOIN Employees m ON e.ManagerId = m.Id

-- ✅ Con projection (Select)
SELECT e.Id, e.FirstName, e.LastName, d.Name
FROM Employees e
LEFT JOIN Departments d ON e.DepartmentId = d.Id
```

#### Performance Impact

| Métrica | Full Entity + Include | Projection |
|---------|----------------------|------------|
| Data transfer (1000 records) | 2.5 MB | 150 KB |
| Query time | 200ms | 80ms |
| Mapping overhead | Alto | Bajo |

---

### 3. Include() y el Problema N+1

**Problema**: Múltiples `.Include()` generan JOINs masivos o múltiples queries.

```cs
// 🔴 PELIGRO - 4 JOINs, query muy pesada
var employee = await _context.Employees
    .Include(e => e.Department)
    .Include(e => e.Manager)
    .Include(e => e.Benefits)
    .Include(e => e.Projects)
    .FirstOrDefaultAsync(e => e.Id == id);
```

#### SQL Generado (cartesian explosion)

```sql
-- Resultado: filas duplicadas por cada combinación de Benefits x Projects
SELECT e.*, d.*, m.*, b.*, p.*
FROM Employees e
LEFT JOIN Departments d ON ...
LEFT JOIN Employees m ON ...
LEFT JOIN Benefits b ON ...
LEFT JOIN Projects p ON ...
WHERE e.Id = @id
```

#### Soluciones

**Opción 1: Split Queries (EF Core 5+)**

```cs
var employee = await _context.Employees
    .AsSplitQuery() // ejecuta queries separadas
    .Include(e => e.Department)
    .Include(e => e.Benefits)
    .Include(e => e.Projects)
    .FirstOrDefaultAsync(e => e.Id == id);
```

**SQL Generado**:
```sql
-- Query 1
SELECT * FROM Employees WHERE Id = @id
-- Query 2
SELECT * FROM Benefits WHERE EmployeeId = @id
-- Query 3
SELECT * FROM Projects WHERE EmployeeId IN (@ids)
```

**Opción 2: Explicit Loading (lazy, solo si necesitas)**

```cs
var employee = await _context.Employees
    .FirstOrDefaultAsync(e => e.Id == id);

// Cargar relaciones solo si necesitas
if (needsDepartment)
{
    await _context.Entry(employee)
        .Reference(e => e.Department)
        .LoadAsync();
}

if (needsBenefits)
{
    await _context.Entry(employee)
        .Collection(e => e.Benefits)
        .LoadAsync();
}
```

**Opción 3: Projection (MEJOR para APIs)**

```cs
var employee = await _context.Employees
    .Where(e => e.Id == id)
    .Select(e => new EmployeeDetailsDto
    {
        Id = e.Id,
        Name = e.FirstName + " " + e.LastName,
        DepartmentName = e.Department.Name,
        BenefitNames = e.Benefits.Select(b => b.Name).ToList(),
        ProjectTitles = e.Projects.Select(p => p.Title).ToList()
    })
    .FirstOrDefaultAsync();
```

---

### 4. Pagination - Obligatoria en Enterprise

**Problema**: Cargar todos los registros causa OutOfMemoryException.

```cs
// ❌ NUNCA en producción
[HttpGet("employees")]
public async Task<IActionResult> GetAllEmployees()
{
    var employees = await _context.Employees.ToListAsync();
    return Ok(employees); // 100,000 registros = crash
}
```

**Solución con Skip/Take**:

```cs
[HttpGet("employees")]
public async Task<IActionResult> GetEmployees(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20)
{
    var employees = await _context.Employees
        .AsNoTracking()
        .OrderBy(e => e.LastName)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(e => new EmployeeDto
        {
            Id = e.Id,
            Name = e.FirstName + " " + e.LastName
        })
        .ToListAsync();

    return Ok(employees);
}
```

**Mejor: PagedResult con metadata**

```cs
public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}

[HttpGet("employees")]
public async Task<ActionResult<PagedResult<EmployeeDto>>> GetEmployees(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20)
{
    var query = _context.Employees.AsNoTracking();

    var totalCount = await query.CountAsync();

    var items = await query
        .OrderBy(e => e.LastName)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(e => new EmployeeDto { /* ... */ })
        .ToListAsync();

    return new PagedResult<EmployeeDto>
    {
        Items = items,
        TotalCount = totalCount,
        Page = page,
        PageSize = pageSize
    };
}
```

**Performance**: CountAsync() duplica queries. Para mejor performance:

```cs
// Opción 1: Count estimado (muy rápido, menos preciso)
var totalCount = await _context.Database
    .SqlQueryRaw<int>("SELECT CAST(p.rows AS int) FROM sys.partitions p WHERE object_id = OBJECT_ID('Employees')")
    .FirstOrDefaultAsync();

// Opción 2: Cache el count (si no cambia frecuentemente)
var cacheKey = "employees:count";
var totalCount = await _cache.GetOrCreateAsync(cacheKey, async entry =>
{
    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
    return await _context.Employees.CountAsync();
});
```

---

### 5. Compiled Queries (Alto Rendimiento)

Para queries que se ejecutan frecuentemente con diferentes parámetros:

```cs
public class EmployeeRepository
{
    private static readonly Func<ApplicationDbContext, int, Task<Employee>> _getByIdQuery =
        EF.CompileAsyncQuery((ApplicationDbContext context, int id) =>
            context.Employees
                .AsNoTracking()
                .FirstOrDefault(e => e.Id == id));

    public async Task<Employee> GetByIdAsync(int id)
    {
        return await _getByIdQuery(_context, id);
    }
}
```

**Beneficio**: Compilation ocurre una vez, reutiliza execution plan.

---

## Caching Strategies

### 1. Response Caching (Middleware)

Para endpoints públicos sin autenticación:

```cs
// Startup.cs
services.AddResponseCaching();
app.UseResponseCaching();

// Controller
[ResponseCache(Duration = 60)] // cache por 60 segundos
[HttpGet("departments")]
public async Task<IActionResult> GetDepartments()
{
    var departments = await _context.Departments
        .AsNoTracking()
        .ToListAsync();
    return Ok(departments);
}
```

**Headers generados**:
```
Cache-Control: public, max-age=60
```

#### Control granular:

```cs
[ResponseCache(
    Duration = 300,
    Location = ResponseCacheLocation.Any,
    VaryByQueryKeys = new[] { "page", "pageSize" }
)]
```

---

### 2. Memory Cache (In-Process)

Para datos de lookup que cambian poco:

```cs
public class DepartmentService
{
    private readonly IMemoryCache _cache;
    private readonly ApplicationDbContext _context;

    public async Task<List<Department>> GetDepartmentsAsync()
    {
        return await _cache.GetOrCreateAsync("departments", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
            entry.SlidingExpiration = TimeSpan.FromMinutes(10);

            return await _context.Departments
                .AsNoTracking()
                .ToListAsync();
        });
    }

    public void InvalidateCache()
    {
        _cache.Remove("departments");
    }
}
```

**Cuándo usar**:
- Datos estáticos (estados, países, categorías)
- Aplicación single-server
- Datos pequeños (<100 MB en total)

---

### 3. Distributed Cache (Redis) - Enterprise

Para aplicaciones multi-server:

```cs
// Startup.cs
services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
    options.InstanceName = "PaylocityApp:";
});

// Service
public class EmployeeService
{
    private readonly IDistributedCache _cache;
    private readonly ApplicationDbContext _context;

    public async Task<EmployeeDto> GetEmployeeAsync(int id)
    {
        var cacheKey = $"employee:{id}";
        var cachedJson = await _cache.GetStringAsync(cacheKey);

        if (cachedJson != null)
        {
            return JsonSerializer.Deserialize<EmployeeDto>(cachedJson);
        }

        var employee = await _context.Employees
            .AsNoTracking()
            .Where(e => e.Id == id)
            .Select(e => new EmployeeDto { /* ... */ })
            .FirstOrDefaultAsync();

        if (employee != null)
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                SlidingExpiration = TimeSpan.FromMinutes(2)
            };

            await _cache.SetStringAsync(
                cacheKey,
                JsonSerializer.Serialize(employee),
                options
            );
        }

        return employee;
    }
}
```

**Invalidación de cache**:

```cs
public async Task UpdateEmployeeAsync(int id, UpdateEmployeeDto dto)
{
    var employee = await _context.Employees.FindAsync(id);
    // ... update logic
    await _context.SaveChangesAsync();

    // Invalidar cache
    await _cache.RemoveAsync($"employee:{id}");
}
```

---

## Dependency Injection Lifetimes

### Diferencias Críticas

| Lifetime | Cuándo se crea | Cuándo se destruye | Uso |
|----------|----------------|-------------------|-----|
| **Transient** | Cada vez que se inyecta | Al finalizar scope | Servicios ligeros sin estado |
| **Scoped** | Una vez por request HTTP | Al finalizar request | DbContext, UnitOfWork |
| **Singleton** | Una vez al iniciar app | Al apagar app | Servicios sin estado, caches |

### Ejemplos

```cs
// Startup.cs
services.AddTransient<IEmailService, EmailService>();
services.AddScoped<ApplicationDbContext>();
services.AddSingleton<IMetricsCollector, MetricsCollector>();
```

#### Transient

```cs
// ✅ Correcto - servicio sin estado
public class EmailService : IEmailService
{
    public async Task SendAsync(string to, string subject, string body)
    {
        // lógica de envío
    }
}

services.AddTransient<IEmailService, EmailService>();
```

#### Scoped

```cs
// ✅ Correcto - DbContext debe ser Scoped
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// En Controller
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmployeesController(ApplicationDbContext context)
    {
        _context = context; // mismo contexto durante todo el request
    }
}
```

#### Singleton

```cs
// ✅ Correcto - servicio sin estado compartido
public class MetricsCollector : IMetricsCollector
{
    private readonly ConcurrentDictionary<string, int> _metrics = new();

    public void IncrementCounter(string key)
    {
        _metrics.AddOrUpdate(key, 1, (_, count) => count + 1);
    }
}

services.AddSingleton<IMetricsCollector, MetricsCollector>();
```

### ⚠️ Errores Comunes

```cs
// 🔴 ERROR - DbContext no debe ser Singleton
services.AddSingleton<ApplicationDbContext>(); // ¡NUNCA!

// 🔴 ERROR - Inyectar Scoped en Singleton
public class SingletonService
{
    private readonly ApplicationDbContext _context; // DbContext es Scoped

    public SingletonService(ApplicationDbContext context) // ¡CRASH!
    {
        _context = context;
    }
}
```

**Regla**: Singleton NO puede depender de Scoped o Transient.

---

## Async Patterns & Thread Safety

### 1. Async/Await - Correctamente

```cs
// ❌ MAL - bloquea thread
public IActionResult GetEmployees()
{
    var employees = _context.Employees.ToList(); // sincrónico
    return Ok(employees);
}

// ✅ BIEN - libera thread durante I/O
public async Task<IActionResult> GetEmployees()
{
    var employees = await _context.Employees.ToListAsync();
    return Ok(employees);
}
```

### 2. ConfigureAwait(false) - ¿Cuándo usar?

```cs
// En library code (NO necesita volver al contexto original)
public async Task<string> FetchDataAsync()
{
    using var client = new HttpClient();
    var response = await client.GetStringAsync(url)
        .ConfigureAwait(false); // OK en libraries
    return response;
}

// En ASP.NET Core - NO necesario (no hay SynchronizationContext)
public async Task<IActionResult> Get()
{
    var data = await _service.GetDataAsync();
    // ConfigureAwait(false) es redundante aquí
    return Ok(data);
}
```

**Regla**: En ASP.NET Core, `ConfigureAwait(false)` es innecesario.

### 3. Parallel Processing

```cs
// Procesar múltiples items en paralelo
public async Task<List<EmployeeDto>> EnrichEmployeesAsync(List<Employee> employees)
{
    var tasks = employees.Select(async e =>
    {
        var details = await _externalService.GetDetailsAsync(e.Id);
        return new EmployeeDto { /* map */ };
    });

    return (await Task.WhenAll(tasks)).ToList();
}
```

**Cuidado**: No uses DbContext en paralelo (no es thread-safe).

---

## API Performance Best Practices

### 1. Compression

```cs
// Startup.cs
services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
    options.Providers.Add<BrotliCompressionProvider>();
});

app.UseResponseCompression();
```

### 2. Health Checks

```cs
services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>()
    .AddRedis("localhost:6379");

app.MapHealthChecks("/health");
```

### 3. Rate Limiting (.NET 7+)

```cs
services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User.Identity?.Name ?? context.Request.Headers.Host.ToString(),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));
});

app.UseRateLimiter();
```

---

### 🧠 Key Insight

> **En enterprise HCM systems como Paylocity con millones de registros, AsNoTracking() y projection no son optimizaciones prematuras — son requisitos operacionales. Un query sin AsNoTracking() en producción con 100K+ empleados consume 10x más memoria. La diferencia entre Mid-Level y Senior es saber CUÁNDO aplicar cada patrón, no solo conocerlos.**

---

**Recursos adicionales**:
- [EF Core Performance](https://learn.microsoft.com/en-us/ef/core/performance/)
- [ASP.NET Core Best Practices](https://learn.microsoft.com/en-us/aspnet/core/performance/performance-best-practices)
- [Caching in .NET](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/overview)
