# 🔄 Sprint Operations & Velocity Tracking

**Documento de Governance & Operations**
**Fecha de creación:** 25 de octubre, 2025
**Versión:** 1.0.0
**Estado:** Sistema Activo

---

## 🎯 Propósito del Documento

Este documento establece el **sistema operativo de sprints** para SerenityOps, definiendo:

1. **Organización de sprints** - Estructura, cadencia, roles
2. **Sistema de labels** - Tags, colores, categorización
3. **Velocity tracking** - Métricas, baseline, ajustes
4. **Due dates policy** - Reglas de asignación temporal
5. **Rutinas operativas** - Sprint review, planning, retrospective
6. **Reportes y métricas** - KPIs, dashboards, auditoría

**Objetivo:** Pasar de "estructura y filosofía" a "ritmo y consistencia medible".

---

## 📅 1. Organización de Sprints

### Estructura de Sprint

**Cadencia:** Semanal (7 días)
**Nomenclatura:** Sprint-W{número_semana}
- Sprint-W43: 25 oct - 01 nov 2025
- Sprint-W44: 02 nov - 08 nov 2025
- Sprint-W45: 09 nov - 15 nov 2025
- Sprint-W46: 16 nov - 22 nov 2025

### Ciclo de Vida de un Sprint

```
Viernes previo: Sprint Planning
  ↓
Sábado-Viernes: Ejecución (7 días)
  ↓
Viernes/Sábado: Sprint Review + Retrospective
  ↓
Domingo: Planning siguiente sprint
```

### Fases del Sprint

| Fase | Duración | Actividades |
|------|----------|-------------|
| **Planning** | 1-2h | Selección de tarjetas, estimaciones, assignments |
| **Execution** | 6 días | Desarrollo, testing, daily updates |
| **Review** | 30 min | Demo, validación de outcomes |
| **Retrospective** | 30 min | What went well, what didn't, action items |
| **Close** | 15 min | Mover tarjetas, actualizar métricas |

---

## 🏷️ 2. Sistema de Labels

### Labels por Categoría

#### A. Sprint Tags (Temporal)

| Label | Color | Uso |
|-------|-------|-----|
| `Sprint-W43` | 🔵 Azul | Sprint actual (activo) |
| `Sprint-W44` | 🟢 Verde | Próximo sprint (en planning) |
| `Sprint-W45` | 🟠 Naranja | Sprint siguiente (futuro cercano) |
| `Sprint-W46` | 🟣 Morado | Sprint + 3 weeks |

**Regla de aplicación:**
- Toda tarjeta en `📝 To Do (Sprint)`, `⚙️ In Progress`, `🧪 Testing` debe tener sprint tag
- Al cerrar sprint, remover tag y agregar tag del siguiente sprint si aplica
- Tarjetas en `Ideas`, `Backlog` no llevan sprint tag

#### B. Priority Tags

| Label | Color | Criterio |
|-------|-------|----------|
| `P0` | 🔴 Rojo intenso | Crítico, bloquea progreso, debe hacerse este sprint |
| `P1` | 🟡 Amarillo | Alta, impacto significativo, siguiente sprint |
| `P2` | 🟤 Café | Media, nice to have, dentro de 2-4 semanas |
| `P3` | ⚪ Gris claro | Baja, futuro lejano, >1 mes |

**Criterios de Priorización (RICE):**
- **Reach:** ¿Cuántos usuarios impacta?
- **Impact:** ¿Qué tan grande es el beneficio? (1-10)
- **Confidence:** ¿Qué tan seguros estamos? (0-100%)
- **Effort:** ¿Cuánto tiempo toma? (horas)

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

#### C. Size Tags (Story Points)

| Label | Color | Horas | Descripción |
|-------|-------|-------|-------------|
| `XS` | 🟦 Azul claro | 1-2h | Quick fix, minimal change |
| `S` | 🟩 Verde claro | 3-5h | Small feature, single component |
| `M` | 🟨 Amarillo claro | 6-10h | Medium feature, multiple components |
| `L` | 🟧 Naranja claro | 11-20h | Large feature, cross-cutting |
| `XL` | 🟥 Rojo claro | 21+h | Epic, debe dividirse |

**Regla:** Tarjetas `XL` deben subdividirse en `S` o `M` antes de entrar a sprint.

#### D. Area Tags (Technical Domain)

| Label | Color | Alcance |
|-------|-------|---------|
| `UI` | 💗 Rosa | Frontend, componentes, diseño |
| `Backend` | ⬛ Gris oscuro | API, lógica de negocio, database |
| `AI` | 💜 Morado | Features con Claude, ML, embeddings |
| `Infra` | 🟫 Café oscuro | DevOps, deployment, monitoring |
| `Data` | 🔷 Azul oscuro | Database, storage, analytics |

#### E. Nature Tags (Type of Work)

| Label | Color | Uso |
|-------|-------|-----|
| `Feature` | 🟢 Verde brillante | Nueva funcionalidad |
| `Enhancement` | 🔵 Azul brillante | Mejora incremental |
| `Bug` | 🔴 Rojo brillante | Issue reportado |
| `Refactor` | 🟡 Amarillo brillante | Limpieza técnica |
| `Docs` | 📘 Azul libro | Documentación |

### Ejemplo de Tarjeta Etiquetada

```
Tarjeta: SO-DASH-FEAT-009: Pipeline Conversion Funnel
Labels:
  - Sprint-W43 (🔵)
  - P1 (🟡)
  - S (🟩)
  - UI (💗)
  - Data (🔷)
  - Feature (🟢)
```

### Sistema de Colores Visual

**Vista rápida del tablero:**
- 🔵 Sprint actual fácilmente identificable
- 🔴 Prioridades críticas destacan
- 💗💜⬛ Áreas técnicas balanceadas

---

## ⚡ 3. Velocity Tracking System

### Baseline Velocity Factor

```
Initial Velocity = 0.55 (55%)
```

**Definición:**
- Ratio de horas efectivas completadas vs horas planificadas
- Velocity 0.55 = Por cada 10h planificadas, se completan 5.5h reales
- Se recalcula semanalmente basado en completions

### Cálculo de Velocity

**Fórmula:**
```
Velocity = Horas Reales Completadas / Horas Planificadas
```

**Ejemplo Sprint W43:**
```
Planificadas: 15h
Completadas: 9h
Velocity W43 = 9 / 15 = 0.60 (60%)
```

### Ajuste de Velocity

**Velocity promedio móvil (últimos 3 sprints):**
```
Velocity Avg = (V_W43 + V_W44 + V_W45) / 3
```

**Reglas de ajuste para planning:**
- Si Velocity Avg > 0.65: Incrementar carga 10-15%
- Si Velocity Avg < 0.45: Reducir carga 10-15%
- Si Velocity Avg = 0.45-0.65: Mantener carga actual

### Capacity Planning con Velocity

**Ejemplo:**
```
Capacidad bruta disponible: 20h/semana
Velocity factor: 0.55
Capacidad efectiva: 20h × 0.55 = 11h

Planificación óptima:
- Horas a planificar: 15h (75% de capacidad bruta)
- Horas efectivas esperadas: 15h × 0.55 = 8.25h
- Buffer: 5h (25% para imprevistos)
```

### Métricas de Velocity

| Métrica | Fórmula | Target |
|---------|---------|--------|
| **Velocity Accuracy** | \|V_real - V_estimated\| / V_estimated × 100 | <20% |
| **Velocity Stability** | Std Dev(últimos 4 sprints) | <0.15 |
| **Completion Rate** | Tarjetas completadas / Tarjetas planificadas | >85% |
| **Estimation Error** | \|Horas reales - Horas estimadas\| / Horas estimadas | <30% |

---

## 📅 4. Due Dates Policy

### Reglas de Asignación

#### Tarjetas en Sprint Activo
```
Due Date = Fin del sprint actual
Ejemplo W43: Due Date = 01-nov-2025
```

#### Tarjetas por Lista

| Lista | Due Date Policy |
|-------|----------------|
| `📚 Governance & Strategy` | Sin due date (siempre vigente) |
| `📥 Inbox` | Sin due date (triage pending) |
| `💭 Ideas/Discussion` | Sin due date (exploración) |
| `📋 To Prioritize` | Sin due date (RICE pending) |
| `🔍 Refinement` | +7 días (debe salir a Ready en 1 semana) |
| `📐 Design/Specs` | +14 días (debe completar specs en 2 semanas) |
| `✅ Ready` | Sin due date (listo para sprint) |
| `📝 To Do (Sprint)` | Fin del sprint activo |
| `⚙️ In Progress` | Fin del sprint activo o antes |
| `🧪 Testing` | Fin del sprint activo |
| `✨ Polish` | +3 días post-testing |
| `🐛 Bugs` | P0: 24h, P1: 72h, P2: 1 semana |
| `✅ Done` | Sin due date (ya completado) |
| `🚀 Deployed` | Sin due date (en producción) |
| `🗂 Backlog` | Sin due date (futuro lejano) |

### Excepciones

**Bugs P0:** Siempre 24h desde detección
**Hotfixes:** Deployment inmediato, bypass de sprint
**Governance docs:** Revisión trimestral (90 días)

---

## 🔄 5. Rutinas Operativas

### Sprint Planning (Viernes/Domingo)

**Duración:** 1-2 horas
**Input:** Ready cards, velocity histórico, capacity disponible
**Output:** Sprint backlog, tarjetas con labels y due dates

**Checklist:**
- [ ] Revisar velocity del sprint anterior
- [ ] Calcular capacity disponible para nuevo sprint
- [ ] Seleccionar tarjetas de `✅ Ready` basado en RICE + capacity
- [ ] Estimar horas de cada tarjeta
- [ ] Aplicar labels (sprint, prioridad, área, tamaño)
- [ ] Asignar due dates
- [ ] Crear tarjeta "🧭 Sprint Planning – Week XX"
- [ ] Mover tarjetas a `📝 To Do (Sprint)`
- [ ] Identificar riesgos y dependencias

### Daily Progress Update (Opcional)

**Duración:** 5 minutos
**Formato:** Mental checklist o nota rápida

**Preguntas:**
1. ¿Qué se completó ayer?
2. ¿Qué se hará hoy?
3. ¿Hay blockers?

### Sprint Review (Viernes)

**Duración:** 30 minutos
**Input:** Tarjetas completadas
**Output:** Deployment decisions, feedback

**Checklist:**
- [ ] Demo de features completadas
- [ ] Validación de acceptance criteria
- [ ] Decisión de deploy o polish adicional
- [ ] Mover a `✅ Done` o `🚀 Deployed`

### Sprint Retrospective (Viernes/Sábado)

**Duración:** 30 minutos
**Input:** Sprint experience, metrics
**Output:** Action items para mejorar

**Framework:**
1. **What Went Well** ✅
2. **What Didn't Go Well** ❌
3. **Action Items** 🎯

**Métricas a revisar:**
- Velocity real vs estimado
- Completion rate
- Estimation accuracy
- Blockers encontrados
- WIP violations

### Sprint Close (Sábado)

**Duración:** 15 minutos

**Checklist:**
- [ ] Actualizar velocity report con métricas finales
- [ ] Calcular nuevo velocity factor
- [ ] Mover tarjetas no completadas a siguiente sprint o backlog
- [ ] Remover sprint tags de tarjetas completadas
- [ ] Archivar tarjetas de `🗂 Backlog` si >6 meses sin movimiento
- [ ] Actualizar executive summary con learnings (si aplica)

---

## 📊 6. Reportes y Métricas

### Velocity Report (Semanal)

**Ubicación:** `~/Documents/SerenityOps/docs/velocity/velocity_report_W{XX}.md`

**Contenido:**
- Sprint overview
- Velocity metrics (factor, accuracy)
- Capacity planning
- Sprint backlog con tracking
- Burndown chart
- Riesgos y blockers
- Retrospective outcomes
- Next sprint preview

**Frecuencia:** Creado al inicio de sprint, actualizado diariamente, cerrado al fin

### Health Dashboard (Mensual)

**KPIs a trackear:**

| KPI | Cálculo | Target | Frecuencia |
|-----|---------|--------|------------|
| **Avg Velocity** | Promedio últimos 4 sprints | 0.55-0.65 | Mensual |
| **Velocity Stability** | Std Dev velocities | <0.15 | Mensual |
| **Completion Rate** | Cards done / cards planned | >85% | Semanal |
| **Scope Creep** | Cards added mid-sprint | <10% | Semanal |
| **Bug Rate** | Bugs / features deployed | <15% | Mensual |
| **Cycle Time** | Tiempo Refinement→Deployed | <14 días | Mensual |
| **WIP Violations** | Veces WIP >3 cards | 0 | Semanal |

### Burndown Chart

**Tracking diario durante sprint:**

| Día | Fecha | Horas Restantes | Ideal | Real | Delta |
|-----|-------|-----------------|-------|------|-------|
| D0 | Inicio | 15h | 15h | 15h | 0h |
| D1 | +1 | - | 12.9h | - | - |
| D2 | +2 | - | 10.7h | - | - |
| D3 | +3 | - | 8.6h | - | - |
| D4 | +4 | - | 6.4h | - | - |
| D5 | +5 | - | 4.3h | - | - |
| D6 | +6 | - | 2.1h | - | - |
| D7 | Fin | 0h (target) | 0h | - | - |

**Línea ideal:** Decremento lineal de horas
**Línea real:** Actualizada diariamente
**Delta:** Diferencia real vs ideal (negativo = adelantado, positivo = retrasado)

### Quarterly Review (Trimestral)

**Análisis de tendencias:**
- Evolución de velocity (gráfico de líneas)
- Completion rate por sprint
- Distribución de tarjetas por área (UI, Backend, AI)
- Ratio Features vs Bugs vs Refactor
- Cycle time trends
- Predictibilidad (estimation accuracy)

**Actualización de governance:**
- Ajustar velocity baseline si tendencia clara
- Revisar capacity planning
- Actualizar executive summary con learnings
- Ajustar roadmap basado en realidad

---

## 🎯 7. Integración con Governance

### Documentos Relacionados

| Documento | Ubicación | Propósito |
|-----------|-----------|-----------|
| **Executive Summary** | `docs/2025-10-25_board-transformation-executive-summary.md` | Visión estratégica, roadmap, filosofía |
| **Velocity Reports** | `docs/velocity/velocity_report_W{XX}.md` | Métricas semanales de sprint |
| **Sprint Operations** | `docs/sprint-operations-and-velocity.md` | Este documento (sistema operativo) |

### Ciclo de Actualización

**Semanal:**
- Crear nuevo velocity report
- Actualizar metrics en sprint planning card
- Daily updates en velocity report

**Mensual:**
- Calcular health dashboard KPIs
- Revisar velocity trends
- Ajustar baseline si necesario

**Trimestral:**
- Actualizar executive summary
- Quarterly review completo
- Ajustar roadmap
- Auditar filosofía y principios

---

## ✅ Checklist de Implementación

### Fase 1: Setup (Completado ✅)

- [x] Crear estructura de listas (15 listas)
- [x] Crear tarjeta de filosofía
- [x] Crear executive summary document
- [x] Crear sprint operations document
- [x] Crear velocity report W43
- [x] Establecer velocity baseline (0.55)

### Fase 2: Labeling (Pending ⏳)

- [ ] Crear labels de sprint (W43-W46) en Trello web
- [ ] Crear labels de prioridad (P0-P3)
- [ ] Crear labels de tamaño (XS-XL)
- [ ] Crear labels de área (UI, Backend, AI, Infra, Data)
- [ ] Crear labels de naturaleza (Feature, Bug, Enhancement, Refactor, Docs)
- [ ] Aplicar colores según especificación
- [ ] Etiquetar todas las tarjetas existentes

### Fase 3: Due Dates (Pending ⏳)

- [ ] Asignar due dates a tarjetas en `⚙️ In Progress`
- [ ] Asignar due dates a tarjetas en `📝 To Do (Sprint)`
- [ ] Asignar due dates a tarjetas en `🧪 Testing`
- [ ] Validar reglas de due dates por lista

### Fase 4: Reorganización (Pending ⏳)

- [ ] Mover bugs de BACKLOG → `🐛 Bugs`
- [ ] Mover polish tasks → `✨ Polish`
- [ ] Mover tarjetas de BACKLOG → `📋 To Prioritize`
- [ ] Validar tarjetas en `⚙️ In Progress` (reducir a 2-3 WIP)
- [ ] Aplicar RICE a top 10 tarjetas de To Prioritize

### Fase 5: Ejecución (In Progress 🔄)

- [ ] Ejecutar Sprint W43
- [ ] Daily updates en velocity report
- [ ] Respetar WIP límite (2-3 cards)
- [ ] Completar 3 tarjetas técnicas planificadas

### Fase 6: Sprint Close (Week of Nov 1)

- [ ] Sprint review W43
- [ ] Sprint retrospective W43
- [ ] Actualizar velocity report con métricas finales
- [ ] Calcular velocity real W43
- [ ] Planificar Sprint W44

---

## 📚 Referencias y Recursos

### Metodologías y Frameworks

- **Scrum:** Sprint planning, review, retrospective
- **Kanban:** WIP limits, visual management
- **RICE:** Priorización (Reach, Impact, Confidence, Effort)
- **Velocity tracking:** Agile metrics

### Herramientas

- **Trello:** Board management, labels, due dates
- **Trello CLI Python:** Automatización de operaciones
- **Markdown:** Documentación y reportes
- **Claude Code:** Análisis y asistencia

### Enlaces Útiles

- **Board:** [SerenityOps Trello](https://trello.com/b/68fbec1e012f378e62fd9f5a)
- **Philosophy Card:** [What is SerenityOps?](https://trello.com/c/68fd5ff0a90ec1561a9b8359)
- **Sprint W43:** [Sprint Planning Week 43](https://trello.com/c/68fd6148a3b971f6a318ad69)

---

## 📝 Historial de Versiones

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0.0 | 2025-10-25 | Creación inicial del sistema de sprint operations | Bernard + Claude |

---

## 🎬 Conclusión

Este documento establece el **motor operativo** de SerenityOps.

No reemplaza la filosofía (What is SerenityOps?) ni la estrategia (Executive Summary).

**Los complementa** con:
- ✅ Ritmo predecible (sprints semanales)
- ✅ Métricas objetivas (velocity tracking)
- ✅ Visibilidad clara (labels y due dates)
- ✅ Mejora continua (retrospectives)

**El resultado:**
Un sistema que no solo sabe "qué construir" (filosofía) y "hacia dónde va" (roadmap), sino también **"cómo ejecutar" y "cómo medir"** (operaciones).

---

**Documento vivo. Actualizar mensualmente.**

**Próxima revisión:** 25 de noviembre, 2025

---

*"No puedes mejorar lo que no mides.*
*No puedes medir lo que no defines.*
*No puedes definir lo que no entiendes."*

**— Sistema de governance de SerenityOps**
