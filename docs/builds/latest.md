# Último despliegue SerenityOps

- 🕓 Fecha: 2025-10-24 UTC
- 🧠 Autor: Claude Code
- 🧩 Cambios:
  - feat(ui): add persistent deployment badge
  - feat(api): add /api/version endpoint for build sync
  - feat(ui): add version detail modal with build info
  - style(ui): minimal macOS translucent badge
- 💾 Commit: Ver git log para detalles
- ✅ Estado: Deploy successful

## Descripción

Se agregó un sistema de versionamiento persistente que muestra:
- Versión de frontend y backend en tiempo real
- Hash de commit actual
- Fecha de compilación
- Último cambio aplicado (autor y descripción)

El badge es visible en la esquina inferior derecha, con opacidad semitransparente
y estética macOS. Al hacer clic, se expande un modal con detalles completos del build.

## Sincronización

El badge se actualiza automáticamente cada 15 segundos consultando el endpoint
`/api/version`, garantizando que siempre muestre la información más reciente
sin necesidad de recargar la página.

## Próximos pasos

- Integrar este sistema con CI/CD para actualización automática en cada deploy
- Agregar historial de builds con changelog completo
- Implementar notificaciones de nueva versión disponible
