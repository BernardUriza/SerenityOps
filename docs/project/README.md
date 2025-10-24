# SerenityOps

**Personal Intelligence System for Structured Career & Financial Management**

Version: 1.0.0 | Status: Foundational | Privacy: Private Repository

---

## What is SerenityOps?

SerenityOps is not a passive repository. It's a **conversational ecosystem** where human intention meets AI execution, designed to maintain coherence between reflection, decision, and documentation.

It serves as:
- A **living mirror** of professional and financial evolution
- An **auditable memory** of decisions, opportunities, and growth
- A **calm automation layer** that transforms uncertainty into structured action

**Core philosophy**: *"Serenity with traceability"* — where every insight, commit, and calculation has a purpose and can be explained.

---

## Why SerenityOps Exists

Traditional career management is fragmented:
- CVs become outdated the moment they're written
- Financial goals exist in spreadsheets disconnected from career strategy
- Job search pipelines live in email threads and memory
- Reflection happens sporadically, without structure or accountability

SerenityOps unifies these domains into a single, version-controlled, AI-assisted intelligence system that:

1. **Automates CV generation** from structured data (`curriculum.yaml`)
2. **Tracks opportunities** like a personal CRM (`opportunities/`)
3. **Models financial projections** and debt payoff (`finances/`)
4. **Enforces ethical boundaries** via explicit contracts (`ethics_contract.md`)
5. **Executes periodic reasoning** (weekly/monthly/quarterly reflections)
6. **Logs conversational sessions** with AI for continuous learning

---

## Architecture Overview

```
SerenityOps/
├── ethics_contract.md          # Non-negotiable ethical boundaries
├── README.md                    # This file
│
├── foundations/                 # Core principles and axioms
│   └── axioms.yaml             # Philosophical foundation
│
├── finances/                    # Financial tracking & projections
│   └── structure.yaml          # Income, debt, goals
│
├── opportunities/               # Job search CRM
│   ├── structure.yaml          # Active opportunities pipeline
│   └── archive/                # Historical opportunities
│
├── curriculum/                  # Dynamic CV management
│   ├── curriculum.yaml         # Structured CV data (single source of truth)
│   ├── templates/              # Jinja2/LaTeX templates
│   └── versions/               # Generated CVs by date/opportunity
│
├── rituals/                     # Reflection protocols
│   ├── weekly_review.md
│   ├── monthly_reflection.md
│   └── quarterly_synthesis.md
│
├── logs/                        # Conversational memory
│   ├── sessions/               # Session-based logs
│   └── insights/               # Derived insights
│
└── scripts/                     # Executable tools
    ├── cv_builder.py           # Generate tailored CVs
    ├── reason.py               # Periodic reasoning engine
    └── metrics.py              # Calculate progress metrics
```

---

## Key Features

### 1. AI-Assisted CV Generation
- **Single source of truth**: `curriculum.yaml` contains all CV data
- **Dynamic tailoring**: Generate CVs optimized for specific opportunities
- **Multiple variants**: Technical, Executive, Ethical-Philosophical
- **Format flexibility**: Markdown, PDF (via WeasyPrint or LaTeX), HTML

```bash
# Generate technical CV tailored to opportunity
python scripts/cv_builder.py --variant technical --opportunity example-001 --format pdf
```

### 2. Opportunity Pipeline Management
- Track job applications through stages: discovered → applied → interviewing → offer
- Store contacts, timelines, and fit analysis scores
- Archive closed opportunities for historical analysis

### 3. Financial Intelligence
- Model income projections and debt payoff strategies
- Calculate key metrics: debt-to-income ratio, savings rate
- Set and track short/medium/long-term financial goals

### 4. Ethical Governance
- Explicit contract defining prohibited actions (no data falsification, no credential exposure)
- AI transparency: every automated action is logged with model attribution
- Human-in-the-loop: Bernard remains the final decision-maker

### 5. Periodic Reasoning
- **Weekly**: Action summaries, progress checks
- **Monthly**: Goal adjustments, emotional tone analysis
- **Quarterly**: Strategic evaluation, axiom refinement

*(Planned: `scripts/reason.py` for automated execution)*

---

## Philosophy & Principles

Defined in `foundations/axioms.yaml`:

1. **Serenity as Strategy**: Calm with traceability transforms uncertainty into action
2. **Integrity over Velocity**: Every action must be explainable and auditable
3. **Human-AI Symbiosis**: AI suggests, calculates, documents — human decides
4. **Conversation as Interface**: Natural language translates into structured data
5. **Iterative Learning**: Each cycle generates meta-knowledge
6. **Well-Being over Metrics**: Optimization serves the person, not vice versa

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Git
- Claude API key (required for CV generation)

### Installation

#### 1. Clone and Install Backend
```bash
# Clone repository (private)
git clone https://github.com/bernardorozco/serenityops.git
cd serenityops

# Install Python dependencies for API
cd api
pip install -r requirements.txt
cd ..
```

#### 2. Install Frontend
```bash
# Install React frontend dependencies
cd frontend
npm install
cd ..
```

### Running the Web Interface

SerenityOps now includes a **full web interface** built with React and FastAPI. No more manual YAML editing!

#### Start the Backend (Terminal 1)
```bash
cd api
python main.py

# Or with uvicorn directly:
# uvicorn main:app --reload
```

Backend will start on `http://localhost:8000`

#### Start the Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173`

#### Access the Interface
Open your browser to `http://localhost:5173`

You'll see:
- **Profile Tab**: Edit personal information and summary
- **Experience Tab**: Add/edit work experience with achievements
- **Projects Tab**: Manage projects with tech stacks
- **Skills Tab**: Edit programming languages, frameworks, databases, tools
- **Education Tab**: Manage education and spoken languages
- **Finances Tab**: (Coming soon) Financial tracking
- **Opportunities Tab**: (Coming soon) Job application pipeline

#### Using the Interface
1. Edit any fields in the forms
2. Click **Save Changes** to persist to `curriculum.yaml`
3. Click **Generate CV** to create a professional HTML CV with Claude AI
4. Generated CV opens automatically in a new tab

### CLI Usage (Alternative)

If you prefer command-line:

#### Generate a CV
```bash
# Default HTML CV
python scripts/cv_builder.py --format html

# PDF (requires Cairo system library)
python scripts/cv_builder.py --format pdf
```

#### Track an Opportunity
```yaml
# Add to opportunities/structure.yaml
- id: "acme-backend-001"
  company: "Acme Corp"
  role: "Backend Engineer"
  stage: "applied"
  # ... additional fields
```

#### Update Curriculum
```yaml
# Edit curriculum/curriculum.yaml
experience:
  - company: "New Company"
    role: "Senior Engineer"
    # ... details
```

Then regenerate CV:
```bash
python scripts/cv_builder.py --format pdf
```

---

## Roadmap

### Phase 1: Foundation (Current)
- [x] Core directory structure
- [x] Ethics contract and axioms
- [x] Structured data schemas (curriculum, finances, opportunities)
- [x] CV builder script skeleton

### Phase 2: Automation
- [ ] Implement `cv_builder.py` rendering logic
- [ ] Implement `reason.py` for periodic reflections
- [ ] Implement `metrics.py` for financial/career analytics
- [ ] Integrate Claude API for AI-assisted tailoring

### Phase 3: Intelligence
- [ ] Semantic job matching (opportunity ↔ skills)
- [ ] Sentiment analysis of logs
- [ ] Predictive financial modeling
- [ ] Dashboard for visualizing progress

### Phase 4: Integration
- [ ] Calendar sync for interviews
- [ ] Email integration for opportunity updates
- [ ] Cloud deployment (AWS Lambda / GCP Cloud Run)
- [ ] CI/CD for automated reasoning triggers

### Phase 5: Meta
- [ ] Anonymize and open-source framework
- [ ] Publish case study: "Building a Career Intelligence System"
- [ ] Community contributions and forks

---

## Privacy & Security

- **Private by default**: This repository is private
- **No secrets in version control**: API keys and credentials excluded via `.gitignore`
- **Anonymization for sharing**: If extracted publicly, all personal identifiers are removed
- **Audit trail**: Every modification tracked via Git with semantic commits

### Environment Variables Setup

**CRITICAL**: Never commit API keys or secrets to Git.

#### 1. Create `.env` file

```bash
# In project root
cp .env.example .env
```

#### 2. Add your API keys to `.env`

```bash
# Anthropic API (required for CV generation and AI features)
ANTHROPIC_API_KEY=your_actual_api_key_here

# API Configuration
API_PORT=8000
API_HOST=0.0.0.0

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000
```

#### 3. Get your Anthropic API Key

1. Go to https://console.anthropic.com/settings/keys
2. Create a new API key
3. Copy it to your `.env` file

#### 4. Verify `.gitignore` excludes `.env`

The `.gitignore` file already includes:
```gitignore
# Environments
.env
.envrc
.venv
```

**Never** remove these lines. The `.env` file must NEVER be committed to Git.

#### 5. Install Dependencies

Backend needs `python-dotenv` to load environment variables:
```bash
cd api
pip install python-dotenv anthropic
```

Frontend uses Vite's built-in env support (no extra package needed).

#### Security Checklist

- [ ] `.env` file created with your actual API key
- [ ] `.env.example` exists with placeholder values (safe to commit)
- [ ] `.gitignore` includes `.env` exclusion
- [ ] No hardcoded API keys in any `.py` or `.tsx` files
- [ ] API key starts with `sk-ant-api03-` (Anthropic format)

**If you accidentally commit a secret**:
1. **Immediately revoke the API key** at https://console.anthropic.com/settings/keys
2. Generate a new key
3. Clean Git history: `git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch <file>' --prune-empty --tag-name-filter cat -- --all`
4. Update `.env` with new key
5. Force push (if absolutely necessary): `git push origin --force --all`

---

## Contributing

This is a personal system, but principles and architecture are designed for replicability.

If you're building your own Career Intelligence System:
1. Fork the structure
2. Adapt `axioms.yaml` to your values
3. Modify schemas to your context
4. Share learnings (anonymized) if comfortable

---

## License

**Private Personal Project** — Not licensed for public use.

If open-sourced in the future, likely under MIT or Apache 2.0 with anonymization guidelines.

---

## Contact

**Owner**: Bernard Orozco
**Purpose**: Personal career and financial intelligence
**AI Collaborator**: Claude Code (Anthropic)

---

## Closing Thought

> *"The system exists to serve serenity, not productivity. If it ever induces stress, it has failed its purpose."*

SerenityOps is a living experiment in structured self-awareness — where code, reflection, and ethics converge.

**Welcome to the calm architecture of a life lived with intention.**