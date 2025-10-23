# Common Bugs & Solutions - Interview Favorites

**Contexto**: Bugs típicos en entrevistas técnicas
**Audiencia**: Senior Full-Stack Developer preparation
**Stack**: React + TypeScript + .NET Core

---

## Tabla de Contenidos

1. [React Bugs](#react-bugs)
2. [.NET/C# Bugs](#netc-bugs)
3. [Async/Await Pitfalls](#asyncawait-pitfalls)
4. [State Management Gotchas](#state-management-gotchas)

---

## React Bugs

### Bug #1: Mutación Directa de Estado (CRÍTICO)

**Escenario real**: Checkbox no actualiza cuando se hace clic.

#### Código Problemático

```tsx
import { useState } from 'react';

function TodoList() {
  const [items, setItems] = useState([
    { id: 1, title: 'Task 1', complete: false },
    { id: 2, title: 'Task 2', complete: false },
  ]);

  const handleToggle = (item) => {
    // 🔴 ERROR 1: Mutación directa del array
    const indexFound = items.findIndex(i => i.title === item.title);

    // 🔴 ERROR 2: Modificar objeto directamente
    items[indexFound].complete = !items[indexFound].complete;

    // 🔴 ERROR 3: setItems recibe la MISMA referencia
    setItems(items); // React no detecta cambio
  };

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <input
            type="checkbox"
            checked={item.complete}
            onChange={() => handleToggle(item)}
          />
          {item.title}: {item.complete ? 'Yes' : 'No'}
        </li>
      ))}
    </ul>
  );
}
```

#### ¿Por Qué Falla?

React detecta cambios comparando **referencias**, no valores profundos:

```tsx
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);

console.log(arr1 === arr2); // true (misma referencia)
// React piensa: "no cambió, no re-renderizo"
```

#### Solución Correcta (Inmutabilidad)

```tsx
const handleToggle = (item) => {
  // ✅ Crear NUEVO array con map (inmutable)
  setItems(items.map(i =>
    i.id === item.id
      ? { ...i, complete: !i.complete } // nuevo objeto
      : i // mismo objeto si no coincide
  ));
};
```

#### Solución Alternativa (filter + spread)

```tsx
const handleToggle = (item) => {
  // Encuentra el item
  const updatedItem = { ...item, complete: !item.complete };

  // Crea nuevo array reemplazando el item
  setItems([
    ...items.filter(i => i.id !== item.id),
    updatedItem
  ]);
};
```

#### Código Completo Corregido

```tsx
import React, { useState } from 'react';

function TodoList() {
  const [items, setItems] = useState([
    { id: 1, title: 'Task 1', complete: false, priority: 1 },
    { id: 2, title: 'Task 2', complete: false, priority: 2 },
  ]);

  // ✅ Handler inmutable
  const handleToggle = (item) => {
    setItems(items.map(i =>
      i.id === item.id
        ? { ...i, complete: !i.complete }
        : i
    ));
  };

  // ✅ Sort inmutable (crea nuevo array)
  const sortedItems = [...items].sort((a, b) => a.priority - b.priority);

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Priority</th>
          <th>Complete</th>
        </tr>
      </thead>
      <tbody>
        {sortedItems.map(item => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.priority}</td>
            <td>
              <input
                type="checkbox"
                checked={item.complete}
                onChange={() => handleToggle(item)}
              />
              {item.complete ? 'Yes' : 'No'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TodoList;
```

#### Regla de Oro: Operaciones Inmutables

```tsx
// ❌ NUNCA (mutan el original)
array.push(item);
array.pop();
array.splice(index, 1);
array[index] = newValue;
array.sort();
object.property = newValue;

// ✅ SIEMPRE (crean nuevas referencias)
[...array, item]
array.slice(0, -1)
array.filter((_, i) => i !== index)
array.map((el, i) => i === index ? newValue : el)
[...array].sort()
{ ...object, property: newValue }
```

---

### Bug #2: useEffect Loop Infinito

#### Código Problemático

```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // 🔴 LOOP INFINITO
  useEffect(() => {
    fetchUser(userId).then(data => setUser(data));
  }, [user]); // user cambia → efecto ejecuta → user cambia...

  return <div>{user?.name}</div>;
}
```

#### Solución

```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // ✅ Solo ejecutar cuando userId cambia
  useEffect(() => {
    fetchUser(userId).then(data => setUser(data));
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

#### Variante: Objeto en Dependencias

```tsx
function DataFetcher({ filters }) {
  const [data, setData] = useState([]);

  // 🔴 LOOP - filters es nuevo objeto en cada render del padre
  useEffect(() => {
    fetchData(filters).then(setData);
  }, [filters]); // { dept: 'IT' } !== { dept: 'IT' }
}
```

**Soluciones**:

```tsx
// Opción 1: Destructurar dependencias específicas
useEffect(() => {
  fetchData(filters).then(setData);
}, [filters.dept, filters.location]); // primitivos

// Opción 2: useMemo en el padre
const Parent = () => {
  const filters = useMemo(() => ({
    dept: 'IT',
    location: 'NY'
  }), []); // mismo objeto

  return <DataFetcher filters={filters} />;
};

// Opción 3: JSON.stringify (simple pero no ideal)
useEffect(() => {
  fetchData(filters).then(setData);
}, [JSON.stringify(filters)]);
```

---

### Bug #3: Stale Closures en Callbacks

#### Código Problemático

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // 🔴 count capturado del momento en que se creó la función
    setTimeout(() => {
      setCount(count + 1); // siempre suma sobre valor viejo
    }, 1000);
  };

  // Click 3 veces rápido → count = 1 (no 3)
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

#### Solución: Functional Update

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // ✅ Usa valor actual del estado
    setTimeout(() => {
      setCount(prev => prev + 1);
    }, 1000);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

---

### Bug #4: Missing Key en Listas

#### Código Problemático

```tsx
function TodoList({ items }) {
  return (
    <ul>
      {/* 🔴 Usar index como key causa bugs en listas dinámicas */}
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>
      ))}
    </ul>
  );
}
```

**Problema**: Si items se reordenan, React confunde qué elemento es cuál.

#### Solución

```tsx
function TodoList({ items }) {
  return (
    <ul>
      {/* ✅ Usar ID único y estable */}
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

**Cuándo está OK usar index**:
- Lista es estática (nunca cambia)
- Items no tienen IDs únicos
- No hay reordenamiento, filtrado o eliminación

---

### Bug #5: Event Handlers sin useCallback (Rompe React.memo)

#### Código Problemático

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // 🔴 Nueva función en cada render
  const handleClick = () => {
    setCount(c => c + 1);
  };

  return (
    <div>
      <Child onClick={handleClick} /> {/* Child re-renderiza siempre */}
      <p>Count: {count}</p>
    </div>
  );
}

const Child = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});
```

#### Solución

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // ✅ Función estable
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <Child onClick={handleClick} /> {/* Child NO re-renderiza */}
      <p>Count: {count}</p>
    </div>
  );
}

const Child = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});
```

---

## .NET/C# Bugs

### Bug #1: DbContext Inyectado como Singleton

#### Código Problemático

```cs
// Startup.cs
// 🔴 ERROR - DbContext no debe ser Singleton
services.AddSingleton<ApplicationDbContext>();

// Controller
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmployeesController(ApplicationDbContext context)
    {
        _context = context; // Mismo contexto para TODOS los requests
    }
}
```

**Problema**:
- DbContext no es thread-safe
- Acumula entidades trackeadas (memory leak)
- Conexiones no se liberan

#### Solución

```cs
// ✅ SIEMPRE Scoped para DbContext
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
```

---

### Bug #2: Olvidar AsNoTracking en Queries Read-Only

#### Código Problemático

```cs
[HttpGet]
public async Task<IActionResult> GetEmployees()
{
    // 🔴 Tracking innecesario (30-40% más lento)
    var employees = await _context.Employees
        .Include(e => e.Department)
        .ToListAsync();

    return Ok(employees);
}
```

#### Solución

```cs
[HttpGet]
public async Task<IActionResult> GetEmployees()
{
    // ✅ AsNoTracking para read-only
    var employees = await _context.Employees
        .AsNoTracking()
        .Include(e => e.Department)
        .ToListAsync();

    return Ok(employees);
}
```

---

### Bug #3: Comparación de Strings Case-Sensitive

#### Código Problemático

```cs
public bool IsAdmin(string role)
{
    // 🔴 Case-sensitive: "Admin" != "admin"
    return role == "Admin";
}
```

#### Solución

```cs
public bool IsAdmin(string role)
{
    // ✅ Case-insensitive
    return role?.Equals("Admin", StringComparison.OrdinalIgnoreCase) == true;

    // O más corto:
    return string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);
}
```

---

### Bug #4: Concatenar Strings en Loop

#### Código Problemático

```cs
public string BuildReport(List<string> lines)
{
    string report = "";

    // 🔴 Crea nuevo string en cada iteración (O(n²))
    foreach (var line in lines)
    {
        report += line + "\n";
    }

    return report;
}
```

#### Solución

```cs
public string BuildReport(List<string> lines)
{
    // ✅ StringBuilder (O(n))
    var sb = new StringBuilder();

    foreach (var line in lines)
    {
        sb.AppendLine(line);
    }

    return sb.ToString();
}
```

---

## Async/Await Pitfalls

### Bug #1: async void (NUNCA uses esto)

#### Código Problemático

```cs
// 🔴 PELIGRO - excepción no se puede capturar
public async void SendEmailAsync(string to, string body)
{
    await _emailService.SendAsync(to, body);
    throw new Exception("Email failed"); // crash silencioso
}

// Controller
[HttpPost("send")]
public IActionResult SendEmail(EmailRequest request)
{
    SendEmailAsync(request.To, request.Body); // fire-and-forget
    return Ok(); // no espera resultado
}
```

#### Solución

```cs
// ✅ SIEMPRE async Task (o async Task<T>)
public async Task SendEmailAsync(string to, string body)
{
    await _emailService.SendAsync(to, body);
}

// Controller
[HttpPost("send")]
public async Task<IActionResult> SendEmail(EmailRequest request)
{
    await SendEmailAsync(request.To, request.Body);
    return Ok();
}
```

**Única excepción**: Event handlers en UI (WPF, WinForms).

---

### Bug #2: Deadlock con .Result o .Wait()

#### Código Problemático

```cs
public IActionResult GetData()
{
    // 🔴 DEADLOCK en ASP.NET (pre-Core)
    var data = _service.GetDataAsync().Result;
    return Ok(data);
}
```

**Por qué deadlock**:
1. Thread principal espera en `.Result`
2. Async operation intenta volver al contexto original (ocupado)
3. Deadlock

#### Solución

```cs
// ✅ Usa async/await correctamente
public async Task<IActionResult> GetData()
{
    var data = await _service.GetDataAsync();
    return Ok(data);
}
```

**Nota**: En ASP.NET Core no hay deadlock (no hay SynchronizationContext), pero `.Result` sigue siendo mala práctica.

---

### Bug #3: Olvidar await

#### Código Problemático

```cs
public async Task ProcessOrderAsync(int orderId)
{
    // 🔴 Olvidó await - método retorna inmediatamente
    UpdateInventoryAsync(orderId); // fire-and-forget
    SendConfirmationEmailAsync(orderId); // fire-and-forget

    await _context.SaveChangesAsync(); // guarda antes de procesar
}
```

#### Solución

```cs
public async Task ProcessOrderAsync(int orderId)
{
    // ✅ Await todas las operaciones async
    await UpdateInventoryAsync(orderId);
    await SendConfirmationEmailAsync(orderId);
    await _context.SaveChangesAsync();
}

// O en paralelo si son independientes:
public async Task ProcessOrderAsync(int orderId)
{
    var inventoryTask = UpdateInventoryAsync(orderId);
    var emailTask = SendConfirmationEmailAsync(orderId);

    await Task.WhenAll(inventoryTask, emailTask);
    await _context.SaveChangesAsync();
}
```

---

## State Management Gotchas

### Bug #1: Zustand - Mutación Directa del State

#### Código Problemático

```tsx
import create from 'zustand';

const useStore = create((set) => ({
  items: [],
  addItem: (item) =>
    // 🔴 Mutación directa
    set((state) => {
      state.items.push(item); // ¡No!
      return state;
    }),
}));
```

#### Solución

```tsx
const useStore = create((set) => ({
  items: [],
  addItem: (item) =>
    // ✅ Inmutable
    set((state) => ({
      items: [...state.items, item]
    })),
}));
```

---

### Bug #2: Context Re-renders Innecesarios

#### Código Problemático

```tsx
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // 🔴 Nuevo objeto en cada render
  const value = { user, setUser, theme, setTheme };

  return (
    <AppContext.Provider value={value}>
      {children} {/* todos los consumers re-renderizan */}
    </AppContext.Provider>
  );
}
```

#### Solución

```tsx
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // ✅ Memoizar value
  const value = useMemo(
    () => ({ user, setUser, theme, setTheme }),
    [user, theme]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

---

### 🧠 Key Insight

> **Los bugs más comunes en entrevistas no son los más complejos — son los que revelan falta de comprensión de fundamentos. Mutar estado en React, usar .Result en async code, o inyectar DbContext como Singleton son errores que un Senior nunca debería cometer. Conocer estos patrones de memoria separa candidatos que "saben React" de los que "entienden React".**

---

## Checklist Anti-Bugs

**Antes de cada commit, pregunta**:

### React
- [ ] ¿Estoy mutando estado directamente? (usa spread/map)
- [ ] ¿Mis useEffect tienen dependencias correctas?
- [ ] ¿Pasé callbacks a React.memo sin useCallback?
- [ ] ¿Uso index como key en lista dinámica?

### .NET
- [ ] ¿DbContext es Scoped? (nunca Singleton)
- [ ] ¿Usé AsNoTracking en queries read-only?
- [ ] ¿Todos mis métodos async retornan Task (no void)?
- [ ] ¿Estoy usando await en lugar de .Result?

### General
- [ ] ¿Hay memory leaks potenciales? (event listeners, timers)
- [ ] ¿Manejé todos los casos edge? (null, vacío, error)
- [ ] ¿El código es inmutable donde debe serlo?

---

**Recursos adicionales**:
- [React Common Mistakes](https://react.dev/learn/you-might-not-need-an-effect)
- [Async Best Practices](https://learn.microsoft.com/en-us/archive/msdn-magazine/2013/march/async-await-best-practices-in-asynchronous-programming)
