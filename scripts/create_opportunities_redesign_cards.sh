#!/bin/bash
# Create Opportunities Redesign Cards

TRELLO=~/Documents/trello-cli-python/trello
BUGS_LIST="68fd60186cdf828c532da2b1"      # 🐛 Bugs
DESIGN_LIST="68fd600bd73b50cb33c875bd"    # 📐 Design/Specs

echo "🚨 Creating Opportunities Redesign Cards..."
echo ""

# ========================================
# CARD 1: SO-BUG-OPP-001 (Bugs List)
# ========================================

echo "1️⃣  Creating SO-BUG-OPP-001..."
CARD_ID=$($TRELLO add-card "$BUGS_LIST" "🐛 SO-BUG-OPP-001: Empty Job Data in Opportunities" "**Tipo:** Bug | **Área:** Backend | **Prioridad:** P0 | **Sprint:** W43

**Descripción:**
Las oportunidades se crean sin job_description, skills, fit_score, ni claude_analysis.

**Problema Observado:**
- Oportunidades nuevas (Paylocity, Anthropic, Wizeline) no tienen job_description
- Campos skills, required_skills, salary_range están vacíos o incompletos
- fit_score y claude_analysis no se generan

**Causa Raíz Probable:**
- Endpoints de creación no guardan payload completo
- /api/opportunities/create → missing fields
- Frontend no envía datos completos

**Acciones:**
1. Revisar API /api/opportunities/create y PUT /api/opportunities/:id
2. Validar payload enviado por el frontend
3. Corregir esquema para incluir description, required_skills, salary_range, status
4. Hacer migración de datos para rellenar campos faltantes en opportunities existentes
5. Validar que YAML → API → Frontend preserva todos los campos

**Test de Éxito:**
✅ Crear oportunidad → verificar JSON completo en /api/opportunities
✅ Todos los campos presentes: job_description, skills, fit_score
✅ Claude analysis funciona correctamente

**Due Date:** 02-nov-2025
**Sprint:** W43" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "red" "P0" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "black" "Backend" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "red" "Bug" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-11-02" > /dev/null 2>&1
echo "  ✅ SO-BUG-OPP-001 created"
echo ""

# ========================================
# CARD 2: SO-REFACTOR-OPP-002 (Design/Specs List)
# ========================================

echo "2️⃣  Creating SO-REFACTOR-OPP-002..."
CARD_ID=$($TRELLO add-card "$DESIGN_LIST" "🧱 SO-REFACTOR-OPP-002: Redesign Opportunities Layout (Dashboard Mode)" "**Tipo:** Refactor | **Área:** UI | **Prioridad:** P0 | **Sprint:** W43

**Descripción:**
Reescribir el layout de oportunidades reemplazando el modelo actual de pestañas por un dashboard integral.

**Problema Actual:**
- Pestañas (Analyzer, Compare, Pitch, Feedback) confunden más que ayudan
- No hay señales visuales de qué elemento está activo
- Panel derecho \"Claude Actions\" parece interactivo pero no ejecuta ninguna acción real
- Falta estructura de flujo: no se sabe dónde iniciar, dónde seguir, ni qué resultado esperar

**Acciones:**
1. Unificar Analyzer, Compare, Pitch, Feedback en un solo panel con cards interactivas
2. Mover el panel derecho (\"Claude Actions\") a una vista lateral colapsable (<ActionsDrawer>)
3. Incorporar KPIs visibles:
   - Active / Interviewing / Offers / Closed
   - Match Score (%)
   - Última actividad
4. Añadir modo de detalle expandible (click en oportunidad → abre insights dinámicos)

**Diseño Propuesto:**
\`\`\`tsx
<div className=\"opportunities-dashboard grid grid-cols-12 gap-6 p-6\">
  <div className=\"col-span-4\">
    <OpportunitiesList />
  </div>
  <div className=\"col-span-8\">
    <JobInsightsPanel />
    <div className=\"grid grid-cols-2 gap-4 mt-4\">
      <JobFitCard />
      <SalaryInsightsCard />
      <SkillsGapCard />
      <InterviewPrepCard />
    </div>
  </div>
</div>
\`\`\`

**Resultado Esperado:**
- UI moderna, fluida, tipo dashboard
- Menos pestañas, más contexto y acciones visibles
- Diseño limpio, inspirado en Notion + Linear

**Due Date:** 04-nov-2025
**Sprint:** W43" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "red" "P0" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "orange" "L" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "Refactor" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-11-04" > /dev/null 2>&1
echo "  ✅ SO-REFACTOR-OPP-002 created"
echo ""

# ========================================
# CARD 3: SO-UX-OPP-003 (Design/Specs List)
# ========================================

echo "3️⃣  Creating SO-UX-OPP-003..."
CARD_ID=$($TRELLO add-card "$DESIGN_LIST" "🎨 SO-UX-OPP-003: Modern UX Flow for Job Analyzer" "**Tipo:** Enhancement | **Área:** UX | **Prioridad:** P1 | **Sprint:** W43

**Descripción:**
Rediseñar la experiencia de uso del módulo \"Job Description Analyzer\".

**Problema Actual:**
- Textarea simple sin contexto
- No hay guía de qué hacer
- Skills no se detectan automáticamente
- Panel Claude Actions confunde (no se sabe cuándo usar)

**Acciones UX:**
1. Sustituir textarea simple por card interactiva: \"Paste or import JD\"
2. Mostrar skills detectadas automáticamente como chips con relevancia (e.g., React, TypeScript, AWS)
3. Integrar botón contextual de análisis inteligente (e.g., \"Analyze this role\")
4. Agregar microcopy: \"Serenity will identify gaps, risks, and alignment for this role.\"
5. Ocultar panel derecho hasta que Claude tenga una acción disponible

**Filosofía:**
SerenityOps no debe comportarse como un formulario:
debe sentirse como un espacio de análisis inteligente donde las oportunidades \"respiran\", se comparan, y se entienden visualmente.

**Resultado Esperado:**
- Flujo claro, visual, sin confusión sobre qué hacer primero
- Skills auto-detectadas
- Microcopy guía al usuario
- Panel Claude aparece solo cuando es relevante

**Due Date:** 03-nov-2025
**Sprint:** W43" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "M" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Enhancement" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-11-03" > /dev/null 2>&1
echo "  ✅ SO-UX-OPP-003 created"
echo ""

# ========================================
# CARD 4: SO-FIX-OPP-004 (Bugs List)
# ========================================

echo "4️⃣  Creating SO-FIX-OPP-004..."
CARD_ID=$($TRELLO add-card "$BUGS_LIST" "🧩 SO-FIX-OPP-004: Hide Inactive Claude Actions Panel" "**Tipo:** Temporary Fix | **Área:** UI | **Prioridad:** P1 | **Sprint:** W43

**Descripción:**
El panel derecho \"Claude Actions\" se muestra vacío o inactivo; confunde al usuario.

**Problema:**
- Panel derecho siempre visible aunque no haya acciones disponibles
- Usuario no sabe si puede hacer clic o no
- Ocupa espacio sin aportar valor

**Acciones:**
1. Implementar lógica de visibilidad condicional:
   \`\`\`tsx
   {actionsAvailable && <ClaudeActionsPanel />}
   \`\`\`
2. Mostrar placeholder solo si existen acciones AI contextuales
3. Mover botón de \"Claude Insights\" al header del dashboard

**Resultado Esperado:**
- Panel derecho oculto por defecto
- Se muestra solo cuando hay acciones AI disponibles
- Mejor uso del espacio en pantalla

**Due Date:** 01-nov-2025
**Sprint:** W43" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "sky" "XS" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "red" "Bug" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-11-01" > /dev/null 2>&1
echo "  ✅ SO-FIX-OPP-004 created"
echo ""

echo "✅ All 4 Opportunities Redesign cards created!"
echo ""
echo "📊 Summary:"
echo "  - SO-BUG-OPP-001: Empty Job Data (P0, S, Backend, Bug)"
echo "  - SO-REFACTOR-OPP-002: Dashboard Redesign (P0, L, UI, Refactor)"
echo "  - SO-UX-OPP-003: UX Flow Redesign (P1, M, UI, Enhancement)"
echo "  - SO-FIX-OPP-004: Hide Inactive Panel (P1, XS, UI, Bug)"
echo ""
echo "📋 Total estimado: 20h → efectivo 11h (55% velocity)"
