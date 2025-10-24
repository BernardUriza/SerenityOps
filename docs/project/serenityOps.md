# SerenityOps: Sistema Complejo de Carrera

## 1. Propósito general

El proyecto **SerenityOps** busca construir una plataforma viva de inteligencia personal, diseñada para acompañar y registrar el desarrollo profesional, financiero y emocional de una persona con perfil analítico. No se trata de un simple repositorio estático, sino de un ecosistema conversacional y versionado que actúa como espejo estructurado del usuario.

El sistema permitirá mantener un diálogo continuo con modelos de IA (Claude Code, GPT-5 u otros) que registran decisiones, generan código, actualizan datos y producen documentación ejecutable. Cada interacción se convierte en un evento trazable dentro de una arquitectura modular, orientada a la toma de decisiones informada y serena.

**Principio rector**: "la calma con trazabilidad": transformar incertidumbre en información ordenada, y emoción en estrategia.

---

## 2. Filosofía de diseño

1. **Integridad sobre velocidad**  
   Cada acción debe poder explicarse, rastrearse y replicarse. Ninguna automatización carecerá de fundamento ético o técnico.

2. **Conversación como interfaz**  
   El lenguaje natural es la puerta de entrada. El sistema traduce las conversaciones en estructuras de datos (YAML, JSON, Markdown o Python).

3. **Autonomía del usuario**  
   Bernard sigue siendo el decisor; el sistema sugiere, calcula y documenta, pero nunca impone.

4. **Simbiosis humano-máquina**  
   La IA actúa como auditor y escriba. Su tarea no es predecir, sino mantener coherencia entre lo que el usuario dice, hace y documenta.

5. **Aprendizaje iterativo**  
   Cada iteración de conversación genera conocimiento nuevo que puede alimentar los modelos o producir reportes de evolución.

---

## 3. Arquitectura general

### 3.1 Capas funcionales

```
bernard-core-live/
├─ foundations/          → axiomas, ética, estructuras básicas
├─ finanzas/             → gestión de flujo, deuda, proyecciones
├─ oportunidades/        → CRM personal de búsqueda y proyectos
├─ curriculum/           → versiones automáticas de CV y portafolio
├─ rituales/             → protocolos de calma, revisión y foco
└─ logs/                 → registro de sesiones conversacionales
```

### 3.2 Capa viva: motor conversacional

- Integración con Claude Code API (o similar) para mantener un "diario inteligente"
- Cada sesión se etiqueta por tipo (finanzas, carrera, planificación, reflexión)
- Se guardan metadatos (fecha, tema, acciones derivadas, decisiones tomadas)
- Claude puede generar commits automáticos con mensajes semánticos

### 3.3 Capa analítica

Scripts en Python y notebooks ligeros para:
- Calcular métricas de progreso (ratio deuda/ingreso, avance hacia meta de +20 000 MXN, frecuencia de entrevistas)
- Detectar patrones de lenguaje (medir tono, frecuencia de estrés o calma)
- Generar reportes semanales y trimestrales en Markdown o PDF

---

## 4. Integraciones previstas

### 4.1 API de Claude Code / Anthropic
- Envío y recepción de prompts estructurados
- Ejecución de código Python dentro del flujo
- Actualización automática de archivos YAML y MD

### 4.2 Servicios Cloud (AWS, GCP o Azure, seleccionable)
- Almacenamiento seguro de versiones (S3, Cloud Storage)
- Funciones programadas (Lambda/Cloud Run) para razonamientos periódicos
- Base de datos ligera (DynamoDB, Firestore) para indexar logs

### 4.3 Integración PDF / Documentos
- Conversión de Markdown a PDF mediante WeasyPrint o LaTeX
- Lectura y actualización de CV existentes (PDF a texto)
- Inserción dinámica de logros, proyectos y métricas en plantillas

### 4.4 Gestión de currículo viva
- Archivo `curriculum.yaml` con campos normalizados: experiencia, proyectos, logros, habilidades
- Script `cv_builder.py` que, con ayuda de la IA, reescribe secciones según nuevas oportunidades
- Generación de distintas versiones del CV (técnico, ético-filosófico, ejecutivo)

### 4.5 Integración con calendario y correo (opcional)
- Captura de eventos de entrevistas o reuniones
- Actualización automática del módulo de oportunidades

---

## 5. Razonamientos periódicos

El sistema debe ejecutar procesos de reflexión automatizada a intervalos definidos:

### Razonamiento semanal
- Resumen de acciones completadas
- Comparativa de avances financieros y laborales
- Detección de incoherencias o tareas inconclusas

### Razonamiento mensual
- Ajuste de metas (ingreso deseado, deuda restante)
- Revisión del tono emocional y equilibrio entre trabajo y calma
- Generación de snapshot (`career-YYYY-MM`)

### Razonamiento trimestral
- Evaluación integral: aprendizajes, evolución del CV, proyectos clave
- Recomendaciones estratégicas y reajuste de reglas éticas

Estos razonamientos pueden ejecutarse mediante funciones programadas en la nube o manualmente desde una interfaz CLI:

```bash
$ serenity reason --scope monthly
```

---

## 6. Gobernanza del sistema

### Privacidad y seguridad
Todo el contenido sensible se mantiene en repositorio privado; los datos personales se anonimizarán si se exportan a terceros.

### Trazabilidad
Cada commit o modificación incluye:
- Fecha y hora UTC
- Autor (humano o IA)
- Propósito ("ajuste de proyección de deuda", "actualización de CV para empresa X")

### Transparencia de IA
Los modelos usados deben registrar versión, fuente y justificación de cada modificación.

### Auditoría personal
Un módulo `ethics_contract.md` define tus líneas rojas: no compartir credenciales, no falsificar datos, mantener integridad documental.

---

## 7. Flujos de interacción

### 7.1 Flujo de conversación
1. Bernard plantea intención: "Agrega nueva oportunidad Backend Go, entrevista 22 Oct."
2. Claude actualiza `opportunities.yaml` y crea commit
3. Claude ejecuta análisis de progreso y genera resumen
4. El resumen queda disponible en `logs/log_2025-10-22.md`

### 7.2 Flujo de actualización de CV
1. Bernard comunica nuevo proyecto o skill
2. Claude evalúa impacto en currículo, actualiza `curriculum.yaml`
3. Genera versión PDF y Markdown del CV
4. Commit automático: `update: CV con proyecto DataTrace`

### 7.3 Flujo de razonamiento
1. Scheduler o Bernard ejecuta `reason`
2. Claude revisa los últimos logs, calcula métricas y produce insight
3. Insight se registra y, si procede, ajusta reglas o metas

---

## 8. Tecnología sugerida

- **Lenguaje base**: Python 3.11+
- **Infraestructura**: GitHub Private Repo + AWS Lambda / Google Cloud Run
- **Dependencias clave**: PyYAML, WeasyPrint, pandas, matplotlib, openai/anthropic-api, gitpython
- **Formato de datos**: YAML y Markdown human-readable
- **Interfaz opcional**: CLI o ChatUI local en Streamlit/FastAPI

---

## 9. Valor diferenciador

1. **Unificación de mente, proceso y documentación**  
   El sistema transforma reflexiones en código y código en reflexión.

2. **Evolución del CV automatizada**  
   Cada logro, entrevista o proyecto se refleja en tiempo real.

3. **Memoria histórica auditable**  
   Permite estudiar la evolución profesional con el mismo rigor que se audita un sistema de producción.

4. **Simbiosis con IA**  
   Claude Code y futuros modelos colaboran no solo como asistentes, sino como arquitectos del conocimiento personal.

---

## 10. Expansión futura

- Incorporar análisis semántico de ofertas laborales (matching entre descripciones y competencias)
- Crear dashboards interactivos de flujo financiero y emocional
- Implementar métricas de bienestar: horas de sueño, energía percibida, balance trabajo-vida
- Publicar versión anonimizada del sistema como framework open source de Career Intelligence Ops

---

## 11. Cierre filosófico

> "La calma no es ausencia de movimiento, sino ritmo con trazabilidad."

**SerenityOps** propone un modelo de trabajo donde la ética y la estructura técnica convergen. La IA no reemplaza la conciencia humana: la amplifica, le da espejo y registro. Cada conversación, cada commit y cada reflexión forman la bitácora de una mente que decide vivir su carrera como un sistema complejo, transparente y humano.