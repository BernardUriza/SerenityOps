# 📚 SerenityOps Documentation Wiki

**Comprehensive Documentation Index**

This wiki serves as the central navigation hub for all SerenityOps documentation. All documentation has been organized into logical categories for easy discovery and maintenance.

---

## 📖 Table of Contents

1. [Project Documentation](#-project-documentation) - Core specifications, ethics, session logs
2. [Development Guides](#-development-guides) - Setup, quickstart, frontend architecture
3. [Interview Preparation](#-interview-preparation) - Company-specific prep, simulations, learnings
4. [System Architecture](#-system-architecture) - Design decisions, implementation details
5. [Build History](#-build-history) - Release notes and build logs

---

## 📄 Project Documentation

**Location**: [`./project/`](./project/)

Core project documentation, specifications, and philosophical foundations.

| Document | Description | Last Updated |
|----------|-------------|--------------|
| [README.md](./project/README.md) | Main project README and overview | Current |
| [serenityOps.md](./project/serenityOps.md) | Complete system specification (Spanish) | 2025-10-24 |
| [ethics_contract.md](./project/ethics_contract.md) | Non-negotiable ethical boundaries | 2025-10-24 |
| [claude.md](./project/claude.md) | Session log with historical decisions and rationale | Ongoing |

### Key Concepts

- **Philosophy**: "Serenity as Strategy" - calm, traceable processes
- **AI-Human Symbiosis**: AI suggests, human decides
- **Data Sovereignty**: YAML as single source of truth
- **Audit Trail**: All modifications tracked via Git

---

## 🚀 Development Guides

**Location**: [`./development/`](./development/)

Setup guides, architecture documentation, and development workflows.

### Quick Start & Setup

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](./development/QUICKSTART.md) | 5-minute setup walkthrough |

### Feature Documentation

| Document | Description | Status |
|----------|-------------|--------|
| [SIDEBAR_2026_FEATURES.md](./development/SIDEBAR_2026_FEATURES.md) | Planned sidebar features for 2026 | Planned |
| [SIDEBAR_IMPROVEMENTS.md](./development/SIDEBAR_IMPROVEMENTS.md) | Current sidebar improvement proposals | In Progress |
| [EMOJI_ELIMINATION_COMPLETE.md](./development/EMOJI_ELIMINATION_COMPLETE.md) | Emoji removal implementation | Complete ✅ |

### Frontend Architecture

**Location**: [`./development/frontend/`](./development/frontend/)

| Document | Description |
|----------|-------------|
| [FRONTEND_README.md](./development/frontend/FRONTEND_README.md) | Frontend architecture overview |
| [EXPERIENCE_MODULE_README.md](./development/frontend/EXPERIENCE_MODULE_README.md) | Experience module documentation |
| [ICONS_README.md](./development/frontend/ICONS_README.md) | Icon system usage guide |

### Technology Stack

- **Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS v4, Zustand
- **Backend**: FastAPI (Python 3.11+), Anthropic Claude API, PyYAML
- **Data Layer**: YAML files
- **Optional**: Redis (rate limiting, caching, Celery)

---

## 🎯 Interview Preparation

**Location**: [`./interviews/`](./interviews/)

Company-specific preparation materials, simulations, and technical learnings.

### 🏢 Company-Specific Preparation

#### Paylocity
**Location**: [`./interviews/paylocity/`](./interviews/paylocity/)

| Document | Type | Description |
|----------|------|-------------|
| [45min_runbook.md](./interviews/paylocity/45min_runbook.md) | Runbook | 45-minute interview runbook |
| [candidate_questions_for_manager.md](./interviews/paylocity/candidate_questions_for_manager.md) | Questions | Questions to ask the hiring manager |
| [cheat_cards.md](./interviews/paylocity/cheat_cards.md) | Reference | Quick reference cheat cards |
| [manager_questions_bank.md](./interviews/paylocity/manager_questions_bank.md) | Q&A Bank | Common manager interview questions |
| [star_stories.md](./interviews/paylocity/star_stories.md) | STAR Stories | Behavioral interview STAR method stories |
| [paylocity_context.md](./interviews/paylocity/paylocity_context.md) | Context | Company background and culture |
| [paylocity_interview_prep.md](./interviews/paylocity/paylocity_interview_prep.md) | Prep Guide | Comprehensive interview preparation |
| [paylocity_quick_brief.md](./interviews/paylocity/paylocity_quick_brief.md) | Quick Brief | Last-minute review summary |
| [elevator_pitch.txt](../../interview/paylocity_workflows/elevator_pitch.txt) | Pitch | Personalized elevator pitch |

### 🎓 General Interview Preparation

**Location**: [`./interviews/preparation/`](./interviews/preparation/)

| Document | Focus Area | Description |
|----------|-----------|-------------|
| [common_bugs_solutions.md](./interviews/preparation/common_bugs_solutions.md) | Debugging | Common bugs and solutions |
| [dotnet_optimization.md](./interviews/preparation/dotnet_optimization.md) | .NET | .NET optimization techniques |
| [react_performance.md](./interviews/preparation/react_performance.md) | React | React performance best practices |
| [technical_learnings.md](./interviews/preparation/technical_learnings.md) | Technical | Key technical learnings and insights |

### 🎬 Interview Simulations

**Location**: [`./interviews/simulations/`](./interviews/simulations/)

| Document | Date | Company | Outcome |
|----------|------|---------|---------|
| [paylocity_simulation_2025-10-23.md](./interviews/simulations/paylocity_simulation_2025-10-23.md) | 2025-10-23 | Paylocity | Simulation completed |

---

## 🏗️ System Architecture

**Location**: [`./architecture/`](./architecture/)

Design decisions, implementation details, and architectural patterns.

| Document | Topic | Description |
|----------|-------|-------------|
| [ICON_SYSTEM_IMPLEMENTATION.md](./architecture/ICON_SYSTEM_IMPLEMENTATION.md) | Icons | Icon system implementation details |
| [ICON_SYSTEM_SUMMARY.md](./architecture/ICON_SYSTEM_SUMMARY.md) | Icons | Icon system summary and usage |
| [LAYOUT_DIAGNOSIS.md](./architecture/LAYOUT_DIAGNOSIS.md) | Layout | Layout diagnosis and fixes |
| [ROOT_CAUSE_CONFIRMATION.md](./architecture/ROOT_CAUSE_CONFIRMATION.md) | Debugging | Root cause analysis methodology |

### Key Architectural Patterns

1. **YAML as Database**: All structured data in human-readable YAML
2. **AI-Human Symbiosis**: Claude generates, human approves
3. **Event Sourcing**: Git tracks all modifications
4. **Background Jobs**: Long-running tasks via job service
5. **Redis Integration**: Optional rate limiting and caching

---

## 🔨 Build History

**Location**: [`./builds/`](./builds/)

Release notes, build logs, and deployment history.

| Document | Description |
|----------|-------------|
| [latest.md](./builds/latest.md) | Latest build information |

---

## 🗂️ Documentation Tree Structure

```
docs/
├── README.md (this file) ← 📍 You are here
│
├── 📄 project/
│   ├── README.md
│   ├── serenityOps.md
│   ├── ethics_contract.md
│   └── claude.md
│
├── 🚀 development/
│   ├── QUICKSTART.md
│   ├── SIDEBAR_2026_FEATURES.md
│   ├── SIDEBAR_IMPROVEMENTS.md
│   ├── EMOJI_ELIMINATION_COMPLETE.md
│   └── frontend/
│       ├── FRONTEND_README.md
│       ├── EXPERIENCE_MODULE_README.md
│       └── ICONS_README.md
│
├── 🎯 interviews/
│   ├── paylocity/
│   │   ├── 45min_runbook.md
│   │   ├── candidate_questions_for_manager.md
│   │   ├── cheat_cards.md
│   │   ├── manager_questions_bank.md
│   │   ├── star_stories.md
│   │   ├── paylocity_context.md
│   │   ├── paylocity_interview_prep.md
│   │   └── paylocity_quick_brief.md
│   ├── preparation/
│   │   ├── common_bugs_solutions.md
│   │   ├── dotnet_optimization.md
│   │   ├── react_performance.md
│   │   └── technical_learnings.md
│   └── simulations/
│       └── paylocity_simulation_2025-10-23.md
│
├── 🏗️ architecture/
│   ├── ICON_SYSTEM_IMPLEMENTATION.md
│   ├── ICON_SYSTEM_SUMMARY.md
│   ├── LAYOUT_DIAGNOSIS.md
│   └── ROOT_CAUSE_CONFIRMATION.md
│
└── 🔨 builds/
    └── latest.md
```

---

## 🔍 Quick Search Guide

### By Role

- **Developer (New)** → Start with [QUICKSTART.md](./development/QUICKSTART.md)
- **Interviewer** → Browse [interviews/](./interviews/) by company
- **Architect** → Review [architecture/](./architecture/) decisions
- **PM/Owner** → Read [project/serenityOps.md](./project/serenityOps.md)

### By Task

- **Setup Project** → [development/QUICKSTART.md](./development/QUICKSTART.md)
- **Prepare for Interview** → [interviews/paylocity/](./interviews/paylocity/)
- **Understand Philosophy** → [project/ethics_contract.md](./project/ethics_contract.md)
- **Review Session History** → [project/claude.md](./project/claude.md)
- **Learn Icon System** → [development/frontend/ICONS_README.md](./development/frontend/ICONS_README.md)

---

## 📝 Contributing to Documentation

### File Naming Conventions

- **ALL_CAPS.md**: Technical implementation docs (e.g., `ICON_SYSTEM.md`)
- **lowercase.md**: General guides and specs (e.g., `quickstart.md`)
- **Title_Case.md**: Reference materials (e.g., `React_Performance.md`)

### Adding New Documentation

1. Determine the appropriate category (project/development/interviews/architecture/builds)
2. Create the file in the corresponding directory
3. Update this README.md with a link in the appropriate section
4. Follow existing formatting patterns
5. Commit with descriptive message: `docs(category): add new-doc-name`

---

## 🔗 External Resources

- **API Documentation**: http://localhost:8000/docs (when running)
- **Anthropic Claude**: https://console.anthropic.com/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React 19 Docs**: https://react.dev/

---

## 📅 Last Updated

**2025-10-24** - Complete documentation reorganization and Wiki creation

---

**Navigation**: [↑ Back to Top](#-serenityops-documentation-wiki) | [← Back to Project](../README.md)
