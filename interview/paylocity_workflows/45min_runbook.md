# Runbook de 45 Minutos - Paylocity Workflows Interview

**Posición**: Engineer Software – Workflows, Paylocity (Hiring Manager Round)
**Duración**: 45 minutos (estructura típica)
**Objetivo**: Comunicar ownership, expertise técnico y fit con workflows enterprise
**Preparado**: 2025-10-24

---

## Estructura General de Tiempo

```
[0-2m]   Elevator Pitch (intro)
[2-10m]  Historia STAR #1 (Conflicto Producto/Ingeniería)
[10-18m] Historia STAR #2 (Performance Backend .NET)
[18-26m] Historia STAR #3 (Performance React)
[26-34m] Historia STAR #4 (Ambigüedad)
[34-40m] Historia STAR #5 (Impact Beyond Code)
[40-45m] Tus Preguntas + Cierre
```

**Total**: ~45 minutos (ajustable según flow natural de conversación)

---

## Bloque 1: Elevator Pitch (0-2 min)

### Script (60-90 segundos)

> "Gracias por la oportunidad. Soy **Bernard Uriza**, Full Stack Developer con **10+ años** especializándome en **.NET Core y React** para sistemas enterprise. He trabajado en **supply chain planning (PlanetTogether)**, **real estate AI (JLL)**, y **automotive management (ClearMechanic)** — todos dominios con workflows complejos y alto volumen de datos.
>
> **Tres logros recientes que me hacen buen fit para Workflows en Paylocity**:
>
> 1. **Optimicé endpoint crítico de 3.5s a 420ms** (88% mejora) usando AsNoTracking, proyección EF Core y Redis cache — relevante para consultas de estado de workflows a escala.
>
> 2. **Reduje render time en grid de 500+ elementos de 500ms a 50ms** con virtualization y memoization — aplicable a dashboards de aprobaciones multi-step.
>
> 3. **Mentoricé equipo y reduje onboarding de 4-6 semanas a <2 semanas** configurando CI/CD, documentación técnica y code reviews — mentalidad de DX e impact beyond code.
>
> **Mi interés en Workflows**: Es un problema fascinante que combina **orquestación distribuida, lógica de negocio compleja y alto impacto** (miles de empresas dependen de aprobaciones confiables). Stack es exactamente donde tengo más experiencia (.NET + React) y valoro la oportunidad de contribuir desde día 1 mientras aprendo el dominio HCM.
>
> ¿Empezamos? ¿Hay algo específico de mi experiencia que le gustaría explorar primero?"

### One-Liner Alternativo (30s si manager dice "cuéntame brevemente sobre ti")

> "10+ años en .NET y React para sistemas enterprise (supply chain, real estate AI, automotive). Especializado en performance optimization (88% mejora en latencia), React avanzado (virtualization, memoization) y mentoría de equipos. Busco aplicar expertise en workflows enterprise donde orquestación confiable es crítica."

---

## Bloque 2: Historia STAR #1 — Conflicto Producto vs Ingeniería (2-10 min)

### Trigger Probable
- "Cuéntame de un conflicto con producto."
- "Dame un ejemplo de trade-off técnico."
- "¿Cómo manejas desacuerdos en priorización?"

### Script Compacto (2-3 min)

**Scenario** (20s):
> "En PlanetTogether, producto solicitó dashboard en tiempo real con polling cada 3 segundos para 5K órdenes. Stack actual: REST tradicional, sin WebSockets. Constraint: 2 semanas, sin presupuesto para arquitectura nueva."

**Task** (10s):
> "Mi responsabilidad: evaluar viabilidad técnica, proponer alternativas con trade-offs claros y negociar solución pragmática sin comprometer SLA de 99.5%."

**Actions** (90s):
> "1. **Medí impacto**: Polling cada 3s con 5K registros = 800MB/min de tráfico, 150ms query time.
> 2. **Presenté 3 opciones** con números:
>    - Opción A (ideal, 6 sem): SignalR + event sourcing → tiempo real genuino
>    - Opción B (pragmática, 2 sem): Polling cada 10s + proyección EF Core + Redis cache
>    - Opción C (mínima, 1 sem): Polling cada 30s con indicador visual
> 3. **Negocié con contexto de negocio**: Mostré que órdenes cambian estado cada 15-30 min en promedio, así que 10s es suficiente para decisiones de planificación.
> 4. **Implementé Opción B**:
>    - Proyección EF Core (6 campos vs 30) → payload de 2.5MB a 180KB
>    - Redis cache con invalidación selectiva → 80% de requests desde cache
>    - AsNoTracking() → 35% menos query time
>    - Virtualization en frontend (react-window) → renderiza 30 filas de 5K
>    - Polling condicional: solo actualiza si tab está activo"

**Results** (30s):
> "**Métricas**: Latencia de 150ms a 45ms (70% reducción), payload 93% menor, carga de infraestructura de 800MB/min a 30MB/min, SLA mantenido en 99.7%. Producto aprendió a valorar trade-offs con números. Sprint cerrado en 2 semanas sin crunch."

**Reflection** (15s):
> "**Aprendizaje**: Los números despersonalizan la negociación. No es 'no puedo' sino 'esto cuesta X, esto da Y benefit'. **Aplicable a Workflows**: Similar patrón de polling optimizado para refrescar estado de aprobaciones sin saturar APIs. Cache + proyección + windowing aplican directamente."

### One-Liner si Tiempo Limitado
> "Negocié dashboard en tiempo real: presenté 3 opciones con impacto en infraestructura. Resultado: latencia 70% menor, payload 93% menor, SLA 99.7% mantenido."

---

## Bloque 3: Historia STAR #2 — Performance Backend .NET (10-18 min)

### Trigger Probable
- "Dame un ejemplo de optimización backend."
- "¿Cómo debuggeas problemas de performance?"
- "Cuéntame sobre decisión basada en datos."

### Script Compacto (2-3 min)

**Scenario** (20s):
> "En JLL, endpoint `/api/properties/search` se degradó de 800ms a 3-5 segundos tras escalar a 10K propiedades. Integra ChatGPT API con SQL. Tráfico: 500 req/hora en pico."

**Task** (10s):
> "Diagnosticar cuello de botella sin afectar producción, optimizar a <500ms p95 sin cambiar contrato de API."

**Actions** (90s):
> "1. **Profiling con Application Insights**: 70% tiempo era query EF Core (sin índices), 25% llamadas sincrónicas a ChatGPT, 5% serialización JSON.
> 2. **Optimización de query**:
>    - Agregué AsNoTracking() → 30-40% boost
>    - Proyección con Select() (solo 6 campos vs entidad completa)
>    - Índices SQL en columnas de filtro (Location, Price, Type)
> 3. **Cache distribuido (Redis)** para descripciones AI:
>    - Key: `property:{id}:description`, TTL 24h
>    - Hit rate: 75% tras 3 días
> 4. **Async parallelization**: 10 llamadas ChatGPT en paralelo vs secuencial
> 5. **Paginación obligatoria**: límite 50 propiedades por request"

**Results** (30s):
> "**Métricas 2025**: Latencia p95 de 3.5s a 420ms (88% reducción), query time de 2.1s a 95ms, cache hit 75%, costo ChatGPT API −60% ($1,200/mes ahorrados), throughput de 200 a 800 req/hora sin más servidores, SLA 99.8% uptime por 3 meses."

**Reflection** (15s):
> "**Aprendizaje**: AsNoTracking y proyección no son optimización prematura en enterprise — son requisitos operacionales. Profiling primero, optimizar después. **Aplicable a Workflows**: Mismo patrón para búsquedas de workflows activos (proyección + cache para estados consultados frecuentemente)."

### One-Liner si Tiempo Limitado
> "Optimicé API de búsqueda de 3.5s a 420ms: AsNoTracking + proyección + Redis cache + índices SQL. Hit rate 75%, costo API −60%."

---

## Bloque 4: Historia STAR #3 — Performance React (18-26 min)

### Trigger Probable
- "Dame ejemplo de optimización frontend."
- "¿Cómo manejas listas grandes en React?"
- "Cuéntame de un bug UI que resolviste."

### Script Compacto (2-3 min)

**Scenario** (20s):
> "En PlanetTogether, grid de 500+ órdenes con checkboxes tenía lag de 1-2 segundos al seleccionar. React 18, TypeScript, estado complejo (filtros + paginación + selección múltiple)."

**Task** (10s):
> "Optimizar a <100ms sin cambiar comportamiento del grid."

**Actions** (90s):
> "1. **Profiling con React DevTools**: Cada checkbox causaba re-render de 500 filas. Problemas: sin React.memo, handler se recreaba (rompía memoization), filtros recalculaban en cada keystroke.
> 2. **Trío de memoization**:
>    - useMemo para filtros costosos
>    - useCallback para handlers estables (evita recrear función)
>    - React.memo para componente OrderRow
> 3. **Virtualization con react-window**: Renderiza solo ~20 filas visibles en lugar de 500
> 4. **Fix de inmutabilidad**: Cambié mutación directa de array por map inmutable
> 5. **Debouncing en filtros** (300ms) con lodash.debounce"

**Results** (30s):
> "**Métricas**: Render time de 500ms a 50ms (90% reducción), interaction time de 1.5s a 35ms, re-renders de 500 a ~3 componentes, frame rate de 10-15 FPS a 60 FPS, memory −40%. Usuarios reportaron 'mejora significativa' (92% en encuesta)."

**Reflection** (15s):
> "**Aprendizaje**: React.memo sin useCallback es inútil — handler cambia y rompe memoization. Trío completo es necesario. **Aplicable a Workflows**: Dashboard de workflows pendientes con virtualization + memoization para grids enterprise."

### One-Liner si Tiempo Limitado
> "Grid de 500+ filas con lag: virtualization + trío de memoization (useMemo/useCallback/React.memo) → 500ms a 50ms, 60 FPS."

---

## Bloque 5: Historia STAR #4 — Manejo de Ambigüedad (26-34 min)

### Trigger Probable
- "Cuéntame de requisitos que cambiaron."
- "¿Cómo manejas ambigüedad?"
- "Dame ejemplo de deadline ajustado."

### Script Compacto (2-3 min)

**Scenario** (20s):
> "En ClearMechanic, a mitad de sprint (día 9 de 21), COO cambió requisitos: en lugar de dashboard para técnicos, necesitamos portal para clientes que agende citas. Diseño y APIs existentes no servían. Deadline fijo por demo a inversionistas."

**Task** (10s):
> "Clarificar requisitos reales, proponer MVP viable en tiempo restante, coordinar con backend sin bloquearlos, entregar algo funcional."

**Actions** (90s):
> "1. **Sesión de clarificación inmediata** (2h con COO + PO): MoSCoW prioritization. Must-haves: ver servicios, agendar cita, ver estado. Won't-haves: pagos, historial, notificaciones.
> 2. **RFC de 1 página**: Problema original vs nuevo, wireframes en papel, dependencias (2 endpoints nuevos), qué NO incluye v1. Aprobación async en 4h.
> 3. **Negociación con backend**: Implementé frontend con mock data en localStorage para no bloquearme. Backend entregaría APIs reales 2 días antes de demo.
> 4. **Feature flags**: Días 10-12 con mocks, día 13 integración con APIs reales (backend retrasó 1 día), día 14 testing, día 15 demo exitoso.
> 5. **Comunicación continua**: Daily stand-ups de 15 min con stakeholders."

**Results** (30s):
> "**Métricas**: MVP entregado on-time, 3/3 must-haves implementados, technical debt documentado. Demo resultó en segundo round de inversión ($250K). Establecí precedente de RFCs para cambios >50% de sprint. Reducción de 70% en 'cambios de última hora' en siguientes 6 meses."

**Reflection** (15s):
> "**Aprendizaje**: Ambigüedad se resuelve con preguntas y documentación, no código. RFC de 1 página > 10h de reuniones. **Aplicable a Workflows**: Reglas de aprobación cambian por regulaciones — pattern de feature flags + RFC + validación incremental aplica directamente."

### One-Liner si Tiempo Limitado
> "Requisitos cambiaron a mitad de sprint: MoSCoW + RFC + mocks para desbloqueo → MVP on-time, generó $250K inversión."

---

## Bloque 6: Historia STAR #5 — Impact Beyond Code (34-40 min)

### Trigger Probable
- "¿Qué has hecho más allá de escribir código?"
- "Dame ejemplo de mentoría."
- "¿Cómo mejoras productividad del equipo?"

### Script Compacto (2-3 min)

**Scenario** (20s):
> "En WorkTeam, juniors cometían errores repetitivos (mutación de estado, N+1 queries, commits sin mensajes semánticos). Onboarding tomaba 4-6 semanas. Sin documentación técnica ni code review estructurado. 3 seniors, 5 juniors."

**Task** (10s):
> "Sin solicitud formal, decidí mejorar DX y reducir onboarding a <2 semanas."

**Actions** (90s):
> "1. **Documentación técnica**: Wiki en Confluence con 'React Best Practices', 'EF Core Optimization', ejemplos ✅/❌, checklists de code review (12 puntos).
> 2. **Mentoría estructurada** (2h/semana): Live coding con juniors (pair programming), office hours los viernes, retroalimentación 1-on-1 en PRs con comentarios educativos.
> 3. **Templates y linting**: ESLint + Prettier con reglas estrictas, pre-commit hooks (Husky) con conventional commits, project templates (React + .NET + Docker).
> 4. **CI/CD básico** (GitHub Actions): lint → tests → build → deploy a staging en <5 min. Protección de branch main: require PR + 1 approval + CI passing.
> 5. **Knowledge sharing**: 'Tech Fridays' cada 2 semanas (30 min), post-mortems de incidentes documentados."

**Results** (30s):
> "**Métricas**: Onboarding de 4-6 sem a <2 sem (4 nuevos hires), bugs en producción −45% en 6 meses, deployment time de 30 min a <5 min, code review coverage de 0% a 100%, test coverage de <10% a 60% en 8 meses. Encuesta interna: 85% considera DX 'muy mejorado'."

**Reflection** (15s):
> "**Aprendizaje**: Impact beyond code es ownership proactivo. Nadie pidió CI/CD, pero identificar pain points y actuar sin permiso es mentalidad senior. **Aplicable a Workflows**: Templates de workflows comunes (approval, notification, data sync) reducen tiempo de implementación. DevEx en observability facilita debugging."

### One-Liner si Tiempo Limitado
> "Mentoría + CI/CD + templates + wiki técnico → onboarding de 4-6 sem a <2 sem, bugs −45%, test coverage 10% → 60%."

---

## Bloque 7: Tus Preguntas + Cierre (40-45 min)

### Selección de Preguntas (5 min disponibles)

**Preguntas recomendadas** (elegir 3-4):

1. **Arquitectura de Workflows** (técnico, muestra expertise):
   > "¿Cómo está arquitectado el sistema de orquestación? ¿Usan workflow engine o es custom? ¿Y cuáles son los retos principales al escalar?"

2. **Observability y Debugging** (muestra que piensas en DX):
   > "Cuando un workflow se queda stuck en step 3 de 5, ¿cómo debuggean? ¿Tienen dashboards con duración por step, logs estructurados, distributed tracing?"

3. **Definición de Éxito** (pragmático, muestra ownership):
   > "¿Cómo se ve el éxito en este rol en los primeros 90 días? ¿Hay métricas específicas o es cualitativo? ¿Y qué sería un 'home run' en el primer trimestre?"

4. **Mayor Reto Técnico** (identifica dónde ayudar):
   > "¿Cuál es el mayor reto técnico que enfrenta el equipo ahora? ¿Es performance, tech debt, o complejidad de orquestación? ¿Y qué soluciones están explorando?"

5. **Pregunta de Cierre** (personal, tono positivo):
   > "Una última pregunta: ¿Qué es lo que más te gusta de trabajar en Paylocity y en este equipo específicamente?"

### Cierre Final (últimos 30 segundos)

> "Gracias por el tiempo y las respuestas detalladas. Estoy muy entusiasmado con el rol — la combinación de workflows enterprise, stack .NET + React y el reto técnico que describió en [menciona algo específico que dijo el manager] son exactamente lo que busco. **¿Cuáles son los próximos pasos en el proceso?**"

---

## One-Liners de Respaldo por Historia

Si te preguntan directamente y necesitas respuesta rápida (30s cada uno):

| Historia | One-Liner |
|----------|-----------|
| Conflicto Producto | "Dashboard en tiempo real: presenté 3 opciones con números → latencia −70%, payload −93%, SLA 99.7%" |
| Performance Backend | "Endpoint de 3.5s a 420ms: AsNoTracking + proyección + Redis cache + índices SQL" |
| Performance React | "Grid de 500+ filas: virtualization + memoization → 500ms a 50ms, 60 FPS" |
| Ambigüedad | "Requisitos cambiaron a mitad de sprint: MoSCoW + RFC + mocks → MVP on-time, $250K inversión" |
| Impact Beyond Code | "Mentoría + CI/CD + templates → onboarding 4-6 sem a <2 sem, bugs −45%" |

---

## Timing Checklist (Imprimir)

```
[✓] 0-2m:   Elevator pitch entregado
[✓] 2-10m:  Historia #1 (Conflicto Producto)
[✓] 10-18m: Historia #2 (Performance Backend)
[✓] 18-26m: Historia #3 (Performance React)
[✓] 26-34m: Historia #4 (Ambigüedad)
[✓] 34-40m: Historia #5 (Impact Beyond Code)
[✓] 40-45m: Mis preguntas + cierre
```

**Nota**: Si manager pregunta algo fuera de secuencia, responde naturalmente y ajusta timing. Este runbook es guía, no camisa de fuerza.

---

## Tips de Delivery

### Voz y Tono
- Habla con **confianza pero humildad** (no arrogancia)
- Varía ritmo: más rápido en Scenario/Task, más lento en Results (para énfasis)
- Pausa 1-2 segundos después de Results (deja que números se absorban)

### Lenguaje Corporal (si es video)
- Contacto visual con cámara (no con tu pantalla)
- Gestos naturales con manos (no rígido)
- Sonríe al mencionar resultados positivos

### Manejo de Interrupciones
- Si manager interrumpe con pregunta clarificadora → responde y retoma donde quedaste
- Si pregunta es tangente → responde brevemente y pregunta "¿quieres que profundice o continúo con la historia?"
- Si manager se ve perdido → pregunta "¿tiene sentido hasta aquí o clarif

ico algo?"

### Qué Hacer si Te Quedas Sin Tiempo
- Prioriza Results sobre Actions (los números importan más que el cómo)
- Ofrece: "Tengo más detalles técnicos si le interesa, pero en resumen..."
- Salta a Reflection (el aprendizaje muestra madurez)

---

**Próximos pasos**: Practicar en voz alta 2-3 veces, revisar [cheat_cards.md](./cheat_cards.md) 10 min antes de entrevista.
