# React Performance Optimization Patterns

**Contexto**: Enterprise-grade React applications
**Audiencia**: Senior Full-Stack Developer interviews
**Stack**: React 18+, TypeScript, Hooks

---

## Tabla de Contenidos

1. [Trío Mágico de Memoization](#trío-mágico-de-memoization)
2. [Virtualization para Listas Grandes](#virtualization-para-listas-grandes)
3. [Code Splitting y Lazy Loading](#code-splitting-y-lazy-loading)
4. [Patrones Avanzados](#patrones-avanzados)
5. [Cuándo NO Optimizar](#cuándo-no-optimizar)

---

## Trío Mágico de Memoization

### 1. useMemo - Memoizar Valores Calculados

**Propósito**: Evitar recalcular valores costosos en cada render.

#### Sintaxis Básica

```tsx
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b] // dependencias
);
```

#### Ejemplo Real: Filtrado de Lista Grande

```tsx
function EmployeeList({ employees, filters }) {
  // ❌ Sin useMemo - filtra en CADA render
  const filteredEmployees = employees.filter(e =>
    e.department === filters.department &&
    e.skills.some(s => filters.skills.includes(s))
  );

  // ✅ Con useMemo - solo recalcula si cambian employees o filters
  const filteredEmployees = useMemo(
    () => employees.filter(e =>
      e.department === filters.department &&
      e.skills.some(s => filters.skills.includes(s))
    ),
    [employees, filters]
  );

  return <ul>{filteredEmployees.map(e => <li key={e.id}>{e.name}</li>)}</ul>;
}
```

#### Ejemplo: Cálculos Complejos

```tsx
function DataDashboard({ metrics }) {
  const statistics = useMemo(() => {
    const total = metrics.reduce((sum, m) => sum + m.value, 0);
    const average = total / metrics.length;
    const max = Math.max(...metrics.map(m => m.value));
    const min = Math.min(...metrics.map(m => m.value));

    return { total, average, max, min };
  }, [metrics]);

  return (
    <div>
      <p>Total: {statistics.total}</p>
      <p>Average: {statistics.average}</p>
    </div>
  );
}
```

#### Cuándo Usar useMemo

✅ **SÍ usar cuando**:
- Filtrado/mapeo de arrays grandes (>100 elementos)
- Cálculos matemáticos complejos
- Transformaciones de datos costosas
- Valores pasados a context providers

❌ **NO usar cuando**:
- Cálculos simples (suma de 2 números)
- Arrays pequeños (<20 elementos)
- Valores primitivos simples

---

### 2. useCallback - Memoizar Funciones

**Propósito**: Evitar crear nuevas funciones en cada render, especialmente para componentes memorizados con `React.memo`.

#### Sintaxis Básica

```tsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b] // dependencias
);
```

#### Ejemplo Real: Event Handlers

```tsx
function ParentComponent() {
  const [selectedIds, setSelectedIds] = useState(new Set());

  // ❌ Sin useCallback - nueva función en cada render
  const handleSelect = (id) => {
    setSelectedIds(prev => new Set(prev).add(id));
  };

  // ✅ Con useCallback - misma función si deps no cambian
  const handleSelect = useCallback((id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []); // sin dependencias = función estable

  return (
    <div>
      {items.map(item => (
        <ChildItem
          key={item.id}
          item={item}
          onSelect={handleSelect} // si cambia, ChildItem re-renderiza
        />
      ))}
    </div>
  );
}

const ChildItem = React.memo(({ item, onSelect }) => {
  console.log('Rendering:', item.id);
  return <button onClick={() => onSelect(item.id)}>{item.name}</button>;
});
```

**Sin `useCallback`**: `ChildItem` re-renderiza en cada click porque `handleSelect` es nueva función.

**Con `useCallback`**: `ChildItem` NO re-renderiza si `item` no cambió.

#### Ejemplo: Callbacks con Dependencias

```tsx
function SearchBar({ onSearch, filters }) {
  const [query, setQuery] = useState('');

  // useCallback con dependencias
  const handleSubmit = useCallback(() => {
    onSearch(query, filters);
  }, [query, filters, onSearch]);

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}
```

#### Cuándo Usar useCallback

✅ **SÍ usar cuando**:
- Pasas callback a componente con `React.memo`
- Callback es dependencia de `useEffect`
- Callback se pasa a múltiples hijos
- Componentes con muchos re-renders

❌ **NO usar cuando**:
- Callback solo se usa internamente en el componente
- Componente hijo no usa `React.memo`
- Performance no es problema

---

### 3. React.memo - Memoizar Componentes

**Propósito**: Evitar re-renders innecesarios de componentes cuando props no cambian.

#### Sintaxis Básica

```tsx
const MemoizedComponent = React.memo(function Component({ prop1, prop2 }) {
  return <div>{prop1} - {prop2}</div>;
});
```

#### Ejemplo Real: Lista con Muchos Elementos

```tsx
// Sin React.memo - re-renderiza TODO en cada cambio
function EmployeeRow({ employee, onSelect }) {
  console.log('Rendering:', employee.id);
  return (
    <tr>
      <td>{employee.name}</td>
      <td>{employee.department}</td>
      <td>
        <button onClick={() => onSelect(employee.id)}>Select</button>
      </td>
    </tr>
  );
}

// Con React.memo - solo re-renderiza si props cambian
const EmployeeRow = React.memo(function EmployeeRow({ employee, onSelect }) {
  console.log('Rendering:', employee.id);
  return (
    <tr>
      <td>{employee.name}</td>
      <td>{employee.department}</td>
      <td>
        <button onClick={() => onSelect(employee.id)}>Select</button>
      </td>
    </tr>
  );
});

function EmployeeTable({ employees }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <table>
      <tbody>
        {employees.map(emp => (
          <EmployeeRow
            key={emp.id}
            employee={emp}
            onSelect={handleSelect}
          />
        ))}
      </tbody>
    </table>
  );
}
```

**Resultado**: Solo re-renderiza la fila seleccionada, no todas las 500 filas.

#### Custom Comparison Function

```tsx
const EmployeeRow = React.memo(
  ({ employee, onSelect }) => (
    <tr onClick={() => onSelect(employee.id)}>
      <td>{employee.name}</td>
    </tr>
  ),
  (prevProps, nextProps) => {
    // Retornar true si props son "iguales" (NO re-renderizar)
    return (
      prevProps.employee.id === nextProps.employee.id &&
      prevProps.employee.name === nextProps.employee.name
    );
  }
);
```

#### Cuándo Usar React.memo

✅ **SÍ usar cuando**:
- Componente renderiza frecuentemente con mismas props
- Componente es "puro" (mismo input → mismo output)
- Componente es hijo de lista grande
- Performance medido y confirmado como bottleneck

❌ **NO usar cuando**:
- Props cambian frecuentemente
- Componente es muy simple (costo de memoization > costo de render)
- No hay problema de performance medido

---

## Virtualization para Listas Grandes

**Problema**: Renderizar 500+ elementos causa lag severo.

**Solución**: Solo renderizar elementos visibles en viewport.

### Usando react-window

#### Instalación

```bash
npm install react-window
```

#### Ejemplo: Lista Simple

```tsx
import { FixedSizeList } from 'react-window';

function VirtualizedEmployeeList({ employees }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {employees[index].name} - {employees[index].department}
    </div>
  );

  return (
    <FixedSizeList
      height={600}        // altura del contenedor
      itemCount={employees.length}
      itemSize={50}       // altura de cada fila
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

#### Ejemplo: Lista con Variable Height

```tsx
import { VariableSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const listRef = useRef();

  const getItemSize = (index) => {
    // Lógica para calcular altura dinámica
    return items[index].description ? 80 : 50;
  };

  const Row = ({ index, style }) => (
    <div style={style}>
      <h4>{items[index].title}</h4>
      {items[index].description && <p>{items[index].description}</p>}
    </div>
  );

  return (
    <VariableSizeList
      ref={listRef}
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {Row}
    </VariableSizeList>
  );
}
```

#### Ejemplo: Tabla Virtualizada

```tsx
import { FixedSizeList } from 'react-window';

function VirtualizedTable({ employees }) {
  const Row = ({ index, style }) => {
    const employee = employees[index];
    return (
      <div style={{ ...style, display: 'flex', borderBottom: '1px solid #ddd' }}>
        <div style={{ flex: 1 }}>{employee.name}</div>
        <div style={{ flex: 1 }}>{employee.department}</div>
        <div style={{ flex: 1 }}>{employee.email}</div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '2px solid #000' }}>
        <div style={{ flex: 1 }}>Name</div>
        <div style={{ flex: 1 }}>Department</div>
        <div style={{ flex: 1 }}>Email</div>
      </div>
      <FixedSizeList
        height={500}
        itemCount={employees.length}
        itemSize={50}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}
```

#### Performance Impact

| Métrica | Sin Virtualization | Con react-window |
|---------|-------------------|------------------|
| Elementos renderizados | 500 | ~20 (visibles) |
| Initial render time | 500ms | 5ms |
| Scroll performance | Laggy (10-15 FPS) | Smooth (60 FPS) |
| Memory usage | Alto | Bajo |

---

## Code Splitting y Lazy Loading

### React.lazy() y Suspense

```tsx
import { lazy, Suspense } from 'react';

// Lazy load componente
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading chart...</div>}>
        <HeavyChart data={chartData} />
      </Suspense>
    </div>
  );
}
```

### Route-based Code Splitting

```tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

## Patrones Avanzados

### 1. Debouncing con useMemo

```tsx
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

function SearchInput({ onSearch }) {
  const debouncedSearch = useMemo(
    () => debounce((query) => onSearch(query), 300),
    [onSearch]
  );

  return (
    <input
      type="text"
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 2. Derived State con useMemo

```tsx
function ShoppingCart({ items }) {
  const summary = useMemo(() => ({
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    tax: items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.08,
  }), [items]);

  const total = summary.subtotal + summary.tax;

  return (
    <div>
      <p>Items: {summary.itemCount}</p>
      <p>Subtotal: ${summary.subtotal}</p>
      <p>Tax: ${summary.tax}</p>
      <p>Total: ${total}</p>
    </div>
  );
}
```

### 3. Context con useMemo

```tsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Memoizar value para evitar re-renders innecesarios de consumers
  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## Cuándo NO Optimizar

### Regla de oro: Mide primero

```tsx
// ❌ Optimización prematura
const SimpleComponent = React.memo(({ name }) => <div>{name}</div>);

// ✅ Probablemente innecesario
// Este componente es tan simple que el costo de memoization > costo de render
```

### No uses useMemo para todo

```tsx
// ❌ Innecesario
const fullName = useMemo(() => firstName + ' ' + lastName, [firstName, lastName]);

// ✅ Mejor
const fullName = firstName + ' ' + lastName;
```

### Cuándo medir

```tsx
import { Profiler } from 'react';

function App() {
  const onRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  };

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MyComponent />
    </Profiler>
  );
}
```

**Herramientas**:
- React DevTools Profiler
- Chrome DevTools Performance tab
- Lighthouse

---

## Checklist de Optimización

Antes de optimizar, pregunta:

- [ ] ¿He medido el performance con DevTools?
- [ ] ¿El componente re-renderiza frecuentemente?
- [ ] ¿El cálculo es realmente costoso (>10ms)?
- [ ] ¿Las props cambian poco frecuentemente?
- [ ] ¿El componente tiene muchos hijos?

Si respondiste "Sí" a 3+ preguntas, optimiza. Si no, probablemente no vale la pena.

---

### 🧠 Key Insight

> **Memoization tiene un costo. React.memo, useMemo y useCallback agregan complejidad y consumo de memoria. La optimización correcta requiere medir primero, optimizar después. En enterprise apps con listas de 500+ elementos y re-renders frecuentes, estas herramientas son esenciales. En componentes simples, son overhead innecesario.**

---

**Recursos adicionales**:
- [React Profiler API](https://react.dev/reference/react/Profiler)
- [react-window docs](https://react-window.vercel.app/)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
