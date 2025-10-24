# Technical Learnings - Interview Preparation

**Última actualización**: 2025-10-23
**Fuente**: Paylocity Interview Simulation
**Stack**: .NET Core + React + Enterprise Patterns

---

## Índice de Conceptos Clave

Este documento consolida todos los aprendizajes técnicos de preparación para entrevistas, organizados por dominio.

**Documentos relacionados**:
- [Ver detalle → react_performance.md](../../curriculum/interview_prep/react_performance.md)
- [Ver detalle → dotnet_optimization.md](../../curriculum/interview_prep/dotnet_optimization.md)
- [Ver detalle → common_bugs_solutions.md](../../curriculum/interview_prep/common_bugs_solutions.md)
- [Ver detalle → paylocity_context.md](../../curriculum/interview_prep/paylocity_context.md)
- [Ver transcripción completa → paylocity_simulation_2025-10-23.md](./paylocity_simulation_2025-10-23.md)

---

## 1. React Performance Patterns

### Trío Mágico de Memoization

| Hook | Qué memoiza | Cuándo usar |
|------|-------------|-------------|
| `useMemo` | **Valores/cálculos** | Operaciones costosas (map, filter, reduce) |
| `useCallback` | **Funciones** | Callbacks pasados a componentes memorizados |
| `React.memo` | **Componentes** | Componentes puros que re-renderizan innecesariamente |

#### Ejemplo: useMemo
```tsx
const filteredEmployees = useMemo(
  () => employees.filter(e => e.department === selectedDept),
  [employees, selectedDept]
);
```

**¿Cuándo NO usar?**
- Cálculos triviales (suma de 2 números)
- Arrays pequeños (<100 elementos)
- Si las dependencias cambian constantemente

#### Ejemplo: useCallback
```tsx
const handleSelect = useCallback((id: string) => {
  setSelectedIds(prev => new Set(prev).add(id));
}, []);
```

**Regla de oro**: Si pasas una función a un componente con `React.memo`, usa `useCallback`.

#### Ejemplo: React.memo
```tsx
const EmployeeRow = React.memo(({ employee, onSelect }) => (
  <tr onClick={() => onSelect(employee.id)}>
    <td>{employee.name}</td>
  </tr>
));
```

**Nota**: `React.memo` hace shallow comparison. Para props complejas, usa segundo argumento:
```tsx
React.memo(Component, (prevProps, nextProps) => {
  return prevProps.employee.id === nextProps.employee.id;
});
```

### Virtualization (Listas Grandes)

**Problema**: Renderizar 500+ elementos causa lag severo.

**Solución**: `react-window` o `react-virtualized`

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={employees.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <EmployeeRow style={style} employee={employees[index]} />
  )}
</FixedSizeList>
```

**Impacto**:
- Renderiza solo elementos visibles (~20-30)
- Render time: 5ms vs 500ms
- Scroll smooth sin frame drops

**Cuándo usar**:
- Listas con >100 elementos
- Tablas enterprise con datos paginados
- Feeds infinitos

[Ver ejemplos completos → react_performance.md](../../curriculum/interview_prep/react_performance.md)

---

## 2. .NET Core & EF Core Optimizations

### AsNoTracking() - Performance Boost de 30-40%

**Problema**: EF Core por defecto trackea todas las entidades para change tracking.

```cs
// ❌ MAL - tracking innecesario en read-only query
var employees = await _context.Employees
    .Where(e => e.Department == "IT")
    .ToListAsync();
```

**Solución**:
```cs
// ✅ BIEN - AsNoTracking para queries de solo lectura
var employees = await _context.Employees
    .AsNoTracking()
    .Where(e => e.Department == "IT")
    .ToListAsync();
```

**Cuándo usar**:
- Queries read-only (no UPDATE/DELETE posterior)
- DTOs que se mapean a view models
- Búsquedas, reportes, exports

**Cuándo NO usar**:
- Si necesitas modificar la entidad después
- Si usas lazy loading (requiere tracking)

### Projection vs Full Entity

**Problema**: Traer entidades completas cuando solo necesitas 2-3 campos.

```cs
// ❌ MAL - trae TODAS las propiedades de Employee
var employees = await _context.Employees
    .Include(e => e.Department)
    .Include(e => e.Manager)
    .ToListAsync();
```

**Solución**:
```cs
// ✅ BIEN - proyección a DTO con solo campos necesarios
var employees = await _context.Employees
    .Select(e => new EmployeeDto {
        Id = e.Id,
        FullName = e.FirstName + " " + e.LastName,
        DepartmentName = e.Department.Name
    })
    .ToListAsync();
```

**Beneficios**:
- Reduce payload de DB → API
- Evita lazy loading accidental
- Query SQL más simple y rápida

### Include() y el Problema N+1

**Problema**: Múltiples `.Include()` generan JOINs masivos.

```cs
// 🔴 PELIGRO - 4 JOINs, query pesada
var employee = await _context.Employees
    .Include(e => e.Department)
    .Include(e => e.Manager)
    .Include(e => e.Benefits)
    .Include(e => e.Projects)
    .FirstOrDefaultAsync(e => e.Id == id);
```

**Soluciones**:

1. **Split Queries** (EF Core 5+)
```cs
var employee = await _context.Employees
    .AsSplitQuery()
    .Include(e => e.Department)
    .Include(e => e.Benefits)
    .FirstOrDefaultAsync(e => e.Id == id);
```

2. **Explicit Loading** (lazy, solo si necesitas)
```cs
var employee = await _context.Employees.FindAsync(id);
await _context.Entry(employee).Reference(e => e.Department).LoadAsync();
```

3. **Projection** (mejor opción)
```cs
var employee = await _context.Employees
    .Where(e => e.Id == id)
    .Select(e => new EmployeeDetailsDto {
        Name = e.FirstName,
        DeptName = e.Department.Name,
        Benefits = e.Benefits.Select(b => b.Name).ToList()
    })
    .FirstOrDefaultAsync();
```

### Caching Strategies

**1. Response Caching (Middleware)**
```cs
[ResponseCache(Duration = 60)]
[HttpGet("departments")]
public async Task<IActionResult> GetDepartments()
{
    var depts = await _context.Departments.ToListAsync();
    return Ok(depts);
}
```

**2. Memory Cache (lookup data)**
```cs
public async Task<List<Department>> GetDepartments()
{
    return await _cache.GetOrCreateAsync("departments", async entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
        return await _context.Departments.ToListAsync();
    });
}
```

**3. Distributed Cache (Redis) - Enterprise**
```cs
var cacheKey = $"employee:{id}";
var cached = await _distributedCache.GetStringAsync(cacheKey);

if (cached != null)
    return JsonSerializer.Deserialize<EmployeeDto>(cached);

var employee = await _context.Employees.FindAsync(id);
await _distributedCache.SetStringAsync(
    cacheKey,
    JsonSerializer.Serialize(employee),
    new DistributedCacheEntryOptions {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
    }
);
```

### Pagination - Obligatoria en Enterprise

```cs
// ❌ NUNCA hagas esto en producción
var allEmployees = await _context.Employees.ToListAsync();

// ✅ Siempre pagina
var employees = await _context.Employees
    .AsNoTracking()
    .OrderBy(e => e.LastName)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();
```

**Bonus**: Retornar metadata de paginación
```cs
public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
```

[Ver optimizaciones completas → dotnet_optimization.md](../../curriculum/interview_prep/dotnet_optimization.md)

---

## 3. Errores Típicos en Entrevistas React

### Bug #1: Mutación Directa de Estado (CRÍTICO)

**Código problemático**:
```tsx
const handleToggle = (id) => {
  const item = items.find(i => i.id === id);
  item.completed = !item.completed; // 🔴 MUTACIÓN DIRECTA
  setItems(items); // 🔴 MISMA REFERENCIA
};
```

**Por qué falla**: React compara referencias, no valores. `items` sigue siendo el mismo array en memoria.

**Solución correcta**:
```tsx
const handleToggle = (id) => {
  setItems(items.map(item =>
    item.id === id
      ? { ...item, completed: !item.completed }
      : item
  ));
};
```

**Regla de oro**:
```tsx
// ❌ NUNCA
array.push(item);
array[index] = newValue;
object.property = newValue;

// ✅ SIEMPRE
[...array, item]
array.map((el, i) => i === index ? newValue : el)
{ ...object, property: newValue }
```

### Bug #2: useEffect con Dependencias Incorrectas

```tsx
// 🔴 LOOP INFINITO
useEffect(() => {
  setData(fetchData());
}, [data]); // data cambia → efecto ejecuta → data cambia...

// ✅ CORRECTO
useEffect(() => {
  fetchData().then(setData);
}, []); // solo en mount
```

### Bug #3: Event Handlers sin useCallback (rompe React.memo)

```tsx
// 🔴 NUEVO CALLBACK EN CADA RENDER
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => setCount(c => c + 1);

  return <Child onClick={handleClick} />; // Child re-renderiza
};

// ✅ CALLBACK ESTABLE
const Parent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => setCount(c => c + 1), []);

  return <Child onClick={handleClick} />; // Child NO re-renderiza
};

const Child = React.memo(({ onClick }) => <button onClick={onClick}>Click</button>);
```

[Ver más bugs comunes → common_bugs_solutions.md](../../curriculum/interview_prep/common_bugs_solutions.md)

---

## 4. Conceptos Fundamentales - Definiciones

### Memoization vs Memorización

**Memorización** (humana):
- Recordar información pasivamente
- Ejemplo: "París es la capital de Francia"

**Memoization** (programación):
- **Cachear resultados** de funciones costosas
- **Regla**: Si inputs iguales → devolver resultado guardado
- **Ejemplo**: `useMemo`, `useCallback`, `React.memo`

**Analogía**: Microondas con función "repetir último plato"
- Primera vez: cocinar 10 min
- Segunda vez (mismo plato): 0 min (ya está listo)
- Plato diferente: volver a cocinar

### Inmutabilidad

**Definición**: No modificar datos existentes, crear nuevas copias.

**Por qué en React**: React detecta cambios por **referencia**, no por valor.

```tsx
// ❌ Mutable (React no detecta cambio)
const obj = { name: 'John' };
obj.name = 'Jane';
setState(obj); // misma referencia

// ✅ Inmutable (React detecta cambio)
const obj = { name: 'John' };
setState({ ...obj, name: 'Jane' }); // nueva referencia
```

### Shallow vs Deep Comparison

**Shallow** (React.memo, useEffect deps):
```js
// Solo compara primer nivel
{ a: 1, b: 2 } === { a: 1, b: 2 } // false (diferentes referencias)
```

**Deep**:
```js
// Compara recursivamente todos los niveles
_.isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }) // true
```

**Implicación**: `useEffect([user])` se dispara si `user` es nuevo objeto, aunque valores sean iguales.

---

## 5. Checklist de Preparación para Entrevistas

### React
- [ ] Explicar `useMemo`, `useCallback`, `React.memo` con ejemplos
- [ ] Resolver bug de inmutabilidad en vivo
- [ ] Implementar virtualization con `react-window`
- [ ] Optimizar componente con múltiples re-renders
- [ ] Explicar cuándo NO usar memoization

### .NET Core
- [ ] Optimizar query EF Core con `AsNoTracking()`
- [ ] Convertir query con `.Include()` a projection
- [ ] Implementar caching con Redis
- [ ] Añadir pagination a endpoint
- [ ] Explicar diferencia entre AddScoped/AddTransient/AddSingleton

### Arquitectura
- [ ] Diseñar API RESTful con versionado
- [ ] Explicar estrategia de caching (L1/L2/L3)
- [ ] Proponer solución para N+1 problem
- [ ] Diseñar health checks para microservicios
- [ ] Explicar trade-offs de CQRS

### Soft Skills
- [ ] Admitir "no sé" con confianza y proponer cómo aprenderlo
- [ ] Pedir clarificaciones en requisitos ambiguos
- [ ] Explicar trade-offs de cada decisión técnica
- [ ] Mencionar observability (logs, metrics, traces)

---

## 6. Recursos Rápidos

### React Performance
- [React.memo docs](https://react.dev/reference/react/memo)
- [react-window GitHub](https://github.com/bvaughn/react-window)
- [useMemo vs useCallback](https://react.dev/reference/react/useMemo)

### .NET Optimization
- [EF Core Performance](https://learn.microsoft.com/en-us/ef/core/performance/)
- [AsNoTracking](https://learn.microsoft.com/en-us/ef/core/querying/tracking)
- [Response Caching](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/response)

### Arquitectura
- [REST API Best Practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [Caching Strategies](https://aws.amazon.com/caching/best-practices/)

---

### 🧠 Key Insight

> **El conocimiento técnico sin contexto de cuándo aplicarlo es teoría. La diferencia entre Mid-Level y Senior es saber identificar el problema correcto antes de proponer la optimización. AsNoTracking() en un query que ejecuta 10 veces al día es optimización prematura. En un endpoint con 1M requests/día es requisito operacional.**

---

**Última revisión**: 2025-10-23
**Próxima actualización**: Después de entrevista real con Paylocity
**Estado**: ✅ Listo para preparación técnica
