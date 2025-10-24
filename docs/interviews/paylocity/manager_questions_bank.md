# Bank de Preguntas del Manager - Paylocity Workflows

**Posición**: Engineer Software – Workflows, Paylocity
**Tipo**: Behavioral + Situational (Hiring Manager Round)
**Preparado**: 2025-10-24

---

## Instrucciones de Uso

Cada pregunta incluye:
- **Bullet de enfoque**: Qué quiere evaluar el manager
- **Historia STAR recomendada**: Referencia a `star_stories.md`
- **One-liner de respuesta**: Versión concisa si tiempo es limitado

---

## 1. Comunicación Cross-Functional

### Pregunta: "Cuéntame de una ocasión donde tuviste un conflicto con producto o diseño. ¿Cómo lo gestionaste?"

**Enfoque del manager**: Evaluar capacidad de negociación, comunicación con no-técnicos, trade-offs.

**Historia STAR recomendada**: Historia #1 (Conflicto Producto vs Ingeniería — Dashboard en Tiempo Real)

**Bullet de enfoque**:
- Mostrar que entiendes perspectiva de negocio (no solo código)
- Presentar opciones con números, no opiniones
- Llegar a compromiso pragmático (ganar-ganar)

**One-liner**:
> "En PlanetTogether, producto solicitó dashboard en tiempo real (polling cada 3s). Presenté 3 opciones con impacto en infraestructura y UX. Negociamos solución intermedia (polling cada 10s + cache Redis) que redujo latencia 70% y payload 93%, manteniendo SLA de 99.7%."

---

## 2. Decisiones con Datos

### Pregunta: "Dame un ejemplo donde cambiaste una decisión técnica basándote en datos o métricas."

**Enfoque del manager**: Evaluar mentalidad data-driven, humildad para cambiar de opinión, uso de observability.

**Historia STAR recomendada**: Historia #2 (Optimización Backend — Endpoint de JLL)

**Bullet de enfoque**:
- Iniciar con hipótesis → medir → ajustar
- Mencionar herramientas (Application Insights, Profiler, SQL Execution Plan)
- Resultados cuantificables (antes/después)

**One-liner**:
> "En JLL, asumí que lag en API de búsqueda era por ChatGPT. Application Insights mostró que 70% era query EF Core sin índices. Agregué AsNoTracking + proyección + índices SQL → latencia de 3.5s a 420ms (88% mejora). Siempre profiling antes de optimizar."

---

## 3. Ownership y Proactividad

### Pregunta: "Describe una situación donde tomaste ownership de un problema sin que te lo asignaran."

**Enfoque del manager**: Evaluar iniciativa, accountability, mentalidad de "esto es mío".

**Historia STAR recomendada**: Historia #5 (Impact Beyond Code — Mentoría en WorkTeam)

**Bullet de enfoque**:
- Identificar pain point sin que te lo pidan
- Actuar sin esperar permiso (pero comunicando)
- Medir impacto de tu intervención

**One-liner**:
> "En WorkTeam, noté que juniors cometían errores repetitivos (mutación de estado, N+1 queries). Sin que nadie lo pidiera, creé documentación técnica, configuré CI/CD y di mentoría 2h/semana. Resultado: onboarding de 4-6 semanas a <2 semanas, 45% menos bugs en producción."

---

## 4. Trade-offs en Arquitectura

### Pregunta: "Háblame de un trade-off técnico reciente que tuviste que hacer. ¿Por qué elegiste esa dirección?"

**Enfoque del manager**: Evaluar pensamiento arquitectural, consideración de long-term vs short-term, pragmatismo.

**Historia STAR recomendada**: Historia #1 o #4 (Conflicto Producto o Ambigüedad)

**Bullet de enfoque**:
- Explicar contexto (constraints de tiempo, presupuesto, equipo)
- Opciones consideradas (mínimo 2)
- Criterio de decisión (SLA, costo, time-to-market, tech debt)
- Qué harías diferente con más recursos

**One-liner**:
> "Dashboard en tiempo real: Opción ideal era SignalR + event sourcing (6 sem). Opción pragmática: polling optimizado cada 10s + Redis cache (2 sem). Elegí pragmática porque contexto de negocio no requería real-time <10s. Con más tiempo, migraría a events para escalar mejor."

---

## 5. Manejo de Ambigüedad

### Pregunta: "Cuéntame de un proyecto donde los requisitos no estaban claros o cambiaron a mitad de camino."

**Enfoque del manager**: Evaluar adaptabilidad, comunicación proactiva, técnicas para aclarar ambigüedad.

**Historia STAR recomendada**: Historia #4 (ClearMechanic — Cambio de Requisitos en Sprint)

**Bullet de enfoque**:
- Mostrar que haces preguntas (no asumes)
- Uso de frameworks (MoSCoW, RFC, MVP)
- Desbloqueo con mocks o feature flags
- Comunicación continua con stakeholders

**One-liner**:
> "En ClearMechanic, COO cambió requisitos a mitad de sprint (dashboard técnicos → portal clientes). Hice sesión de clarificación con MoSCoW, escribí RFC de 1 página, usé mocks para no bloquearme de backend. Entregué MVP on-time que generó inversión de $250K."

---

## 6. Colaboración en Equipo

### Pregunta: "¿Cómo te aseguras de que tu código sea mantenible para otros desarrolladores?"

**Enfoque del manager**: Evaluar mentalidad de equipo (no solo individualista), code review, documentación.

**Historia STAR recomendada**: Historia #5 (Impact Beyond Code — Mentoría)

**Bullet de enfoque**:
- Code reviews con comentarios educativos
- Documentación (README, inline comments, arquitectura)
- Naming conventions y linting
- Pair programming y knowledge sharing

**One-liner**:
> "En WorkTeam, establecí code review obligatorio con checklist de 12 puntos, configuré linting (ESLint + Prettier), creé wiki técnico con ejemplos ✅/❌, y di sesiones de pair programming. Resultado: test coverage de <10% a 60%, 45% menos bugs."

---

## 7. Performance bajo Presión

### Pregunta: "Cuéntame de una vez donde tuviste un deadline muy ajustado. ¿Cómo lo manejaste?"

**Enfoque del manager**: Evaluar priorización, gestión de estrés, comunicación de riesgos.

**Historia STAR recomendada**: Historia #4 (ClearMechanic — Sprint comprimido)

**Bullet de enfoque**:
- Priorización brutal (MVP, MoSCoW)
- Comunicación de riesgos temprano
- Técnicas para desbloqueo (mocks, feature flags)
- No sacrificar calidad crítica (tests de happy path mínimo)

**One-liner**:
> "En ClearMechanic, requisitos cambiaron con 60% de sprint consumido. Prioricé con MoSCoW (3 must-haves), documenté en RFC, implementé con mocks para no depender de backend. Entregué on-time con calidad suficiente para demo a inversionistas ($250K resultante)."

---

## 8. Aprendizaje y Crecimiento

### Pregunta: "Háblame de una tecnología o concepto que aprendiste recientemente. ¿Cómo lo aplicaste?"

**Enfoque del manager**: Evaluar curiosidad, capacidad de aprender rápido, aplicar conocimiento nuevo.

**Historia STAR recomendada**: Simulación Paylocity (technical learnings)

**Bullet de enfoque**:
- Contexto de por qué lo aprendiste (problema real)
- Cómo lo aprendiste (docs, cursos, experimentación)
- Aplicación práctica (no solo teoría)
- Impacto medible

**One-liner**:
> "Recientemente profundicé en react-window para virtualization. Contexto: grid de 500+ órdenes con lag severo. Aprendí via docs oficiales y experimentación en sandbox. Implementé en producción → render time de 500ms a 50ms, 60 FPS en scroll. Patrón ahora es estándar en nuestros grids enterprise."

---

## 9. Escalabilidad y Long-Term Thinking

### Pregunta: "Dame un ejemplo donde diseñaste algo pensando en escalar. ¿Qué consideraciones tomaste?"

**Enfoque del manager**: Evaluar pensamiento de arquitectura enterprise, no solo "hacer que funcione".

**Historia STAR recomendada**: Historia #2 (Optimización Backend + Redis cache)

**Bullet de enfoque**:
- Anticipar volumen futuro (usuarios, data, tráfico)
- Patrones de escalabilidad (caching, stateless, horizontal scaling)
- Trade-offs (consistencia vs disponibilidad, latencia vs throughput)
- Monitoreo y observability desde día 1

**One-liner**:
> "En JLL, endpoint de búsqueda debía escalar de 500 a 5K req/hora. Implementé Redis cache distribuido (no in-memory local) para soportar multi-server, proyección EF Core para reducir payload, índices SQL para hot queries. Resultado: 800 req/hora con misma infraestructura, headroom para 3x más con auto-scaling."

---

## 10. Debugging y Resolución de Problemas

### Pregunta: "Cuéntame de un bug crítico que resolviste. ¿Cuál fue tu enfoque?"

**Enfoque del manager**: Evaluar pensamiento analítico, uso de herramientas, comunicación durante incidentes.

**Historia STAR recomendada**: Puedes usar caso de mutación de estado en React (simulación) o improvizar

**Bullet de enfoque**:
- Reproducir el bug primero
- Hipótesis → prueba → descarte
- Herramientas (debugger, logs, profiler)
- Documentar para prevenir recurrencia

**Ejemplo de respuesta**:
> "En PlanetTogether, checkbox de selección no actualizaba UI. Reproduje en local, usé React DevTools para ver que estado no cambiaba. Identifiqué mutación directa del array (misma referencia → React no re-renderiza). Fix: map inmutable en lugar de mutación directa. Agregué regla de ESLint para prevenir en el futuro."

---

## 11. Impact Beyond Code

### Pregunta: "¿Qué has hecho para mejorar la productividad o experiencia del equipo más allá de escribir código?"

**Enfoque del manager**: Evaluar mentalidad de multiplicador de fuerza, liderazgo sin título formal.

**Historia STAR recomendada**: Historia #5 (Impact Beyond Code completa)

**Bullet de enfoque**:
- Automatización (CI/CD, linting, templates)
- Documentación y knowledge sharing
- Mentoría estructurada
- Medición de impacto (onboarding time, bug reduction)

**One-liner**:
> "En WorkTeam, configuré CI/CD (deployment de 30 min → 5 min), creé wiki técnico, di mentoría 2h/semana, inicié 'Tech Fridays' para knowledge sharing. Onboarding de 4-6 sem → <2 sem, 45% menos bugs, test coverage de 10% → 60%. Impact: equipo más autónomo y rápido."

---

## 12. Feedback y Mejora Continua

### Pregunta: "Cuéntame de una vez donde recibiste feedback negativo. ¿Cómo lo manejaste?"

**Enfoque del manager**: Evaluar humildad, growth mindset, capacidad de actuar sobre feedback.

**Bullet de enfoque**:
- Agradecer el feedback (no defensivo)
- Pedir clarificación y ejemplos concretos
- Crear plan de acción con métricas
- Follow-up para demostrar cambio

**Ejemplo de respuesta**:
> "En code review, senior señaló que mis queries EF Core traían entidades completas innecesariamente. En lugar de defenderme, pedí ejemplos de cómo hacerlo mejor. Aprendí proyección con Select(). Implementé en todos mis queries posteriores y agregué checklist de code review: '¿Usaste proyección si no necesitas entidad completa?'. Resultado: queries 40% más rápidas en promedio."

---

## Preguntas Relacionadas con Workflows Específicamente

### Pregunta: "¿Tienes experiencia con sistemas de orquestación de workflows o aprobaciones multi-step?"

**Enfoque del manager**: Evaluar familiaridad con dominio de workflows (aunque no hayas trabajado en HCM).

**Bullet de enfoque**:
- Analogías con tu experiencia (estado de órdenes en supply chain = estado de workflows)
- Conceptos relevantes: idempotencia, retries, compensation logic, timeouts
- Preguntas inteligentes sobre sistema de workflows de Paylocity

**Ejemplo de respuesta**:
> "No he trabajado directamente en HCM workflows, pero en PlanetTogether gestioné estado de órdenes de producción con pasos múltiples (planning → scheduling → execution → completion). Conceptos transferibles: idempotencia (retries no duplican órdenes), timeouts (si step tarda >X, escalar a humano), audit trail (quién aprobó qué y cuándo). En JLL, AI workflows requieren retry logic con exponential backoff por rate limits de ChatGPT. ¿Cómo manejan en Paylocity el caso donde un aprobador no responde en SLA?"

---

## Preguntas sobre Cultura Paylocity

### Pregunta: "¿Por qué Paylocity? ¿Qué te atrae de esta posición?"

**Enfoque del manager**: Evaluar si investigaste la empresa, alineación con valores, motivación real.

**Bullet de enfoque**:
- Mencionar algo específico de Paylocity (producto, tech stack, cultura)
- Conectar con tu experiencia previa
- Mostrar interés genuino en dominio de workflows/HCM

**Ejemplo de respuesta**:
> "Tres razones: (1) **Workflows es problema fascinante** — combina lógica de negocio compleja, orquestación distribuida y alto impacto en miles de empresas. (2) **Stack alineado** — .NET + React es donde tengo 10+ años, puedo contribuir desde día 1. (3) **Enterprise scale** — en PlanetTogether trabajé supply chain planning para Fortune 500; quiero aplicar esos aprendizajes (performance, observability, resilience) al dominio HCM. Pregunta: ¿Cuál es el workflow más complejo que gestionan actualmente?"

---

## Tips Generales para Responder

### Estructura STAR Compacta (2-3 min)
1. **Scenario** (15s): Contexto mínimo — empresa, proyecto, constraint
2. **Task** (10s): Tu responsabilidad específica
3. **Actions** (60-90s): 3-5 acciones concretas (bullets mentales)
4. **Results** (30s): Métricas + impacto + aprendizaje

### Do's ✅
- Usa números siempre que puedas ("70% reducción", "de 4 sem a 2 sem")
- Cierra con aprendizaje o reflexión
- Conecta con rol de Workflows si es posible
- Si no sabes, di "no tengo experiencia directa con X, pero aquí está mi enfoque para aprenderlo"

### Don'ts ❌
- No divagues (>3 min = pierdes atención)
- No culpes a otros (mal team player)
- No digas "nosotros" sin aclarar tu rol específico
- No inventes números (si no sabes, di "~aproximadamente" o "no medimos esto pero estimo...")

---

**Próximo paso**: Revisar [45min_runbook.md](./45min_runbook.md) para secuenciar estas respuestas en la entrevista.
