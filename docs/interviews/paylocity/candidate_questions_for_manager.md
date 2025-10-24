# Preguntas Inteligentes para el Hiring Manager

**Posición**: Engineer Software – Workflows, Paylocity
**Objetivo**: Demostrar investigación, interés genuino y pensamiento técnico profundo
**Preparado**: 2025-10-24

---

## Instrucciones de Uso

- **Timing**: Últimos 5-10 min de la entrevista
- **Cantidad**: Seleccionar 4-5 preguntas (no todas)
- **Tono**: Curioso, colaborativo (no interrogatorio)
- **Seguimiento**: Escuchar respuesta y hacer follow-up natural

---

## Categoría 1: Roadmap y Visión del Producto

### Pregunta 1: Arquitectura de Workflows

**Pregunta**:
> "He visto que Paylocity maneja workflows complejos de aprobaciones multi-step (onboarding, time-off, benefits enrollment). **¿Cómo está arquitectado actualmente el sistema de orquestación?** ¿Usan un workflow engine (Temporal, AWS Step Functions) o es orquestación custom? ¿Y cuáles son los retos principales que están enfrentando al escalar?"

**Intención**:
- Mostrar conocimiento de dominio (aprobaciones multi-step)
- Evaluar madurez técnica del sistema
- Identificar problemas donde podrías contribuir

**Follow-up posible**:
- "¿Qué porcentaje de workflows son straightforward vs los que requieren lógica condicional compleja?"
- "¿Cómo manejan compensations si un step falla a mitad de camino?"

---

### Pregunta 2: Idempotencia y Retries

**Pregunta**:
> "En sistemas distribuidos de workflows, **idempotencia y retry logic son críticos**. ¿Cómo aseguran que si un workflow step se reintenta (por timeout o fallo de red), no se ejecute dos veces? ¿Usan tokens de idempotencia, event sourcing, o algún patrón específico?"

**Intención**:
- Demostrar conocimiento de patrones enterprise
- Identificar si tienen problemas de duplicación
- Mostrar que piensas en edge cases

**Follow-up posible**:
- "¿Han tenido incidentes donde un retry causó duplicación (ej: dos notificaciones al mismo aprobador)?"
- "¿Cómo monitorean tasas de retry y success rates por tipo de workflow?"

---

### Pregunta 3: Observability y Debugging

**Pregunta**:
> "Cuando un workflow multi-step falla (por ejemplo, una aprobación de PTO se queda stuck en step 3 de 5), **¿cómo debuggean?** ¿Tienen dashboards con métricas de duración por step, logs estructurados, distributed tracing? ¿Qué herramientas usan (Datadog, Splunk, custom)?"

**Intención**:
- Mostrar que valoras observability desde día 1
- Entender tooling disponible
- Identificar gap donde podrías mejorar DX

**Follow-up posible**:
- "¿Qué porcentaje de workflows fallan y cuál es el MTTR típico?"
- "¿Tienen alertas automáticas si un workflow tarda >X tiempo en completar?"

---

## Categoría 2: Equipo y Colaboración

### Pregunta 4: Estructura del Equipo

**Pregunta**:
> "**¿Cómo está estructurado el equipo de Workflows?** ¿Es un squad autónomo con backend, frontend, QA y product? ¿O colaboran con múltiples equipos (platform, infra, compliance)? ¿Y cómo manejan dependencias cross-team?"

**Intención**:
- Entender dinámica de trabajo
- Evaluar autonomía vs dependencias
- Prepararte para tipo de colaboración esperada

**Follow-up posible**:
- "¿Qué tan frecuentemente colaboran con equipo de compliance? (imagino que workflows de aprobaciones tienen requisitos regulatorios)"
- "¿Usan RFCs o algún proceso de design docs para cambios arquitecturales grandes?"

---

### Pregunta 5: Code Review y Calidad

**Pregunta**:
> "**¿Cómo es el proceso de code review en el equipo?** ¿Todos los PRs requieren aprobación? ¿Tienen checklist específico para workflows (ej: verificar idempotencia, timeouts, audit logging)? ¿Y cómo balancean velocidad vs thoroughness?"

**Intención**:
- Mostrar que valoras calidad y colaboración
- Entender estándares del equipo
- Prepararte para nivel de rigor esperado

**Follow-up posible**:
- "¿Tienen guidelines de cuándo es aceptable mergear con 'LGTM' vs cuando requieren deep dive?"
- "¿Hacen pair programming para features críticas de workflows?"

---

## Categoría 3: Tecnología y Stack

### Pregunta 6: Stack y Modernización

**Pregunta**:
> "Vi que usan **.NET y React** (alineado con mi experiencia). **¿Qué versión de .NET?** ¿Están en .NET 8 o migrando desde Framework? ¿Y en frontend, usan alguna librería específica para gestión de estado complejo (Redux, Zustand, React Query)?"

**Intención**:
- Confirmar alignment técnico
- Entender si hay tech debt o modernización en curso
- Prepararte para ramping period

**Follow-up posible**:
- "Si están en .NET Framework, ¿hay roadmap para migrar a .NET 8? (aprendí patrones de migración en proyectos previos)"
- "¿Tienen microservices o es monolito modular?"

---

### Pregunta 7: Testing Strategy

**Pregunta**:
> "Para workflows complejos, **testing es crítico** (no quieres que una aprobación de payroll falle en producción). **¿Qué estrategia de testing usan?** ¿Tienen tests end-to-end automatizados que simulan workflows completos? ¿Usan test doubles para aprobadores humanos? ¿Y cuál es la cobertura de tests actual?"

**Intención**:
- Demostrar que piensas en calidad desde diseño
- Entender madurez de QA
- Identificar dónde podrías agregar valor (ej: mejorar coverage)

**Follow-up posible**:
- "¿Cómo testean escenarios de timeout o latencia alta en sistemas externos?"
- "¿Tienen ambientes de staging que replican producción (data volumen, latencia)?"

---

## Categoría 4: Carrera y Expectativas

### Pregunta 8: Definición de Éxito

**Pregunta**:
> "**¿Cómo se ve el éxito en este rol en los primeros 90 días?** ¿Hay métricas específicas (velocity, bug reduction, features shipped) o es más cualitativo? ¿Y qué sería un 'home run' en el primer trimestre?"

**Intención**:
- Mostrar que quieres entregar valor rápido
- Clarificar expectativas desde inicio
- Prepararte para onboarding enfocado

**Follow-up posible**:
- "¿Hay features específicas en el roadmap para Q1 2025 donde podría contribuir?"
- "¿Esperan que empiece con bugs/refactoring o puedo tomar features nuevas desde semana 2-3?"

---

### Pregunta 9: Growth Path

**Pregunta**:
> "**¿Cómo es el crecimiento típico para este rol?** ¿Hay path de IC (Individual Contributor) hasta Staff/Principal Engineer? ¿O eventualmente se espera transición a management? ¿Y qué habilidades valoran para promover de Mid-Senior a Senior-Staff?"

**Intención**:
- Mostrar interés en long-term con la empresa
- Entender si hay ceiling o oportunidad de crecimiento
- Clarificar si es track técnico vs management

**Follow-up posible**:
- "¿Tienen programa de mentoría interno o pair programming estructurado?"
- "¿Dan tiempo para contribuciones open-source o tech debt sprints?"

---

## Categoría 5: Retos y Oportunidades

### Pregunta 10: Mayor Reto Técnico Actual

**Pregunta**:
> "**¿Cuál es el mayor reto técnico que enfrenta el equipo de Workflows ahora mismo?** ¿Es performance bajo carga (scaling), tech debt acumulado, o complejidad de orquestación? ¿Y qué soluciones están explorando?"

**Intención**:
- Identificar problemas reales donde podrías ayudar
- Mostrar que quieres contribuir, no solo "hacer el trabajo"
- Evaluar si el reto te motiva

**Follow-up posible**:
- "¿Cómo priorizan entre features nuevas vs refactoring/performance?"
- "Si tuviera que elegir UN problema para resolver en mi primer mes, ¿cuál tendría más impacto?"

---

## Pregunta Bonus: Cultura de Aprendizaje

### Pregunta 11: Aprendizaje y Experimentación

**Pregunta**:
> "**¿Cómo fomenta el equipo aprendizaje continuo?** ¿Tienen tech talks internos, budget para conferencias, tiempo dedicado para explorar nuevas tecnologías? ¿Y cómo manejan experimentos (ej: probar nueva librería de workflows) sin arriesgar producción?"

**Intención**:
- Evaluar cultura de innovación vs "solo cumplir deadlines"
- Entender si hay espacio para proponer mejoras
- Clarificar si valoran growth mindset

**Follow-up posible**:
- "¿Han experimentado con workflow engines modernos (Temporal, Cadence) o están contentos con solución actual?"
- "¿Hay algún 'pet project' reciente del equipo que resultó en mejora significativa?"

---

## Preguntas para Closing (Últimas 2 minutos)

### Pregunta de Cierre

**Pregunta**:
> "Una última pregunta: **¿Qué es lo que más te gusta de trabajar en Paylocity y en este equipo específicamente?**"

**Intención**:
- Terminar en tono positivo y personal
- Obtener insight no-oficial sobre cultura
- Construir conexión con el manager

---

## Estrategia de Selección de Preguntas

### Si tienes 10 minutos, pregunta:
1. **Arquitectura de Workflows** (técnico, muestra expertise)
2. **Observability y Debugging** (muestra que piensas en DX)
3. **Definición de Éxito** (pragmático, muestra ownership)
4. **Mayor Reto Técnico** (identifica dónde ayudar)
5. **Pregunta de cierre** (personal)

### Si tienes 5 minutos, pregunta:
1. **Arquitectura de Workflows**
2. **Definición de Éxito**
3. **Pregunta de cierre**

### Si el manager menciona algo interesante durante su respuesta:
- Haz follow-up natural (no pegarte al script)
- Ejemplo: Si dice "estamos migrando a microservices", pregunta "¿Qué estrategia de migración usan? ¿Strangler pattern?"

---

## Do's y Don'ts

### ✅ Do's
- Haz preguntas que demuestren que **investigaste** (menciona algo específico de Paylocity)
- Conecta con **tu experiencia** ("en PlanetTogether vimos problema similar, ¿cómo lo manejan aquí?")
- Escucha activamente y haz **follow-ups** (no solo leer lista)
- Toma **notas** (muestra interés genuino)

### ❌ Don'ts
- No preguntes cosas que están en la descripción del puesto o sitio web
- No hagas preguntas de "sí/no" (muy cerradas)
- No interrumpas respuesta del manager
- No preguntes sobre beneficios/vacaciones con manager técnico (eso es para HR)

---

**Próximo paso**: Revisar [45min_runbook.md](./45min_runbook.md) para timing de estas preguntas en la entrevista.
