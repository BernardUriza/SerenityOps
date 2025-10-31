# 🏷️ SerenityOps - Trello Labels System

**Version:** 1.0.0
**Created:** 27-oct-2025
**Purpose:** Comprehensive visual label system for board organization

---

## 📋 Label Categories (5 Groups)

Basado en el sistema definido en `sprint-operations-and-velocity.md`:

### 1. Sprint Tags (Temporal) - 🔵🟢🟠🟣
- `Sprint-W43` 🔵 Blue
- `Sprint-W44` 🟢 Green
- `Sprint-W45` 🟠 Orange (CURRENT)
- `Sprint-W46` 🟣 Purple

**Usage:** Tarjetas activas en sprint

### 2. Priority Tags - 🔴🟡🟤⚪
- `P0` 🔴 Red - Crítico, bloquea progreso
- `P1` 🟡 Yellow - Alta, impacto significativo
- `P2` 🟤 Brown - Media, nice to have
- `P3` ⚪ Light Gray - Baja, futuro lejano

**Usage:** TODAS las tarjetas deben tener prioridad

### 3. Size Tags (Story Points) - 🟦🟩🟨🟧🟥
- `XS` 🟦 Sky Blue - 1-2 horas
- `S` 🟩 Lime - 3-5 horas
- `M` 🟨 Yellow - 6-10 horas
- `L` 🟧 Orange - 11-20 horas
- `XL` 🟥 Red - 21+ horas (debe dividirse)

**Usage:** Tarjetas técnicas (Feature, Bug, Refactor)

### 4. Area Tags (Technical Domain) - 💗⬛💜🟫🔷
- `UI` 💗 Pink - Frontend, componentes, diseño
- `Backend` ⬛ Black - API, lógica de negocio
- `AI` 💜 Purple - Features con Claude, ML
- `Infra` 🟫 Brown - DevOps, deployment
- `Data` 🔷 Blue - Database, analytics

**Usage:** Todas las tarjetas técnicas

### 5. Nature Tags (Type of Work) - 🟢🔵🔴🟡📘
- `Feature` 🟢 Green - Nueva funcionalidad
- `Enhancement` 🔵 Blue - Mejora incremental
- `Bug` 🔴 Red - Issue reportado
- `Refactor` 🟡 Yellow - Limpieza técnica
- `Docs` 📘 Blue - Documentación

**Usage:** Clasificación de naturaleza del trabajo

---

## 🎨 Visual Color Palette

### Primary Colors
- 🔴 Red: Critical (P0, Bug, XL)
- 🟡 Yellow: Important (P1, M, Refactor)
- 🟢 Green: Positive (Sprint-W44, Feature, S)
- 🔵 Blue: Neutral (Sprint-W43, Enhancement, Data, Docs)
- 🟠 Orange: Active (Sprint-W45, L)
- 🟣 Purple: Future (Sprint-W46, AI)

### Secondary Colors
- 💗 Pink: UI/Frontend
- ⬛ Black: Backend
- 🟫 Brown: Infrastructure/Low Priority
- 🔷 Light Blue: Data/Info
- ⚪ White/Gray: Low priority

---

## 📝 Label Creation Commands

**NOTE:** Labels must be created via Trello Web UI (not CLI)

### Sprint Labels
```
Name: Sprint-W43 | Color: Blue
Name: Sprint-W44 | Color: Green
Name: Sprint-W45 | Color: Orange
Name: Sprint-W46 | Color: Purple
```

### Priority Labels
```
Name: P0 | Color: Red
Name: P1 | Color: Yellow
Name: P2 | Color: Brown (or Light Brown)
Name: P3 | Color: Light Gray
```

### Size Labels
```
Name: XS | Color: Sky Blue
Name: S | Color: Lime (or Light Green)
Name: M | Color: Yellow
Name: L | Color: Orange
Name: XL | Color: Red
```

### Area Labels
```
Name: UI | Color: Pink
Name: Backend | Color: Black
Name: AI | Color: Purple
Name: Infra | Color: Brown
Name: Data | Color: Blue
```

### Nature Labels
```
Name: Feature | Color: Green
Name: Enhancement | Color: Blue
Name: Bug | Color: Red
Name: Refactor | Color: Yellow
Name: Docs | Color: Blue (or Sky Blue)
```

---

## 🏷️ Labeling Conventions

### Example 1: Feature Card in Current Sprint
```
Card: SO-UI-FEAT-009: Quick Actions Modal
Labels:
  - Sprint-W45 (Orange)
  - P1 (Yellow)
  - S (Lime) - 4h estimate
  - UI (Pink)
  - Feature (Green)
```

### Example 2: Critical Bug
```
Card: SO-BUG-CHT-001: API 404 on Conversation Load
Labels:
  - Sprint-W43 (Blue) - if in active sprint
  - P0 (Red)
  - XS (Sky Blue) - 2h fix
  - Backend (Black)
  - Bug (Red)
```

### Example 3: Data Task
```
Card: SO-OPP-DATA-001: Enrich Paylocity YAML
Labels:
  - Sprint-W45 (Orange)
  - P0 (Red)
  - XS (Sky Blue) - 2h
  - Data (Blue)
  - Enhancement (Blue)
```

### Example 4: Backlog Item (No Sprint)
```
Card: SO-CVE-FEAT-004: Compact Layout Engine
Labels:
  - P1 (Yellow)
  - M (Yellow) - 6h estimate
  - UI (Pink)
  - Feature (Green)
  - (NO Sprint label - in backlog)
```

---

## 📊 Label Priority Rules

**MUST HAVE on every card:**
1. Priority (P0/P1/P2/P3)
2. Nature (Feature/Bug/Enhancement/Refactor/Docs)

**SHOULD HAVE on technical cards:**
3. Size (XS/S/M/L/XL)
4. Area (UI/Backend/AI/Infra/Data)

**CONDITIONAL:**
5. Sprint (only if in active sprint or planned)

**Special Cases:**
- **Governance cards:** No Size, maybe no Area
- **Ideas/Discussion cards:** Only Priority + Nature
- **Backlog cards:** No Sprint label

---

## 🔧 Malformed Cards Fix Plan

### Cards to Fix (Done List)

| Card ID | Current Name (truncated) | Should Be |
|---------|--------------------------|-----------|
| 68fd6d44a9b0d23292f51d1b | 🐛 SO-BUG-CHT-001 – API 404... | 🐛 SO-BUG-CHT-001: API 404 on Conversation Load |
| 68fd6d462c380d0da312aa3f | 🐛 SO-BUG-CHT-002 – Message... | 🐛 SO-BUG-CHT-002: Message Send Fails (404) |
| 68fd70992f9a08e2d5643496 | 🐛 SO-BUG-CHT-004 – Layout... | 🐛 SO-BUG-CHT-004: Layout Shift on Enter |
| 68fd709b0c2480abacaffff7 | 🧱 SO-REFACTOR-CHT-005 –... | 🧱 SO-REFACTOR-CHT-005: ChatContainer Structure Rewrite |
| 68fd709cf6f0b1a7c2947071 | 🎨 SO-UX-CHT-006 – UX Rework... | 🎨 SO-UX-CHT-006: Chat Input & Scroll Experience |

### Cards to Fix (Bugs List)

| Card ID | Current Name (truncated) | Should Be |
|---------|--------------------------|-----------|
| 68fd6d474005bb9fd2b0334f | 🧪 SO-QA-CHT-003 – End-to... | 🧪 SO-QA-CHT-003: End-to-End Chat Validation |

### Fix Strategy

For each card:
1. Extract proper title (before description)
2. Move full description to Description field
3. Keep only title in Name field
4. Apply appropriate labels

**Labels to apply:**
- SO-BUG-CHT-001, 002, 004: `P0`, `Bug`, `Backend`, `XS`, `Sprint-W43`
- SO-REFACTOR-CHT-005: `P0`, `Refactor`, `UI`, `S`, `Sprint-W43`
- SO-UX-CHT-006: `P1`, `Enhancement`, `UI`, `S`, `Sprint-W43`
- SO-QA-CHT-003: `P1`, `Enhancement`, `Backend`, `S`, `Sprint-W43`

---

## ✅ Implementation Checklist

### Phase 1: Create Labels (via Web UI)
- [ ] Create 4 Sprint labels
- [ ] Create 4 Priority labels
- [ ] Create 5 Size labels
- [ ] Create 5 Area labels
- [ ] Create 5 Nature labels
**Total:** 23 labels

### Phase 2: Fix Malformed Cards (via CLI)
- [ ] Fix 68fd6d44 (BUG-CHT-001)
- [ ] Fix 68fd6d46 (BUG-CHT-002)
- [ ] Fix 68fd7099 (BUG-CHT-004)
- [ ] Fix 68fd709b (REFACTOR-CHT-005)
- [ ] Fix 68fd709c (UX-CHT-006)
- [ ] Fix 68fd6d47 (QA-CHT-003)
**Total:** 6 cards

### Phase 3: Apply Labels to Existing Cards
- [ ] Apply labels to cards in Done list
- [ ] Apply labels to cards in Bugs list
- [ ] Apply labels to cards in Backlog list
- [ ] Apply labels to cards in Ready list
- [ ] Apply labels to cards in Ideas list

### Phase 4: Create W45 Cards with Labels
- [ ] Create SO-OPP-DATA-001 with labels
- [ ] Create SO-OPP-FIX-001 with labels
- [ ] Create SO-OPP-FEAT-001 with labels (move from backlog)
- [ ] Create SO-OPP-DATA-002 with labels
**Total:** 4 cards

---

## 📚 References

- **Sprint Operations:** `docs/sprint-operations-and-velocity.md`
- **Trello Board:** [SerenityOps](https://trello.com/b/68fbec1e012f378e62fd9f5a)
- **Trello ID System:** `docs/project/TRELLO_ID_SYSTEM.md`

---

**Last Updated:** 27-oct-2025
**Next Review:** Weekly during sprint planning
