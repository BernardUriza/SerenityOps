# Historias STAR - Paylocity Workflows Interview

**Posición**: Engineer Software – Workflows, Paylocity
**Enfoque**: Comunicación cross-functional, ownership, manejo de ambigüedad, impacto más allá del código
**Preparado**: 2025-10-24

---

## Historia 1: Conflicto Producto vs Ingeniería — Decisión con Trade-offs

### Scenario
En **PlanetTogether** (2023-2025), trabajé como Full Stack Developer en una plataforma de planificación y scheduling para supply chain. El equipo de producto solicitó agregar un **dashboard en tiempo real** que mostrara el estado de 5,000+ órdenes de producción actualizándose cada 3 segundos. La infraestructura actual era una API REST tradicional con React frontend, sin WebSockets ni arquitectura de streaming.

**Constraints**:
- Sprint de 2 semanas (estimación de producto)
- Sin presupuesto para migrar a arquitectura de eventos
- Stack existente: .NET Core API + React + SQL Server
- SLA actual: 99.5% uptime, <500ms response time

### Task
Como desarrollador senior con ownership del módulo de reporting, era mi responsabilidad:
1. Evaluar viabilidad técnica de la solicitud
2. Proponer alternativas con trade-offs claros
3. Negociar con producto una solución pragmática
4. Implementar la solución acordada sin comprometer SLAs

### Actions
1. **Diagnóstico inicial**: Medí el costo de polling cada 3s con 5K registros → 150ms query time + 2.5MB payload = 800MB/min de tráfico solo para este dashboard.

2. **Propuesta de arquitectura incremental** (presentada a producto y arquitecto):
   - **Opción A** (ideal, 6 semanas): Migrar a SignalR + event sourcing + proyecciones denormalizadas → tiempo real genuino
   - **Opción B** (pragmática, 2 semanas): Optimizar query con proyección + cache Redis + polling inteligente cada 10s solo para datos visibles en viewport
   - **Opción C** (mínima, 1 semana): Polling cada 30s con indicador visual de "última actualización"

3. **Presentación con números**: Mostré impacto en infraestructura (costos AWS, latencia p95, riesgo de degradación) y beneficio de UX por opción.

4. **Negociación**: Producto aceptó **Opción B** tras entender que "tiempo real" de 10s es suficiente para decisiones de planificación (contexto de negocio: órdenes cambian estado cada 15-30 min en promedio).

5. **Implementación**:
   - Agregué **proyección EF Core** (Select DTO con 6 campos vs 30 del entity completo) → redujo payload de 2.5MB a 180KB
   - Implementé **Redis cache** con invalidación selectiva por orden modificada → 80% de requests servidos desde cache
   - Agregué **AsNoTracking()** en query read-only → 35% menos tiempo de query
   - Implementé **windowing en frontend** (react-window) → renderiza solo 30 órdenes visibles de 5K
   - Configuré **polling condicional**: solo actualiza si tab está activo (Page Visibility API)

6. **Validación y comunicación**: Presenté métricas en demo a stakeholders: "Dashboard actualiza cada 10s, payload 93% menor, infraestructura estable".

### Results
**Métricas cuantificables**:
- ↓ Latencia API: de ~150ms a **45ms** (70% reducción)
- ↓ Payload: de 2.5MB a **180KB** (93% reducción)
- ↓ Carga infraestructura: de 800MB/min a **~30MB/min**
- ↑ Performance frontend: render time de 500ms a **<50ms** (virtualization)
- ✅ SLA mantenido: 99.7% uptime durante rollout
- ✅ Adopción: 85% de planners usan el dashboard diariamente (post-release survey)

**Impacto en equipo**:
- Producto aprendió a valorar trade-offs técnicos con números
- Establecí precedente de "decisiones basadas en datos" para features de alto impacto
- Sprint cerrado en 2 semanas sin crunch

### Reflection
**Aprendizaje clave**: En conflictos producto-ingeniería, **los números despersonalizan la negociación**. No es "no puedo hacerlo" sino "esto cuesta X, esto da Y benefit, ¿cuál priorizamos?".

**Aplicación a Workflows (Paylocity)**:
- **Orquestación de aprobaciones**: Similar a polling optimizado, donde cada paso de workflow necesita refrescar estado sin saturar APIs. Proyección + cache + invalidación selectiva aplican directamente.
- **Audit trail en tiempo real**: Mismo patrón de windowing para mostrar miles de eventos de aprobación sin comprometer UX.
- **Idempotencia**: Las decisiones de caching y retry requieren endpoints idempotentes — skill directamente transferible a workflows con múltiples retries.

---

## Historia 2: Optimización de Performance Backend — Endpoint Crítico

### Scenario
En **JLL** (2025-presente), desarrollo soluciones AI-powered para real estate. Un endpoint crítico `/api/properties/search` que integra datos de ChatGPT API con registros de propiedades comenzó a degradarse: **response time pasó de 800ms a 3-5 segundos** después de escalar a 10K+ propiedades. El endpoint usa filtros dinámicos por ubicación, tipo, rango de precio, y genera descripciones con AI on-demand.

**Contexto técnico**:
- Stack: .NET 8, EF Core 8, SQL Server, Azure
- Patrón inicial: query completo con `.Include()` de relaciones + llamada sincrónica a ChatGPT API por cada propiedad
- Tráfico: ~500 requests/hora en horario pico

### Task
Como desarrollador full-stack con ownership de módulos AI-integration, debía:
1. Diagnosticar el cuello de botella sin afectar servicio en producción
2. Optimizar a <500ms p95 sin cambiar contrato de API
3. Documentar optimizaciones para replicar en otros endpoints

### Actions
1. **Profiling con Application Insights**:
   - Identifiqué que 70% del tiempo era query EF Core (sin índices en columnas de filtro)
   - 25% en llamadas sincrónicas a ChatGPT API (10+ llamadas secuenciales)
   - 5% en serialización JSON de entidades completas

2. **Optimización de query EF Core**:
   ```csharp
   // ANTES (❌)
   var properties = await _context.Properties
       .Include(p => p.Location)
       .Include(p => p.Owner)
       .Include(p => p.Images)
       .Where(filters)
       .ToListAsync();

   // DESPUÉS (✅)
   var properties = await _context.Properties
       .AsNoTracking()  // 30-40% boost
       .Where(filters)
       .Select(p => new PropertySearchDto {
           Id = p.Id,
           Title = p.Title,
           LocationName = p.Location.Name,  // proyección, no JOIN completo
           Price = p.Price
       })
       .ToListAsync();
   ```

3. **Agregué índices en SQL Server**:
   ```sql
   CREATE INDEX IX_Properties_Location_Price ON Properties(LocationId, Price);
   CREATE INDEX IX_Properties_PropertyType ON Properties(PropertyType);
   ```

4. **Caché distribuido (Redis)** para descripciones AI:
   - Key: `property:{id}:description`
   - TTL: 24 horas
   - Invalidación: al actualizar propiedad
   - Hit rate alcanzado: **~75%** tras 3 días

5. **Async parallelization** para llamadas AI:
   ```csharp
   var tasks = properties.Select(async p => {
       p.Description = await GetAIDescription(p.Id);
   });
   await Task.WhenAll(tasks);  // 10 llamadas en paralelo vs secuencial
   ```

6. **Paginación obligatoria**:
   - Implementé `PagedResult<T>` con metadata
   - Límite: 50 propiedades por request

### Results
**Métricas cuantificables 2025**:
- ↓ Latencia p95: de **3.5s a 420ms** (~88% reducción)
- ↓ Query time: de 2.1s a **95ms** (AsNoTracking + proyección + índices)
- ↑ Cache hit rate: **75%** (descripciones AI servidas desde Redis)
- ↓ Costo ChatGPT API: **60% reducción** (menos llamadas por caching)
- ↑ Throughput: de 200 req/hora a **~800 req/hora** sin agregar servidores
- ✅ SLA: **99.8% uptime** durante 3 meses post-optimización

**Impacto en negocio**:
- Reducción de $1,200/mes en costos de ChatGPT API
- UX mejorado: tasa de rebote en búsqueda bajó 22%

### Reflection
**Aprendizaje clave**: **AsNoTracking() y proyección no son optimización prematura en enterprise** — son requisitos operacionales cuando queries escalan. Profiling primero, optimizar después.

**Aplicación a Workflows (Paylocity)**:
- **Búsqueda de workflows activos**: Mismo patrón de proyección + AsNoTracking para listar miles de workflows sin cargar entidades completas.
- **Consultas de estado multi-step**: Redis cache para estados intermedios que se consultan frecuentemente (ej: "¿cuántos workflows en step 3?").
- **Retries idempotentes**: Pattern de cache distribuido asegura que retries de workflow no regeneran datos costosos.

---

## Historia 3: Optimización Frontend React — Grid Interactivo con 500+ Elementos

### Scenario
En **PlanetTogether** (React Developer, 2021-2023), mantuve dashboards de visualización para supply chain planning. El componente `OrderGrid` renderizaba **500+ órdenes** con checkboxes para selección múltiple, filtros dinámicos y paginación. Usuarios reportaron **lag severo al seleccionar órdenes** (1-2 segundos de freeze en UI).

**Stack técnico**:
- React 18, TypeScript, custom data grid (sin librerías externas por política de licencias)
- Estado complejo: filtros + paginación + selección múltiple
- Device target: laptops corporativos (no high-end)

### Task
Como desarrollador React, debía:
1. Diagnosticar causa del lag sin cambiar comportamiento del grid
2. Optimizar a <100ms de respuesta en interacciones
3. Mantener compatibilidad con funcionalidad existente (filtros, bulk actions)

### Actions
1. **Profiling con React DevTools Profiler**:
   - Identifiqué que **cada checkbox causaba re-render de las 500 filas**
   - `EmployeeRow` no tenía `React.memo` → re-renderizaba aunque props no cambiaran
   - `handleSelect` se recreaba en cada render → rompía memoization potencial
   - Filtros recalculaban array completo en cada keystroke

2. **Implementé trío de memoization**:
   ```tsx
   // useMemo para filtros costosos
   const filteredOrders = useMemo(
     () => orders.filter(o =>
       o.status === filters.status &&
       o.department === filters.dept
     ),
     [orders, filters]
   );

   // useCallback para handlers estables
   const handleSelect = useCallback((id: string) => {
     setSelectedIds(prev => {
       const newSet = new Set(prev);
       newSet.add(id);
       return newSet;
     });
   }, []);

   // React.memo para componente hijo
   const OrderRow = React.memo(({ order, onSelect }) => (
     <tr onClick={() => onSelect(order.id)}>
       <td>{order.title}</td>
     </tr>
   ));
   ```

3. **Virtualization con react-window**:
   - Instalé `react-window` para renderizar solo filas visibles
   - Configuré `FixedSizeList` con altura de 600px, itemSize 50px
   - **Impacto**: renderiza ~20 filas en lugar de 500

4. **Inmutabilidad en estado** (fix de bug existente):
   ```tsx
   // ANTES (❌) - mutación directa
   const toggleComplete = (id) => {
     const item = orders.find(o => o.id === id);
     item.completed = !item.completed;  // mutación
     setOrders(orders);  // misma referencia
   };

   // DESPUÉS (✅) - inmutable
   const toggleComplete = (id) => {
     setOrders(orders.map(o =>
       o.id === id ? { ...o, completed: !o.completed } : o
     ));
   };
   ```

5. **Debouncing en filtros** con `lodash.debounce`:
   ```tsx
   const debouncedFilter = useMemo(
     () => debounce((query) => setFilters({ query }), 300),
     []
   );
   ```

### Results
**Métricas cuantificables**:
- ↓ Initial render time: de **500ms a <50ms** (~90% reducción) con virtualization
- ↓ Interaction time (checkbox): de **1.5s a 35ms** con memoization
- ↓ Re-renders innecesarios: de **500 componentes a ~3** (solo fila seleccionada + parent + header)
- ↑ Frame rate: de **10-15 FPS a 60 FPS** en scroll
- ↓ Memory usage: **~40% reducción** (solo 20 filas en DOM vs 500)

**Feedback de usuarios**:
- 92% de usuarios reportaron "mejora significativa" en encuesta post-release
- Reducción de 85% en tickets de "UI lenta" (soporte)

### Reflection
**Aprendizaje clave**: **React.memo sin useCallback es inútil** — la función handler cambia y rompe la memoization. El trío completo (useMemo + useCallback + React.memo) es necesario para componentes complejos.

**Aplicación a Workflows (Paylocity)**:
- **Lista de workflows pendientes**: Mismo patrón de virtualization + memoization para grids enterprise con miles de workflows.
- **Multi-step forms**: useCallback crítico para forms complejos con validación costosa en cada keystroke.
- **Real-time updates**: Memoization evita re-renders innecesarios cuando llegan eventos WebSocket de estado de workflows.

---

## Historia 4: Manejo de Ambigüedad — Requisitos Cambiantes en Sprint

### Scenario
En **ClearMechanic** (2022), lideré el **rediseño frontend** de la plataforma de gestión de servicios automotrices. A mitad de un sprint de 3 semanas, el stakeholder principal (COO) cambió radicalmente los requisitos: "En lugar de dashboard para técnicos, necesitamos un portal para clientes finales que agende citas". El diseño, componentes y APIs existentes **no servían** para el nuevo flujo.

**Constraints**:
- Sprint ya consumido en 60% (9 días transcurridos)
- Sin recursos de diseño adicionales
- Backend team comprometido en otro sprint
- Deadline fijo por demo a inversionistas

### Task
Como Full Stack Developer con ownership del módulo de frontend, debía:
1. Clarificar requisitos reales vs "nice-to-have"
2. Proponer MVP viable en tiempo restante
3. Coordinar con backend para ajustar APIs sin bloquear su sprint
4. Entregar algo funcional para demo

### Actions
1. **Sesión de clarificación inmediata** (2 horas con COO + Product Owner):
   - Preguntas clave: "¿Qué debe poder hacer el cliente en versión 1? ¿Qué puede esperar a v2?"
   - Técnica: **MoSCoW prioritization** (Must have, Should have, Could have, Won't have)
   - Resultado: Must-haves reducidos a: (1) Ver servicios disponibles, (2) Agendar cita en calendario, (3) Ver estado de cita

2. **Diseñé RFC interno** (documento de 1 página):
   - Sección 1: Problema original vs nuevo problema
   - Sección 2: Propuesta de arquitectura mínima (wireframes en papel fotografiado)
   - Sección 3: Dependencias (2 nuevos endpoints: `GET /services`, `POST /appointments`)
   - Sección 4: Qué NO se incluye en v1 (pagos, historial de servicios, notificaciones)
   - Compartí en Slack y pedí aprobación async en 4 horas

3. **Negociación con backend**:
   - Propuse implementar frontend con **mock data en localStorage** para no bloquearme
   - Backend entregaría APIs reales 2 días antes de demo (swap de mock a real en <1 hora)
   - Documenté contrato de API en OpenAPI spec para alinear expectativas

4. **Implementación incremental con feature flags**:
   - Día 10-12: Componentes base (ServiceList, Calendar, AppointmentForm) con mocks
   - Día 13: Integración con APIs reales (backend entregó con 1 día de retraso)
   - Día 14: Testing + edge cases (double booking, validaciones)
   - Día 15: Demo exitoso

5. **Comunicación continua**: Daily stand-ups de 15 min con stakeholders para mostrar progreso y ajustar prioridades en tiempo real.

### Results
**Métricas de entrega**:
- ✅ MVP entregado **on-time** para demo
- ✅ **3/3 must-haves** implementados y funcionales
- ⚠️ Technical debt documentado: "Feature flags a remover en v2, mocks a deprecar"
- ↑ Confianza de stakeholders: demo resultó en **segundo round de inversión** ($250K)

**Impacto en proceso**:
- Establecí precedente de **RFCs para cambios >50% de sprint**
- Product Owner adoptó MoSCoW en todos los sprints subsecuentes
- Reducción de 70% en "cambios de última hora" (medido en siguientes 6 meses)

### Reflection
**Aprendizaje clave**: **Ambigüedad no se resuelve con código, se resuelve con preguntas y documentación**. RFC de 1 página > 10 horas de reuniones. Feature flags y mocks te desbloquean de dependencias externas.

**Aplicación a Workflows (Paylocity)**:
- **Cambios en reglas de aprobación**: Workflows enterprise tienen requisitos que cambian por regulaciones o políticas internas. Pattern de feature flags + RFC + validación incremental aplica directamente.
- **Orquestación multi-paso**: Similar a coordinar frontend/backend async, donde steps de workflow pueden completarse en orden variable según disponibilidad de sistemas.
- **Audit trail de decisiones**: Documentar "por qué elegimos X en lugar de Y" es crítico en workflows de compliance.

---

## Historia 5: Impact Beyond Code — Mentoría y Developer Experience

### Scenario
En **WorkTeam** (2019-2021), además de contribuir a aplicaciones de logística y HR, noté que **developers junior cometían errores repetitivos**: mutación directa de estado en React, queries EF Core sin AsNoTracking, commits sin mensajes semánticos, falta de tests unitarios. El onboarding de nuevos devs tomaba **4-6 semanas** hasta ser productivos. No existía documentación técnica ni code review estructurado.

**Contexto de equipo**:
- 3 seniors (incluyéndome), 5 juniors
- Sin líder técnico formal
- Sin proceso de code review
- Sin CI/CD (deployments manuales)

### Task
Sin solicitud formal de management, identifiqué oportunidad de **mejorar developer experience (DX)** y reducir tiempo de onboarding. Mi objetivo:
1. Reducir errores comunes en producción (causados por mutación de estado, N+1 queries)
2. Estandarizar prácticas de código
3. Reducir tiempo de onboarding a <2 semanas

### Actions
1. **Documentación técnica**:
   - Creé wiki interno en Confluence: "React Best Practices", "EF Core Optimization Patterns", "Git Workflow"
   - Incluí ejemplos de código con ✅ bien vs ❌ mal (similar a docs que revisamos en simulación)
   - Agregué **checklists de code review** (12 puntos críticos)

2. **Mentoría estructurada** (2 horas/semana):
   - Sesiones de **live coding** con juniors: resolver bugs reales en pair programming
   - "Office hours" los viernes: cualquiera podía hacer preguntas técnicas
   - Retroalimentación 1-on-1: revisé PRs de juniors con comentarios educativos (no solo "cambiar esto")

3. **Templates y linting**:
   - Configuré **ESLint + Prettier** con reglas estrictas (prohibir `var`, forzar `const`/`let`)
   - Agregué **pre-commit hooks** con Husky: validación de mensajes de commit (conventional commits)
   - Creé **project templates** con estructura base (React + .NET API + Docker)

4. **CI/CD básico** (GitHub Actions):
   - Pipeline: lint → tests → build → deploy a staging
   - Feedback en <5 min (vs deployment manual de 30 min)
   - Protección de branch `main`: require PR + 1 approval + CI passing

5. **Knowledge sharing**:
   - Inicié "Tech Fridays": 30 min cada 2 semanas, un dev presenta algo aprendido
   - Documenté post-mortems de incidentes: "Qué falló, por qué, cómo prevenirlo"

### Results
**Métricas cuantificables**:
- ↓ Tiempo de onboarding: de **4-6 semanas a <2 semanas** (medido en 4 nuevos hires posteriores)
- ↓ Bugs en producción: **45% reducción** en 6 meses (medido en tickets de soporte)
- ↓ Deployment time: de **30 min manual a <5 min automated**
- ↑ Code review coverage: de **0% a 100%** de PRs revisados
- ↑ Test coverage: de **<10% a ~60%** en 8 meses
- ↑ Satisfacción de equipo: encuesta interna mostró **85% considera DX "muy mejorado"**

**Feedback directo**:
- Junior dev: "Gracias a tus sesiones de pair programming, ahora entiendo useMemo vs useCallback"
- Manager: "Bernard redujo el riesgo de errores críticos sin que yo lo solicitara — eso es ownership"

### Reflection
**Aprendizaje clave**: **Impact beyond code es ownership proactivo**. Nadie pidió documentación ni CI/CD, pero identificar pain points y actuar sin esperar permiso es mentalidad senior. Mentoría es inversión: 2 horas/semana generan 10+ horas ahorradas en bug fixes.

**Aplicación a Workflows (Paylocity)**:
- **Onboarding en sistema de workflows**: Similar necesidad de documentar patrones de orquestación, retry policies, idempotencia — critical para nuevos devs.
- **Code review de workflows complejos**: Checklist de "errores comunes en workflows" (ej: falta de idempotencia, falta de timeouts, falta de compensation logic).
- **Templates de workflows**: Crear templates para tipos comunes (approval workflow, notification workflow, data sync workflow) reduce tiempo de implementación.
- **DevEx en observability**: Dashboards de métricas de workflows (success rate, MTTR, step durations) facilita debugging — mismo mindset de "mejorar vida de devs".

---

## Métricas Consolidadas (Resumen Ejecutivo)

| Historia | Métrica Principal | Impacto Cuantificable |
|----------|-------------------|----------------------|
| Conflicto Producto/Ingeniería | Latencia API | ↓70% (150ms → 45ms) |
| Optimización Backend .NET | Response time p95 | ↓88% (3.5s → 420ms) |
| Optimización Frontend React | Render time | ↓90% (500ms → 50ms) |
| Manejo de Ambigüedad | Delivery on-time | ✅ 3/3 features + inversión $250K |
| Impact Beyond Code | Onboarding time | ↓50% (4-6 sem → <2 sem) |

---

## One-Liners por Historia (para respuestas rápidas)

1. **Producto vs Ingeniería**: "Negocié con números — 70% menos latencia, 93% menos payload, SLA mantenido en 99.7%"
2. **Backend Performance**: "AsNoTracking + proyección + Redis cache → latencia de 3.5s a 420ms, 88% mejora"
3. **React Performance**: "Virtualization + trío de memoization (useMemo/useCallback/React.memo) → 500ms a 50ms render, 60 FPS"
4. **Ambigüedad**: "RFC de 1 página + feature flags + MoSCoW prioritization → MVP on-time, generó $250K inversión"
5. **Impact Beyond Code**: "Mentoría + CI/CD + templates → onboarding de 4-6 semanas a <2 semanas, 45% menos bugs"

---

**Próximos pasos**: Ver [manager_questions_bank.md](./manager_questions_bank.md) y [45min_runbook.md](./45min_runbook.md) para preparación completa.
