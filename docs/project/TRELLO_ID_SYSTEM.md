# SerenityOps Trello ID System

## 📋 ID Format

**Pattern:** `SO-[AREA]-[TYPE]-[NUM]`

### Example IDs:
- `SO-CVE-FEAT-001` → CV Engine Feature #1
- `SO-AI-ENH-002` → AI Enhancement #2
- `SO-UI-BUG-003` → UI Bug Fix #3

---

## 🗂 Area Codes

| Code | Area | Description |
|------|------|-------------|
| **CVE** | CV Engine | CV generation, templates, PDF export, ATS optimization |
| **OPP** | Opportunities | Job tracking, pipeline management, opportunity analysis |
| **UI** | User Interface | Frontend components, UX improvements, design system |
| **AI** | Artificial Intelligence | Claude integration, coaching modes, AI features |
| **INFRA** | Infrastructure | DevOps, CI/CD, versioning, deployment, monitoring |
| **CHAT** | Chat System | Conversation management, message handling, history |
| **MCP** | MCP Layer | Model Context Protocol integration, tools, diagnostics |
| **DATA** | Data Management | YAML persistence, data sync, imports/exports |
| **API** | Backend API | FastAPI endpoints, services, middleware |
| **AUTH** | Authentication | User auth, sessions, permissions |

---

## 🏷 Type Codes

| Code | Type | Description |
|------|------|-------------|
| **FEAT** | Feature | New functionality or capability |
| **BUG** | Bug Fix | Fixing broken functionality |
| **ENH** | Enhancement | Improving existing feature |
| **REFACTOR** | Refactoring | Code restructuring without behavior change |
| **FIX** | Technical Fix | Non-bug technical improvement |
| **POLISH** | UI/UX Polish | Visual/interaction refinement |
| **AI** | AI Integration | Claude-specific AI feature |

---

## 📊 Current ID Registry

### 🗂 BACKLOG (23 cards)

#### General Features
- `SO-CVE-FEAT-001`: Integrar ATS Markdown Export
- `SO-OPP-FEAT-001`: Opportunities Analyzer Panel
- `SO-AI-ENH-001`: Claude Coaching Modes
- `SO-CHAT-FIX-001`: Chat Autosave/Resume
- `SO-INFRA-FEAT-001`: FastAPI + Frontend Build Version Sync
- `SO-MCP-FEAT-001`: MCP Diagnostic Visualization
- `SO-UI-POLISH-001`: macOS Modal Polish + Focus Trap
- `SO-CVE-BUG-001`: PDF Generator Tailwind Fidelity
- `SO-UI-FEAT-001`: Dynamic Icon Inspector

#### CV Customization Engine
- `SO-CVE-FEAT-002`: CV Template Architecture (Base Framework)
- `SO-CVE-FEAT-003`: CV Field Mapper (Dynamic Section Control)
- `SO-CVE-FEAT-004`: Compact Layout Engine (Density Optimizer)
- `SO-CVE-FEAT-005`: Upload Inspirations (User References)
- `SO-CVE-AI-001`: Claude Design Integrator
- `SO-CVE-FEAT-006`: Page Composer (Adaptive Content Engine)
- `SO-CVE-FEAT-007`: CV Diff Tracker (Version Comparison)
- `SO-CVE-FEAT-008`: ATS Compatibility Analyzer
- `SO-CVE-FEAT-009`: Resolution & Print Optimizer
- `SO-CVE-FEAT-010`: Saved Presets & Export Settings
- `SO-CVE-FEAT-011`: Metrics Dashboard (CV Analytics)
- `SO-CVE-FEAT-012`: Template Marketplace (Local / Shared Templates)
- `SO-CVE-FEAT-013`: Inline HTML Editor (Claude-assisted)
- `SO-CVE-INFRA-001`: CV Engine Logs & Version Control

### ⚙️ IN PROGRESS (4 cards)
- `SO-INFRA-FEAT-002`: Deployment Badge & Logs
- `SO-UI-REFACTOR-001`: Icon Registry Pattern
- `SO-OPP-FEAT-002`: Opportunities Viewer CMS
- `SO-UI-FEAT-002`: Serenity UI Mac Framework

### 🚀 DEPLOYED (7 cards)
- `SO-UI-FEAT-003`: Theme System with Persistence
- `SO-CVE-ENH-001`: Experience Editor v2
- `SO-CVE-FEAT-014`: PDF Export Engine
- `SO-AI-FEAT-001`: Claude Interview Simulator
- `SO-INFRA-FEAT-003`: Version Badge
- `SO-DATA-FEAT-001`: Projects Manager with Portfolio Sync
- `SO-OPP-FEAT-003`: Opportunities Pipeline Tracking

---

## 🆕 Creating New Cards

### Step 1: Choose Area Code
Identify which module/component the work belongs to.

### Step 2: Choose Type Code
Determine the nature of the work (feature, bug, enhancement, etc.).

### Step 3: Find Next Available Number
Check the registry above and use the next sequential number for that `AREA-TYPE` combination.

### Example:
Creating a new AI feature for career strategy:

1. **Area:** AI (AI/Claude Features)
2. **Type:** FEAT (new feature)
3. **Number:** Check registry → `SO-AI-FEAT-001` already exists, so use `002`
4. **Final ID:** `SO-AI-FEAT-002`

### Card Name Format:
```
🧠 SO-AI-FEAT-002: Career Strategy Advisor
```

---

## 🔢 Numbering Rules

1. **Numbers are 3 digits:** `001`, `002`, `003`, ..., `999`
2. **Sequential per AREA-TYPE combo:** Each `AREA-TYPE` has its own sequence
3. **Never reuse IDs:** Even if a card is deleted, don't reuse its number
4. **Update this doc:** When creating new cards, add them to the registry

---

## 📦 Quick Reference Card

When creating a Trello card:

```
Format: [Emoji] SO-[AREA]-[TYPE]-[NUM]: [Title]

Example: 🎨 SO-CVE-FEAT-015: Dynamic Layout Previewer
```

**Common Emojis by Area:**
- CVE: 🎨📄🧾📋
- OPP: 📊🎯💼
- UI: 🪶🧱🎨
- AI: 🧠🤖✨
- INFRA: ⚙️🔧⚡
- CHAT: 💬📨
- MCP: 🔍🧩
- DATA: 💾📁

---

## 🔗 Resources

- **Trello Board:** https://trello.com/b/68fbec1e/serenityops
- **Trello CLI Tool:** `/Users/bernardurizaorozco/trello-cli.py`

---

**Last Updated:** 2025-10-24
**Total Cards:** 34 (23 Backlog, 4 In Progress, 7 Deployed)
