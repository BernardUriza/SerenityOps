#!/bin/bash
# Create Elevator Pitch Redesign Cards
# SO-REFACTOR-PITCH-001, SO-FEAT-PITCH-002, SO-UX-PITCH-003, SO-AI-PITCH-004

TRELLO=~/Documents/trello-cli-python/trello
DESIGN_LIST="68fd600bd73b50cb33c875bd"    # 📐 Design/Specs
POLISH_LIST="68fd600c2ce09f6e28d3ec5d"    # ✨ Polish

echo "🎨 Creating Elevator Pitch Redesign Cards..."
echo ""

# ========================================
# CARD 1: SO-REFACTOR-PITCH-001 (Polish List)
# ========================================

echo "1️⃣  Creating SO-REFACTOR-PITCH-001..."
CARD_ID=$($TRELLO add-card "$POLISH_LIST" "🧱 SO-REFACTOR-PITCH-001: Layout & Margin Redesign" "**Tipo:** Refactor | **Área:** UI | **Prioridad:** P0 | **Sprint:** W46

**Descripción:**
El contenido del panel Elevator Pitch no está centrado ni con márgenes adecuados. Necesita diseño limpio y profesional.

**Problemas Actuales:**
- Contenido pegado a los bordes
- Sin max-width para líneas de texto largas
- Falta padding uniforme
- Diseño poco profesional

**Acciones:**
1. Implementar layout centrado con max-width de 800px
2. Añadir padding consistente (p-8 o superior)
3. Mejorar spacing entre secciones (space-y-6)
4. Añadir border sutil para definir área de contenido
5. Aplicar liquid-glass effect consistente con el resto de la app

**Diseño Propuesto:**
\`\`\`tsx
<div className=\"h-full overflow-y-auto\">
  <div className=\"max-w-4xl mx-auto p-8 space-y-6\">
    <div className=\"liquid-glass rounded-2xl p-6 border border-macBorder/30\">
      {/* Content here */}
    </div>
  </div>
</div>
\`\`\`

**Resultado Esperado:**
- Layout centrado y profesional
- Márgenes uniformes
- Legibilidad mejorada
- Consistente con macOS aesthetic

**Due Date:** 02-nov-2025
**Sprint:** W46" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "red" "P0" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "Refactor" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "purple" "Sprint-W46" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-11-02" > /dev/null 2>&1
echo "  ✅ SO-REFACTOR-PITCH-001 created"
echo ""

# ========================================
# CARD 2: SO-FEAT-PITCH-002 (Design/Specs List)
# ========================================

echo "2️⃣  Creating SO-FEAT-PITCH-002..."
CARD_ID=$($TRELLO add-card "$DESIGN_LIST" "📝 SO-FEAT-PITCH-002: Markdown Editor + Live Preview" "**Tipo:** Feature | **Área:** UI | **Prioridad:** P0 | **Sprint:** W46

**Descripción:**
Reemplazar textarea simple por editor Markdown profesional con preview en tiempo real.

**Problemas Actuales:**
- Textarea básico sin formato
- Sin preview del resultado final
- Experiencia de edición pobre
- No hay syntax highlighting

**Acciones:**
1. Integrar react-markdown o similar
2. Implementar editor con syntax highlighting (e.g., CodeMirror o Monaco)
3. Split view: Editor (izquierda) | Preview (derecha)
4. Auto-save después de 1s de inactividad
5. Botón \"Copy to Clipboard\" para el pitch final
6. Contador de palabras y tiempo estimado de lectura

**Dependencias:**
\`\`\`bash
npm install react-markdown remark-gfm react-syntax-highlighter
\`\`\`

**Diseño Propuesto:**
\`\`\`tsx
<div className=\"grid grid-cols-2 gap-6\">
  <div className=\"liquid-glass rounded-xl p-4 border border-macBorder/30\">
    <h3>✏️ Edit Your Pitch</h3>
    <MarkdownEditor
      value={pitch}
      onChange={handleChange}
      placeholder=\"Write your elevator pitch using Markdown...\"
    />
    <div className=\"text-xs text-macSubtext mt-2\">
      {wordCount} words • ~{readTime}s read
    </div>
  </div>

  <div className=\"liquid-glass rounded-xl p-4 border border-macBorder/30\">
    <h3>👁️ Live Preview</h3>
    <ReactMarkdown>{pitch}</ReactMarkdown>
    <button onClick={copyToClipboard}>
      📋 Copy to Clipboard
    </button>
  </div>
</div>
\`\`\`

**Resultado Esperado:**
- Editor Markdown profesional
- Preview en tiempo real
- Auto-save funcional
- UX moderna y fluida

**Due Date:** 04-nov-2025
**Sprint:** W46" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "red" "P0" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "M" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "purple" "Sprint-W46" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-11-04" > /dev/null 2>&1
echo "  ✅ SO-FEAT-PITCH-002 created"
echo ""

# ========================================
# CARD 3: SO-UX-PITCH-003 (Polish List)
# ========================================

echo "3️⃣  Creating SO-UX-PITCH-003..."
CARD_ID=$($TRELLO add-card "$POLISH_LIST" "✨ SO-UX-PITCH-003: Scroll & Modern Interaction Redesign" "**Tipo:** Enhancement | **Área:** UI | **Prioridad:** P1 | **Sprint:** W46

**Descripción:**
Mejorar scroll, animaciones y micro-interacciones del panel Elevator Pitch.

**Problemas Actuales:**
- Scroll deficiente o inexistente
- Sin animaciones smooth
- Transiciones abruptas
- Falta feedback visual en interacciones

**Acciones:**
1. Implementar smooth scroll con \`overflow-y-auto\` y \`scroll-smooth\`
2. Añadir framer-motion animations:
   - Fade-in al cargar panel
   - Stagger animations para secciones
   - Hover effects en botones
3. Añadir loading states con skeleton loaders
4. Implementar toast notifications para acciones (save, copy)
5. Añadir scroll-to-top button cuando scroll > 300px

**Implementación:**
\`\`\`tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
  className=\"h-full overflow-y-auto scroll-smooth\"
>
  {/* Content with smooth scroll */}
</motion.div>

// Stagger children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {sections.map(section => (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      {section}
    </motion.div>
  ))}
</motion.div>
\`\`\`

**Resultado Esperado:**
- Scroll suave y funcional
- Animaciones fluidas
- Feedback visual claro
- UX moderna tipo Notion/Linear

**Due Date:** 03-nov-2025
**Sprint:** W46" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Enhancement" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "purple" "Sprint-W46" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-11-03" > /dev/null 2>&1
echo "  ✅ SO-UX-PITCH-003 created"
echo ""

# ========================================
# CARD 4: SO-AI-PITCH-004 (Design/Specs List)
# ========================================

echo "4️⃣  Creating SO-AI-PITCH-004..."
CARD_ID=$($TRELLO add-card "$DESIGN_LIST" "🤖 SO-AI-PITCH-004: Claude Pitch Assistant Stub" "**Tipo:** Feature | **Área:** AI | **Prioridad:** P2 | **Sprint:** W46

**Descripción:**
Crear stub/placeholder para asistente inteligente de pitch (integración con Claude API).

**Problemas Actuales:**
- Panel de ayuda inexistente
- No hay sugerencias inteligentes
- Usuario escribe desde cero sin guía

**Acciones (Stub Phase):**
1. Crear componente \`<ClaudePitchAssistant />\` con UI placeholder
2. Añadir botón \"✨ Get AI Suggestions\" (disabled con tooltip \"Coming soon\")
3. Diseñar panel lateral colapsable para sugerencias futuras
4. Crear mock data para visualizar cómo se verán las sugerencias
5. Documentar arquitectura para integración real en futuro sprint

**Diseño Propuesto:**
\`\`\`tsx
<div className=\"relative\">
  {/* Main pitch editor */}
  <PitchEditor />

  {/* AI Assistant Sidebar (collapsed by default) */}
  <motion.div
    className=\"absolute right-0 top-0 h-full w-80 liquid-glass border-l border-macBorder/30\"
    initial={{ x: '100%' }}
    animate={{ x: showAssistant ? 0 : '100%' }}
  >
    <div className=\"p-4 space-y-4\">
      <h3 className=\"text-lg font-bold flex items-center gap-2\">
        <Icon name=\"sparkles\" className=\"text-macAccent\" />
        AI Pitch Coach
      </h3>

      {/* Mock suggestions */}
      <div className=\"space-y-3\">
        <SuggestionCard
          type=\"structure\"
          title=\"Improve Structure\"
          suggestion=\"Consider starting with a hook...\"
        />
        <SuggestionCard
          type=\"clarity\"
          title=\"Enhance Clarity\"
          suggestion=\"Simplify this sentence...\"
        />
      </div>

      <button
        className=\"btn-primary w-full\"
        disabled
        title=\"Coming in next sprint\"
      >
        ✨ Get AI Suggestions
      </button>
    </div>
  </motion.div>
</div>
\`\`\`

**Documentation:**
Crear \`/docs/ai/pitch_assistant_architecture.md\` con:
- API endpoints necesarios
- Prompt engineering strategy
- Response parsing logic
- Token management

**Resultado Esperado:**
- UI funcional para futuro asistente AI
- Arquitectura documentada
- Mock data para visualización
- Sin integración real aún (P2)

**Due Date:** 05-nov-2025
**Sprint:** W46" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "purple" "AI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "purple" "Sprint-W46" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-11-05" > /dev/null 2>&1
echo "  ✅ SO-AI-PITCH-004 created"
echo ""

echo "✅ All 4 Elevator Pitch Redesign cards created!"
echo ""
echo "📊 Summary:"
echo "  - SO-REFACTOR-PITCH-001: Layout & Margins (P0, S, UI, Refactor) → ✨ Polish"
echo "  - SO-FEAT-PITCH-002: Markdown Editor (P0, M, UI, Feature) → 📐 Design/Specs"
echo "  - SO-UX-PITCH-003: Scroll & Animations (P1, S, UI, Enhancement) → ✨ Polish"
echo "  - SO-AI-PITCH-004: Claude Assistant Stub (P2, S, AI, Feature) → 📐 Design/Specs"
echo ""
echo "📋 Total estimado: 17h"
echo "🎯 Sprint W46 ready to go!"
