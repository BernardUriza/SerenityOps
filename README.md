# SerenityOps

**Personal Intelligence System for Structured Career & Financial Management**

SerenityOps is a full-stack application combining Python backend (FastAPI), React frontend (TypeScript + Vite), and YAML-based data persistence. The system assists with CV generation, opportunity tracking, financial projections, and AI-assisted career management through Claude API.

> **Core Philosophy**: "Serenity as Strategy" - transforming uncertainty into structured action through calm, traceable processes where AI suggests but humans decide.

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/BernardUriza/SerenityOps.git
cd SerenityOps

# Install dependencies
pnpm install
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Start development servers
pnpm start:serenity
```

Visit **http://localhost:5173** (frontend) and **http://localhost:8000/docs** (API docs)

---

## 📚 Documentation

### 📖 [Complete Documentation Wiki →](./docs/README.md)

The comprehensive documentation is organized in the `docs/` folder:

- **[Project Documentation](./docs/project/)** - Specifications, ethics, session logs
- **[Development Guides](./docs/development/)** - Quickstart, frontend, architecture
- **[Interview Preparation](./docs/interviews/)** - Company-specific prep, simulations, technical learnings
- **[System Architecture](./docs/architecture/)** - Icon system, layout, design decisions
- **[Build Logs](./docs/builds/)** - Build history and release notes

---

## 🎯 Key Features

- ✅ **CV Generation** - AI-powered CV generation with Claude API
- ✅ **Opportunity Tracking** - Job pipeline management (discovered → applied → interviewing → offer)
- ✅ **Financial Projections** - Income, debt, savings, goal tracking
- ✅ **Career Chat** - AI-assisted career advice and decision-making
- ✅ **Interview Prep** - Company-specific preparation materials and simulations
- ✅ **Redis Integration** - Rate limiting, caching, and job queue (optional)

---

## 🛠️ Technology Stack

**Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS v4, Zustand
**Backend**: FastAPI (Python 3.11+), Anthropic Claude API, PyYAML
**Data Layer**: YAML files (single source of truth)
**Optional**: Redis (rate limiting, caching, Celery job queue)

---

## 📁 Project Structure

```
SerenityOps/
├── frontend/          # React + TypeScript + Vite + Tailwind v4
├── api/               # FastAPI Python backend
├── scripts/           # Python CLI tools (cv_builder.py, validate.py)
├── curriculum/        # CV data (curriculum.yaml) + generated versions
├── opportunities/     # Job tracking data (structure.yaml)
├── finances/          # Financial tracking (structure.yaml)
├── foundations/       # Core principles (axioms.yaml)
├── logs/             # Conversation logs and session history
├── rituals/          # Reflection protocols (weekly/monthly/quarterly)
└── docs/             # 📚 Complete documentation wiki
```

---

## 🔑 Environment Variables

Create `.env` file in project root:

```bash
# Anthropic API (REQUIRED for CV generation)
ANTHROPIC_API_KEY=sk-ant-api03-...

# API Configuration
API_PORT=8000
API_HOST=0.0.0.0

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000

# Redis Configuration (optional - system works without Redis)
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=${REDIS_URL}
CELERY_RESULT_BACKEND=${REDIS_URL}
RATE_LIMIT_REDIS_URL=${REDIS_URL}
CLAUDE_CACHE_TTL=180
```

---

## 📝 Common Commands

### Full Stack Development
```bash
# Start both frontend and backend (recommended)
pnpm start:serenity

# Or start individually:
cd api && python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000  # Backend
cd frontend && npm run dev  # Frontend
```

### CLI Tools
```bash
# Generate CV from curriculum.yaml
python3 scripts/cv_builder.py --format html
python3 scripts/cv_builder.py --format pdf

# Validate system integrity (8 automated checks)
python3 scripts/validate.py
```

---

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome! Please respect privacy and never expose personal data or API keys.

---

## 📄 License

Private project for Bernard Uriza Orozco.

---

## 🔗 Links

- **API Documentation**: http://localhost:8000/docs (when running)
- **Complete Documentation Wiki**: [./docs/README.md](./docs/README.md)
- **Ethics Contract**: [./docs/project/ethics_contract.md](./docs/project/ethics_contract.md)
- **Project Specification**: [./docs/project/serenityOps.md](./docs/project/serenityOps.md)

---

**Built with serenity. Powered by AI.**
