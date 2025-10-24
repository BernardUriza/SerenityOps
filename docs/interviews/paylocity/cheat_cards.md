# Cheat Cards - Paylocity Workflows Interview

**Uso**: Imprimir o tener en pantalla durante entrevista como referencia rápida
**Formato**: Bullets ultra-compactos por historia + Do's/Don'ts
**Preparado**: 2025-10-24

---

## Tarjeta #1: Conflicto Producto vs Ingeniería

**Historia**: Dashboard en Tiempo Real (PlanetTogether)

### Bullets Clave
- Producto pidió polling cada 3s para 5K órdenes → 800MB/min
- Presenté 3 opciones con números (6 sem, 2 sem, 1 sem)
- Negocié Opción B: polling 10s + proyección + Redis cache
- Implementé: payload 2.5MB → 180KB (93%), latency 150ms → 45ms (70%)
- SLA mantenido 99.7%, sprint cerrado en 2 semanas

### One-Liner
> "Negocié dashboard: presenté 3 opciones con impacto → latencia −70%, payload −93%, SLA 99.7%"

### Conexión con Workflows
- Polling optimizado para refrescar estado de aprobaciones
- Cache + proyección + windowing → aplicables a workflows multi-step

---

## Tarjeta #2: Performance Backend .NET

**Historia**: Endpoint de Búsqueda (JLL)

### Bullets Clave
- Endpoint degradado de 800ms a 3-5s (10K propiedades + ChatGPT)
- Profiling: 70% query EF Core, 25% ChatGPT calls, 5% serialization
- Optimización: AsNoTracking + proyección + índices SQL + Redis cache
- Paralelicé 10 llamadas ChatGPT + paginación obligatoria
- Resultado: 3.5s → 420ms (88%), hit rate 75%, costo API −60%

### One-Liner
> "Endpoint 3.5s → 420ms: AsNoTracking + proyección + Redis + índices SQL. Hit rate 75%, costo −60%"

### Conexión con Workflows
- Búsqueda de workflows activos → mismo patrón proyección + cache
- Redis para estados consultados frecuentemente ("¿cuántos en step 3?")

---

## Tarjeta #3: Performance React

**Historia**: Grid de 500+ Órdenes (PlanetTogether)

### Bullets Clave
- Grid con 500 filas tenía lag de 1-2s al seleccionar
- Profiling: cada checkbox causaba re-render de 500 filas
- Implementé trío: useMemo (filtros) + useCallback (handlers) + React.memo (componentes)
- Virtualization con react-window → renderiza 20 de 500
- Resultado: 500ms → 50ms render (90%), 60 FPS, memory −40%

### One-Liner
> "Grid 500+ filas: virtualization + memoization → 500ms a 50ms, 60 FPS"

### Conexión con Workflows
- Dashboard de workflows pendientes → virtualization + memoization
- Multi-step forms → useCallback crítico para validación costosa

---

## Tarjeta #4: Manejo de Ambigüedad

**Historia**: Cambio de Requisitos (ClearMechanic)

### Bullets Clave
- COO cambió requisitos a mitad de sprint (día 9 de 21): dashboard técnicos → portal clientes
- Sesión clarificación 2h: MoSCoW prioritization → 3 must-haves
- RFC de 1 página: problema, wireframes, dependencias, qué NO incluye v1
- Mocks en localStorage para no bloquearme de backend (APIs reales 2 días antes de demo)
- Resultado: MVP on-time, 3/3 features, demo generó $250K inversión

### One-Liner
> "Requisitos cambiaron a mitad de sprint: MoSCoW + RFC + mocks → MVP on-time, $250K inversión"

### Conexión con Workflows
- Reglas de aprobación cambian por regulaciones → feature flags + RFC
- Orquestación multi-paso → coordinar backend/frontend async

---

## Tarjeta #5: Impact Beyond Code

**Historia**: Mentoría y DX (WorkTeam)

### Bullets Clave
- Juniors cometían errores repetitivos (mutación estado, N+1 queries), onboarding 4-6 sem
- Sin solicitud formal: creé wiki técnico, configuré CI/CD, di mentoría 2h/semana
- Templates + linting (ESLint + Prettier) + pre-commit hooks + code review obligatorio
- GitHub Actions: deployment 30 min → 5 min. "Tech Fridays" para knowledge sharing
- Resultado: onboarding 4-6 sem → <2 sem, bugs −45%, test coverage 10% → 60%

### One-Liner
> "Mentoría + CI/CD + templates → onboarding 4-6 sem a <2 sem, bugs −45%, test coverage 60%"

### Conexión con Workflows
- Templates de workflows comunes → reduce tiempo de implementación
- Checklist de code review: errores comunes (idempotencia, timeouts, compensation)

---

## Números Clave para Memorizar

| Métrica | Antes | Después | % Mejora |
|---------|-------|---------|----------|
| Latencia API (Historia 1) | 150ms | 45ms | −70% |
| Latencia API (Historia 2) | 3.5s | 420ms | −88% |
| Payload (Historia 1) | 2.5MB | 180KB | −93% |
| Render time (Historia 3) | 500ms | 50ms | −90% |
| Onboarding (Historia 5) | 4-6 sem | <2 sem | −50% |
| Bugs producción (Historia 5) | baseline | −45% | −45% |
| Test coverage (Historia 5) | 10% | 60% | +50pp |

---

## Elevator Pitch (60s)

```
Bernard Uriza, 10+ años en .NET y React para enterprise.
Supply chain (PlanetTogether), AI (JLL), automotive (ClearMechanic).

Tres highlights:
1. Endpoint 3.5s → 420ms (88% mejora) - AsNoTracking + Redis
2. Grid 500+ filas: 500ms → 50ms - virtualization + memoization
3. Mentoría: onboarding 4-6 sem → <2 sem - CI/CD + docs

Busco Workflows porque combina orquestación distribuida
con alto impacto. Stack alineado (.NET + React).
¿Por dónde empezamos?
```

---

## Preguntas para Hacer (Top 5)

1. **Arquitectura de Workflows**:
   > "¿Cómo está arquitectado el sistema de orquestación? ¿Workflow engine o custom? ¿Retos al escalar?"

2. **Observability**:
   > "Cuando workflow se queda stuck, ¿cómo debuggean? ¿Dashboards, logs estructurados, tracing?"

3. **Definición de Éxito**:
   > "¿Cómo se ve el éxito en primeros 90 días? ¿Métricas específicas?"

4. **Mayor Reto Técnico**:
   > "¿Cuál es el mayor reto técnico ahora? ¿Performance, tech debt, complejidad?"

5. **Cierre Personal**:
   > "¿Qué es lo que más te gusta de trabajar en Paylocity?"

---

## Do's y Don'ts

### ✅ Do's
- Usa números siempre ("70% reducción", no "mejoró mucho")
- Cierra con aprendizaje + conexión a Workflows
- Si no sabes, di "no tengo experiencia directa, pero aquí mi enfoque"
- Pausa 1-2s después de métricas (deja que se absorban)
- Sonríe al mencionar resultados (energía positiva)

### ❌ Don'ts
- No divagues (>3 min = pierdes atención)
- No culpes a otros (mal team player)
- No digas "nosotros" sin aclarar tu rol
- No inventes números (usa "~aproximadamente" si estimas)
- No memorices palabra por palabra (suena robótico)

---

## Estructura STAR Compacta (2-3 min)

```
[20s] Scenario: Contexto - empresa, proyecto, constraint
[10s] Task: Tu responsabilidad específica
[90s] Actions: 3-5 bullets concretos (decisiones + trade-offs)
[30s] Results: Métricas + impacto
[15s] Reflection: Aprendizaje + aplicación a Workflows
```

---

## Conceptos Técnicos Clave

### .NET & EF Core
- **AsNoTracking()**: 30-40% boost en read-only queries
- **Proyección (Select)**: Solo campos necesarios, no entidad completa
- **Redis cache**: Distribuido para multi-server, invalidación selectiva
- **Pagination**: Obligatoria en enterprise (Skip/Take)
- **Compiled Queries**: Para queries frecuentes con diferentes parámetros

### React Performance
- **useMemo**: Memoizar valores/cálculos costosos
- **useCallback**: Memoizar funciones (evita romper React.memo)
- **React.memo**: Memoizar componentes puros
- **Virtualization (react-window)**: Renderizar solo elementos visibles
- **Inmutabilidad**: Siempre crear nuevas referencias en setState

### Workflows (conceptos transferibles)
- **Idempotencia**: Retries no duplican acciones
- **Timeouts**: Si step tarda >X, escalar a humano
- **Audit trail**: Quién aprobó qué y cuándo
- **Compensation logic**: Qué hacer si step falla a mitad de camino
- **Observability**: Dashboards de success rate, MTTR, durations por step

---

## Timing Checklist (45 min)

```
[✓] 0-2m:   Elevator pitch
[✓] 2-10m:  Historia #1 (Conflicto Producto)
[✓] 10-18m: Historia #2 (Performance Backend)
[✓] 18-26m: Historia #3 (Performance React)
[✓] 26-34m: Historia #4 (Ambigüedad)
[✓] 34-40m: Historia #5 (Impact Beyond Code)
[✓] 40-45m: Mis preguntas + cierre
```

---

## Cierre Final (30s)

> "Gracias por el tiempo. Estoy muy entusiasmado — la combinación de workflows enterprise, stack .NET + React y el reto técnico que describió en [menciona algo específico] son exactamente lo que busco. **¿Cuáles son los próximos pasos?**"

---

## Emergency One-Liners (si tiempo muy limitado)

Si manager dice "tienes 1 minuto, dime tus logros principales":

> "Tres logros: (1) Endpoint de 3.5s a 420ms con AsNoTracking + Redis — 88% mejora. (2) Grid de 500 filas de 500ms a 50ms con virtualization — 60 FPS. (3) Mentoría de equipo: onboarding de 4-6 semanas a menos de 2 — 45% menos bugs. Stack: .NET + React por 10+ años. Busco workflows enterprise donde orquestación confiable es crítica."

---

## Pre-Interview Checklist

**30 minutos antes**:
- [ ] Leer cheat cards 1 vez (no memorizar)
- [ ] Practicar elevator pitch en voz alta (1 vez)
- [ ] Revisar números clave (tabla de métricas)
- [ ] Preparar agua + silenciar notificaciones
- [ ] Test de cámara/audio

**10 minutos antes**:
- [ ] Respirar profundo 3 veces (reducir nerviosismo)
- [ ] Recordar: "Sé mi experiencia, solo comunicarla con confianza"
- [ ] Tener cheat cards visibles (pero no leerlas durante entrevista)
- [ ] Abrir 45min_runbook.md en segunda pantalla
- [ ] Join meeting 2 minutos early

**Durante entrevista**:
- [ ] Contacto visual con cámara (no con pantalla)
- [ ] Sonreír al mencionar resultados
- [ ] Pausar 1-2s después de métricas
- [ ] Tomar notas de lo que dice el manager
- [ ] Hacer follow-ups naturales (no pegarte al script)

---

## Mantra Pre-Entrevista

```
"Tengo 10+ años de experiencia real.
He entregado valor cuantificable en cada proyecto.
Solo necesito comunicarlo con claridad y confianza.
Los números hablan por sí mismos."
```

---

**Próximo paso**: Imprimir estas cheat cards y tenerlas visibles (pero no leerlas durante entrevista — solo como referencia rápida si te bloqueas).
