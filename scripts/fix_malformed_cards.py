#!/usr/bin/env python3
"""
Fix Malformed Trello Cards
Moves full description from Name field to Description field
"""

import sys
sys.path.insert(0, '/Users/bernardurizaorozco/Documents/trello-cli-python')

from trello_cli.client import get_client

# Card definitions: {card_id: (new_title, description)}
CARDS_TO_FIX = {
    # Done list - Bugs
    "68fd6d44a9b0d23292f51d1b": (
        "🐛 SO-BUG-CHT-001: API 404 on Conversation Load",
        """**Tipo:** Bug | **Área:** Backend | **Prioridad:** P0 | **Sprint:** W43

**Descripción:**
El endpoint `/chat/conversation/:id` responde 404 al intentar recuperar la conversación activa.

**Error observado:**
```
:8000/chat/conversation/conv_20251025_183300_828015:1
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**Posibles causas:**
- Ruta backend no registrada o incorrecta
- Controlador ChatController no maneja parámetro :id
- Objeto de conversación no persistido tras creación

**Objetivo:**
Validar y restaurar el endpoint `/chat/conversation/:id` con respuesta JSON válida.

**Prueba de éxito:**
✅ Cargar conversación activa sin error 404

**Due Date:** 01-nov-2025"""
    ),

    "68fd6d462c380d0da312aa3f": (
        "🐛 SO-BUG-CHT-002: Message Send Fails (404)",
        """**Tipo:** Bug | **Área:** Frontend/Backend | **Prioridad:** P0 | **Sprint:** W43

**Descripción:**
Envío de mensajes falla con "Send message error: Not Found" en ChatView.tsx:81.

**Error observado:**
```
:8000/chat/message:1
Failed to load resource: the server responded with a status of 404 (Not Found)

hook.js:608
Send message error: Error: Not Found
at handleSendMessage (ChatView.tsx:81:15)
```

**Posibles causas:**
- API `/chat/message` inexistente o con path mal definido
- Error en fetch hook (useSendMessage) → endpoint incorrecto
- Inconsistencia entre nombre de endpoint y router real

**Objetivo:**
Corregir ruta y lógica de envío de mensajes, asegurar persistencia en backend.

**Prueba de éxito:**
✅ Envío exitoso de mensaje → persistencia en DB → render inmediato en chat UI

**Due Date:** 01-nov-2025"""
    ),

    "68fd70992f9a08e2d5643496": (
        "🐛 SO-BUG-CHT-004: Layout Shift on Enter (Chat Scroll Loop)",
        """**Tipo:** Bug | **Área:** UI | **Prioridad:** P0 | **Sprint:** W43

**Descripción:**
Al presionar Enter en el chat, toda la aplicación se desplaza hacia arriba, creando un padding gigante en el fondo.

**Comportamiento observado:**
- User presiona Enter para enviar mensaje
- Sistema entra en loop de layout
- Padding inferior anormalmente grande aparece
- Toda la app se empuja hacia arriba
- Flujo visual del layout roto

**Posibles causas:**
- Scroll listener aplicado al contenedor global (body/main) en lugar del chat viewport
- Re-render forzado de App/RootContainer al cambiar chatInput state
- CSS erróneo: `height: 100vh` + `overflow: auto` conflictivo con layout flex
- `scrollIntoView()` llamado sobre window/document.body en lugar del contenedor del chat

**Objetivo:**
Limitar el scroll al contenedor del chat, eliminar padding dinámico, mantener posición estable del input.

**Prueba de éxito:**
✅ Enviar 10 mensajes seguidos → el chat debe autoscrollear correctamente sin mover la app completa

**Due Date:** 01-nov-2025"""
    ),

    "68fd709b0c2480abacaffff7": (
        "🧱 SO-REFACTOR-CHT-005: ChatContainer Structure Rewrite",
        """**Tipo:** Refactor | **Área:** UI/Frontend | **Prioridad:** P0 | **Sprint:** W43

**Dependencias:** SO-BUG-CHT-004 (bloqueante)

**Descripción:**
Reescribir el componente ChatContainer para aislar el contexto visual del chat.

**Acciones:**
1. Crear wrapper `<ChatViewport>` con `overflow-y: auto` y altura fija
2. Separar `ChatInput` de `ChatViewport` con layout sticky (`position: sticky; bottom: 0;`)
3. Eliminar dependencias directas de `window.scrollTo()`
4. Usar `ref.scrollIntoView()` solo en el contenedor interno, no global

**Diseño UX esperado:**
- Área superior: mensajes (scrollable)
- Área inferior: input fijo, sin padding extra
- No hay reflow global, solo animación local de scroll

**Estructura propuesta:**
```tsx
<div className="chat-container flex flex-col h-full">
  <div ref={chatViewportRef} className="chat-viewport flex-1 overflow-y-auto">
    {messages.map(...)}
  </div>
  <div className="chat-input sticky bottom-0 bg-background border-t">
    <ChatInput />
  </div>
</div>
```

**Due Date:** 02-nov-2025"""
    ),

    "68fd709cf6f0b1a7c2947071": (
        "🎨 SO-UX-CHT-006: UX Rework - Chat Input & Scroll Experience",
        """**Tipo:** Enhancement | **Área:** UX Design | **Prioridad:** P1 | **Sprint:** W43

**Dependencias:** SO-REFACTOR-CHT-005

**Descripción:**
Rediseñar la experiencia del envío de mensajes y desplazamiento visual del chat.

**Acciones:**
- Añadir animación sutil de autoscroll (ease-in-out)
- Mantener el input visible siempre, sin salto visual
- Eliminar padding dinámico inferior; usar `scroll-margin-bottom`
- Revisar transición de altura en modo multi-line input
- Integrar prueba UX: enviar mensajes largos y observar comportamiento estable

**Resultado esperado:**
Flujo continuo, sin reflow global, animación fluida, experiencia macOS-like.

**Validación E2E:**
Crear `tests/e2e/chat-scroll.spec.ts` con Playwright:
1. User types and sends 10 messages
2. Verify only chat container scrolls (not window)
3. Chat input remains visible
4. Padding bottom remains constant (<100px)
5. No layout shift detected

**Due Date:** 02-nov-2025"""
    ),

    # Bugs list
    "68fd6d474005bb9fd2b0334f": (
        "🧪 SO-QA-CHT-003: End-to-End Chat Validation",
        """**Tipo:** Enhancement | **Área:** QA | **Sprint:** W43

**Dependencias:** SO-BUG-CHT-001, SO-BUG-CHT-002

**Objetivo:**
Implementar prueba E2E completa del flujo de chat:
1. Crear conversación nueva
2. Enviar y recibir mensajes
3. Persistir conversación en DB
4. Recargar página → conversación se conserva

**Herramientas sugeridas:**
- Playwright o Cypress (`/tests/e2e/chat.spec.ts`)
- Validar códigos HTTP, UI y almacenamiento local

**Resultado esperado:**
- Todos los pasos pasan sin errores 404 o Not Found
- Log de test se guarda en `/logs/e2e/chat/`

**Due Date:** 01-nov-2025"""
    ),
}

def main():
    client = get_client()

    print("🔧 Fixing Malformed Trello Cards...")
    print(f"📋 Total cards to fix: {len(CARDS_TO_FIX)}\n")

    for card_id, (new_title, description) in CARDS_TO_FIX.items():
        try:
            print(f"Fixing card {card_id}...")
            card = client.get_card(card_id)

            # Update title
            card.set_name(new_title)
            print(f"  ✅ Title updated: {new_title[:60]}...")

            # Update description
            card.set_description(description)
            print(f"  ✅ Description moved to proper field")

            print()

        except Exception as e:
            print(f"  ❌ Error fixing card {card_id}: {e}")
            print()

    print("✅ All cards fixed!")

if __name__ == "__main__":
    main()
