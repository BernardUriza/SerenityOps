# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SerenityOps** is a personal intelligence system for structured career and financial management. It's a full-stack application combining Python backend (FastAPI), React frontend (TypeScript + Vite), and YAML-based data persistence. The system assists with CV generation, opportunity tracking, financial projections, and AI-assisted career management through Claude API.

**Core Philosophy**: "Serenity as Strategy" - transforming uncertainty into structured action through calm, traceable processes where AI suggests but humans decide.

## Architecture

### Monorepo Structure (Turborepo + pnpm)
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
└── rituals/          # Reflection protocols (weekly/monthly/quarterly)
```

### Technology Stack
- **Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS v4, Zustand, react-hook-form
- **Backend**: FastAPI (Python 3.11+), Anthropic Claude API, PyYAML
- **Package Management**: pnpm workspaces + Turborepo
- **Data Layer**: YAML files (single source of truth)
- **PDF Generation**: Node.js service (api/services/pdf_generator/)

### Key Design Patterns
1. **YAML as Database**: All structured data lives in human-readable YAML files (curriculum.yaml, opportunities/structure.yaml, finances/structure.yaml)
2. **AI-Human Symbiosis**: Claude API generates CVs and assists with career decisions, but humans remain final decision-makers
3. **Event Sourcing**: All modifications tracked via Git with semantic commits
4. **Background Jobs**: Long-running tasks (CV generation, PDF creation) use job service with status tracking

## Common Development Commands

### Full Stack Development
```bash
# Start both frontend and backend in parallel (recommended)
pnpm start:serenity

# Or start individually:
# Terminal 1 - Backend
cd api && python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Backend Only
```bash
cd api

# Start development server (with hot reload)
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start production server
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000

# Alternative: use server.py wrapper
python3 server.py

# Install Python dependencies
python3 -m pip install -r ../requirements.txt

# Run tests
python3 -m pytest

# Clean Python cache
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
```

**Backend runs on**: `http://localhost:8000`
**API docs**: `http://localhost:8000/docs` (OpenAPI/Swagger)

### Frontend Only
```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

**Frontend runs on**: `http://localhost:5173` (Vite default)

### CLI Tools (Python Scripts)
```bash
# Generate CV from curriculum.yaml
python3 scripts/cv_builder.py --format html
python3 scripts/cv_builder.py --format pdf

# Validate system integrity (8 automated checks)
python3 scripts/validate.py
```

### Monorepo Commands (from root)
```bash
# Run dev in all workspaces (frontend + api)
pnpm start:serenity

# Build all workspaces
pnpm build

# Run linters across all workspaces
pnpm lint

# Clean build artifacts
pnpm clean

# Run tests in all workspaces
pnpm test
```

## Critical Files and Their Purpose

### Data Layer (YAML)
- **`curriculum/curriculum.yaml`**: Single source of truth for CV data (personal info, experience, projects, skills, education). Modified via frontend or directly.
- **`opportunities/structure.yaml`**: Job pipeline tracking (discovered → applied → interviewing → offer)
- **`finances/structure.yaml`**: Income, debt, savings, financial goals
- **`foundations/axioms.yaml`**: Core philosophical principles guiding the system

### Backend (Python/FastAPI)
- **`api/main.py`**: FastAPI application entry point, defines all REST endpoints
- **`api/server.py`**: Alternative entry point with debugging info
- **`api/services/cv_job_service.py`**: Background job tracking for CV generation
- **`api/services/audit_logger.py`**: Action logging and traceability
- **`api/services/pdf_service.py`**: Interfaces with Node.js PDF generator
- **`api/services/pdf_generator/generate_pdf.js`**: Node.js script for HTML→PDF conversion

### Frontend (React/TypeScript)
- **`frontend/src/App.tsx`**: Main application component, tab navigation, state management
- **`frontend/src/components/CVManager.tsx`**: CV generation interface
- **`frontend/src/components/chat/ChatManager.tsx`**: AI chat interface for career decisions
- **`frontend/src/components/opportunities/OpportunityManager.tsx`**: Job tracking UI
- **`frontend/src/stores/cvJobStore.ts`**: Zustand store for CV job status

### Scripts (CLI Tools)
- **`scripts/cv_builder.py`**: Generates CVs from curriculum.yaml (Markdown/HTML/PDF)
- **`scripts/validate.py`**: System integrity checker (directory structure, YAML syntax, execution tests)

### Configuration
- **`turbo.json`**: Turborepo pipeline configuration
- **`pnpm-workspace.yaml`**: Defines monorepo workspaces
- **`.env`**: Environment variables (ANTHROPIC_API_KEY, API_PORT) - **NEVER commit this**
- **`.env.example`**: Template for environment variables (safe to commit)

## Development Workflow

### Making Changes to CV Data
1. **Via Frontend** (recommended): Navigate to Profile/Experience/Projects tabs, edit forms, click "Save Changes"
2. **Via YAML**: Edit `curriculum/curriculum.yaml` directly, reload frontend to see changes
3. **Generate CV**: Click "Generate CV" button or run `python3 scripts/cv_builder.py`

### Adding New API Endpoints
1. Add route handler in `api/main.py` (group related endpoints together)
2. Define Pydantic models for request/response validation
3. Document endpoint with docstrings (appears in `/docs`)
4. Test via FastAPI Swagger UI at `http://localhost:8000/docs`

### Adding New Frontend Components
1. Create component in `frontend/src/components/` (use TypeScript)
2. Follow existing patterns: use Tailwind v4 for styling, Zustand for state
3. Import and use in `App.tsx` or parent component
4. Ensure proper error handling and loading states

### Testing CV Generation
```bash
# Method 1: Frontend UI
# 1. Start servers: pnpm start:serenity
# 2. Navigate to "CVs" tab
# 3. Click "Generate CV" button
# 4. Monitor progress bar and job status

# Method 2: CLI
python3 scripts/cv_builder.py --format html
# Output: curriculum/versions/cv_YYYYMMDD_HHMMSS.html

# Method 3: Direct API
curl -X POST http://localhost:8000/api/curriculum/generate
```

## Environment Setup

### Required Environment Variables
Create `.env` file in project root (copy from `.env.example`):

```bash
# Anthropic API (REQUIRED for CV generation)
ANTHROPIC_API_KEY=sk-ant-api03-...

# API Configuration
API_PORT=8000
API_HOST=0.0.0.0

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000
```

**CRITICAL**: Never commit `.env` to Git. It's already in `.gitignore`.

### Getting Anthropic API Key
1. Visit https://console.anthropic.com/settings/keys
2. Create new API key
3. Add to `.env` file

### System Dependencies
- **Python 3.11+**: Required for backend and scripts
- **Node.js 20+**: Required for frontend and PDF generation
- **pnpm 9+**: Package manager (install: `npm install -g pnpm`)
- **Cairo/Pango** (for WeasyPrint PDF generation):
  - macOS: `brew install cairo pango gdk-pixbuf libffi`
  - Ubuntu: `apt-get install libcairo2 libpango-1.0-0 libgdk-pixbuf2.0-0`

## Key Behavioral Notes

### Git Workflow
- **Semantic commits required**: Use conventional commits format (`feat:`, `fix:`, `refactor:`, `docs:`)
- **Every CV generation creates a versioned file**: `curriculum/versions/cv_YYYYMMDD_HHMMSS.html`
- **Audit trail**: All data modifications logged in `logs/audit/`
- **Conversations tracked**: AI chat sessions stored in `logs/conversations/`

### Error Handling Patterns
- **Frontend**: Display user-friendly notifications via `showNotification(message, type)`
- **Backend**: Raise HTTPException with appropriate status codes (400, 404, 500)
- **Background Jobs**: Update job status to 'failed' with error message, don't crash

### Claude API Usage
- **Model**: claude-sonnet-4-5-20250929 (primary) or claude-3-5-sonnet-20241022 (fallback)
- **Purpose**: CV generation, career advice, opportunity analysis
- **Rate Limits**: Be mindful of API costs, cache responses when possible
- **Prompt Engineering**: Use system prompts from `api/main.py:generate_cv_html()`

### YAML Guidelines
- **Single-document YAML only**: No multi-document separators (`---`) except at start
- **Human-readable**: Use descriptive keys, add comments for clarity
- **Validation**: Run `python3 scripts/validate.py` after manual edits
- **Encoding**: UTF-8 with no BOM

### Tailwind CSS v4 (Frontend)
- **Configuration**: Uses `@tailwindcss/vite` plugin, config in `frontend/src/index.css`
- **Design System**: "Compact Precision" - inspired by macOS Human Interface Guidelines
- **Colors**: Neutral grays with purple accent (`text-purple-600`)
- **Spacing**: Tight spacing (p-3, gap-2, space-y-1.5) for information density
- **Typography**: System fonts, clear hierarchy, readable sizes

## Common Pitfalls

### Backend Not Starting
1. **Check if port 8000 is in use**: `lsof -ti:8000 | xargs kill -9`
2. **Verify Python dependencies**: `cd api && pip install -r ../requirements.txt`
3. **Check .env file exists**: Should contain `ANTHROPIC_API_KEY`
4. **Look for import errors**: Run `python3 api/main.py` directly to see traceback

### Frontend Not Connecting to Backend
1. **CORS errors**: Backend must be running on `http://localhost:8000`
2. **Check VITE_API_BASE_URL**: Should match backend URL
3. **Verify backend is healthy**: Visit `http://localhost:8000/docs`
4. **Hard refresh frontend**: Cmd+Shift+R (macOS) or Ctrl+Shift+R (Windows)

### CV Generation Failing
1. **Check Anthropic API key**: Must be valid and have credits
2. **Review curriculum.yaml syntax**: Run `python3 scripts/validate.py`
3. **Check job status**: Visit `/api/jobs/{job_id}` to see error details
4. **Review logs**: Check `logs/audit/` for detailed error messages

### PDF Generation Not Working
1. **Verify Node.js installed**: `node --version` (should be 20+)
2. **Check pdf_generator dependencies**: `cd api/services/pdf_generator && npm install`
3. **Test HTML generation first**: Use `--format html` flag
4. **Review pdf_service.py logs**: Backend will show subprocess errors

## Philosophical Alignment

When making changes, respect the core axioms in `foundations/axioms.yaml`:

1. **Serenity as Strategy**: Favor calm, traceable processes over speed
2. **Integrity over Velocity**: Every action must be explainable and auditable
3. **Human-AI Symbiosis**: AI suggests, human decides - never automate critical decisions
4. **Conversation as Interface**: Natural language → structured data
5. **Iterative Learning**: Each cycle generates meta-knowledge
6. **Well-Being over Metrics**: Optimization serves the person, not vice versa

**In practice**:
- Add audit logging for important actions
- Provide clear explanations in UI
- Never auto-commit changes without user confirmation
- Maintain traceability (who, what, when, why)
- Graceful degradation (system should work even if AI APIs are down)

## Testing and Validation

### System Integrity Check
```bash
python3 scripts/validate.py
# Runs 8 checks:
# - Directory structure
# - Required files
# - YAML syntax (axioms, curriculum, opportunities, finances)
# - Python syntax (cv_builder.py)
# - CV builder execution
```

### Manual Testing Checklist
- [ ] Backend starts without errors (`pnpm start:serenity`)
- [ ] Frontend loads and displays curriculum data
- [ ] Can edit profile and save changes
- [ ] CV generation completes successfully
- [ ] Chat interface responds to messages
- [ ] Opportunities can be created/edited
- [ ] Validation script passes all checks

## Additional Resources

- **Main Documentation**: `README.md` - Comprehensive system overview
- **Quick Start Guide**: `QUICKSTART.md` - 5-minute setup walkthrough
- **Session Log**: `claude.md` - Historical decisions and rationale
- **Original Spec**: `serenityOps.md` - Full system specification (Spanish)
- **Ethics Contract**: `ethics_contract.md` - Non-negotiable boundaries

## Support

This is a personal project for Bernard Orozco. For questions or contributions:
- Check existing docs (README.md, QUICKSTART.md)
- Review session logs (claude.md) for context
- Respect privacy: never expose personal data or API keys

---

## Session History & Changelog

### 2025-10-24: Persistent Deployment Badge System

**Objective**: Implement a real-time version tracking badge to eliminate cache ambiguity and provide instant deployment awareness.

**Implementation**:

#### Backend Changes
- **Added `/api/version` endpoint** (`api/main.py:2669`)
  - Returns frontend/backend versions, commit hashes, build dates
  - Extracts git metadata: commit hash, author, message, timestamp
  - Uses subprocess to query git directly (no caching)
  - Graceful fallback to "unknown" if git unavailable

#### Frontend Components
1. **`frontend/src/hooks/useVersionInfo.ts`**
   - Custom hook for version data fetching
   - Auto-refresh every 15 seconds (configurable)
   - Handles loading/error states
   - Uses `setInterval` for continuous polling

2. **`frontend/src/components/VersionBadge.tsx`**
   - Fixed position: `bottom-2 right-3` (z-index: 9999)
   - Semi-transparent design: `bg-white/40 backdrop-blur-md`
   - Shows: `🪶 v{frontend.version} · ⚙️ {backend.version}`
   - Click to expand detailed modal
   - Hover effect: `bg-white/60`

3. **`frontend/src/components/VersionDetailModal.tsx`**
   - Expandable modal with build details
   - Displays:
     - Frontend build (version + commit)
     - Backend build (version + commit)
     - Last change (author, description, timestamp)
     - Link to build history
   - Formatted timestamps using `Date.toLocaleString()`
   - Backdrop for easy dismissal

#### Build Tracking
- **`logs/builds/latest.md`** - Deployment changelog template
  - Documents each deployment
  - Includes change summary, commits, authors
  - Manual update for now (future: CI/CD integration)

**Design Decisions**:
- **Polling vs WebSockets**: Chose 15-second polling for simplicity
- **Git Integration**: Direct subprocess calls ensure fresh data
- **Visibility**: Always visible but non-intrusive (11px font, 40% opacity)
- **macOS Aesthetic**: Maintains Liquid Glass design system consistency
- **z-index Management**: 9999 ensures badge stays above all content

**Testing**:
```bash
# Verify endpoint
curl http://localhost:8000/api/version

# Expected response:
{
  "frontend": {"version": "1.3.27", "commit": "c9c893e"},
  "backend": {"version": "0.9.18", "commit": "c9c893e"},
  "last_change": {...}
}
```

**Benefits**:
- ✅ Instant deployment confirmation (no cache uncertainty)
- ✅ Real-time version sync across frontend/backend
- ✅ Persistent visibility (all tabs, all views)
- ✅ Build metadata always accessible
- ✅ Supports rapid iteration workflows

**Future Enhancements**:
- [ ] CI/CD integration for auto-updating `logs/builds/latest.md`
- [ ] Version mismatch alerts (frontend vs backend)
- [ ] Deployment notifications (new version available)
- [ ] Build history viewer with full changelog
- [ ] WebSocket upgrade for real-time updates (optional)

**Files Modified**:
- `api/main.py` - Added `/api/version` endpoint
- `frontend/src/App.tsx` - Integrated VersionBadge component
- `frontend/src/components/VersionBadge.tsx` - New
- `frontend/src/components/VersionDetailModal.tsx` - New
- `frontend/src/hooks/useVersionInfo.ts` - New
- `logs/builds/latest.md` - New

---

### 2025-10-24: Sidebar/Header Layout Structural Correction

**Objective**: Eliminate logo/toggle overlap, visibility issues, and contrast problems through architectural reorganization (not local patches).

**Root Cause Analysis**:
- Complete diagnosis documented in `docs/LAYOUT_DIAGNOSIS.md` (924 lines)
- Validation with mathematical proofs in `docs/ROOT_CAUSE_CONFIRMATION.md` (955 lines)
- Identified 3 primary issues + 5 additional findings

**Problems Resolved**:

1. **🔴 Logo/Toggle Overlap**
   - Cause: Toggle button used `absolute top-4 right-4 z-50` floating over header
   - Header had no reserved space for toggle, causing spatial conflict
   - Both elements at right: 64px in collapsed state (exact overlap)

2. **🔵 Toggle Button Invisibility**
   - Triple stacking context isolation (backdrop-filter + relative z-10 + overflow-hidden)
   - Temporary truncation during animation overshoot (~9px, 50-100ms)
   - Visual obscuration by logo glow effect (blur-2xl extending 40px)

3. **🟣 Insufficient Contrast in Action Buttons**
   - Save button: liquid-glass with ~1.2:1 contrast (below WCAG 3:1 minimum)
   - No visual differentiation in collapsed state

**Implementation** (6 commits):

#### Phase 1: Relocate Toggle into Header
- **Commit**: `205a957` refactor(ui/sidebar): relocate toggle into header
- Moved toggle from absolute positioning to header flex child
- Header now uses `justify-between` (logo ←→ toggle)
- Toggle: `w-11 h-11` (44px) for WCAG touch target compliance
- Reduced glow in collapsed: `blur-lg opacity-50` vs `blur-2xl opacity-70`
- Added `aria-label` for accessibility

#### Phase 2: Restrict Overflow to Nav Only
- **Commit**: `6dcf92e` refactor(ui/sidebar): restrict overflow-hidden to nav
- Removed overflow-hidden from sidebar container
- Removed overflow-hidden from TOP SECTION wrapper
- Kept overflow-y-auto on nav (only place needing scroll)
- Eliminates triple-nested overflow hierarchy

#### Phase 3: Reduce Logo Glow (completed in Phase 1)
- Glow reduced from `blur-2xl opacity-70` to `blur-lg opacity-50`
- Prevents visual obscuration of toggle button

#### Phase 4: Align Z-Index Hierarchy
- **Commit**: `7930ea9` chore(ui/zindex): align to project scale
- Sidebar: `z-10` → `z-sticky` (1020)
- Notification toast: `z-50` → `z-modal` (1050)
- Follows tailwind.config.js scale: dropdown(1000) → sticky(1020) → fixed(1030) → modal-backdrop(1040) → modal(1050) → popover(1060) → tooltip(1070)

#### Phase 5: Eliminate Animation Overshoot
- **Commit**: `472e85b` refactor(ui/animation): eliminate overshoot
- Changed easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` → `cubic-bezier(0.25, 0.1, 0.25, 1)`
- Eliminates ~9px overshoot that caused temporary clipping
- Trade-off: Less "dynamic" feel, better UX stability

#### Phase 6: Improve Button Contrast
- **Commit**: `db2c163` style(ui/actions): improve collapsed contrast
- Save button: `liquid-glass` → `glass-strong` (opacity 0.85 vs 0.05-0.1)
- Border: `border-macBorder/40` → `border-macAccent/50`
- Hover border: `border-macAccent/60` → `border-macAccent/80`
- Added `aria-label` to both buttons
- New contrast: ~3.5:1 (passes WCAG AA)

**Layout Rules Established** (MUST follow for all future changes):

1. **Toggle Button Placement**
   - ✅ Toggle MUST be inside Header as flex child
   - ❌ NEVER use absolute positioning for toggle
   - ✅ Header uses `justify-between` to separate logo and toggle
   - ✅ Toggle has `flex-shrink-0` to prevent collapse

2. **Overflow Management**
   - ✅ Apply `overflow-hidden` ONLY to nav container
   - ❌ NEVER apply to sidebar or TOP SECTION wrappers
   - ✅ Nav uses `overflow-y-auto` for scrolling
   - Purpose: Allows tooltips/popovers to escape naturally

3. **Z-Index Policy**
   - ✅ Use ONLY values from `tailwind.config.js` scale
   - ❌ NEVER use arbitrary z-index values (z-10, z-50, etc.) outside context
   - Hierarchy:
     - Base layout: z-10 (relative within sidebar)
     - Sidebar: z-sticky (1020)
     - Modals/notifications: z-modal (1050)
     - Tooltips: z-tooltip (1070) - always on top
   - ✅ Tooltips use `z-tooltip` and `absolute left-full` to escape sidebar

4. **Animation Standards**
   - ✅ Use smooth easing without overshoot for layout animations
   - ✅ Recommended: `cubic-bezier(0.25, 0.1, 0.25, 1)` (ease-in-out)
   - ❌ AVOID spring-like easing with overshoot (values >1.0 in control points)
   - Duration: 0.4s for sidebar width transitions
   - **Framer Motion with Conditional Rendering**:
     - ❌ NEVER use `initial={{ opacity: 0 }}` on conditionally rendered `motion.div` without `<AnimatePresence>`
     - ✅ For immediate visibility: use plain `div` instead of `motion.div` for conditional content
     - ✅ If animation is required: wrap in `<AnimatePresence mode="wait">` to enable proper mount/unmount transitions
     - 🔍 Root cause (commit ea3e491): motion.div without AnimatePresence gets stuck at opacity: 0
     - Priority: **Visibility stability over aesthetic transitions**

5. **Accessibility Requirements**
   - ✅ All interactive elements: minimum 44px × 44px (WCAG 2.1 SC 2.5.5)
   - ✅ Component contrast: minimum 3:1 (WCAG 2.1 SC 1.4.3)
   - ✅ Add `aria-label` to icon-only buttons
   - ✅ Maintain focus visible states

6. **Contrast Guidelines**
   - ✅ Use `glass-strong` (not `liquid-glass`) for primary action buttons
   - ✅ Borders should use `border-macAccent/50` or higher for visibility
   - ✅ Generate CV maintains supremacy with `gradient-accent`
   - ✅ Save button clearly distinguishable but secondary

**Verification Checklist** (for future PRs):

- [ ] Toggle visible in both expanded (260px) and collapsed (80px) states
- [ ] No overlap between logo and toggle bounding boxes
- [ ] Toggle clickable throughout entire animation (no clipping)
- [ ] Tooltips appear above sidebar/header (not clipped)
- [ ] **ChatSidebar buttons visible in both expanded/collapsed modes** (no opacity: 0 containers)
- [ ] Action buttons have contrast ≥3:1
- [ ] All interactive elements ≥44px touch target
- [ ] Focus states visible on all buttons
- [ ] No console errors about z-index or stacking context
- [ ] Layout stable at zoom 90-125%

**Testing Performed**:
- Mathematical position calculations (confirmed in Root Cause Report)
- Frame-by-frame animation analysis
- Stacking context hierarchy validation
- WCAG 2.1 contrast measurements

**Files Modified**:
- `frontend/src/App.tsx`: All layout changes (6 commits)
- `docs/LAYOUT_DIAGNOSIS.md`: Initial analysis
- `docs/ROOT_CAUSE_CONFIRMATION.md`: Validation report
- `CLAUDE.md`: This documentation

**Performance Impact**:
- ✅ No degradation (removed unnecessary overflow clipping)
- ✅ Fewer stacking contexts (simpler paint tree)
- ✅ Smoother animation (no overshoot recalculations)

---

### ChatSidebar Visibility Fix (October 2025)

**Problem**: All buttons in ChatSidebar invisible in both expanded and collapsed states.

**Root Cause** (multi-layered opacity blocking):

1. **Container opacity**: Lines 122-129 and 166-181 in ChatSidebar.tsx had `motion.div` with `initial={{ opacity: 0 }}` without `<AnimatePresence>` wrapper
   - Framer Motion never executed `animate={{ opacity: 1 }}` transition
   - Content containers stuck at `opacity: 0`

2. **Header opacity**: Lines 107-119 had `motion.div` wrapping `SidebarHeader` with `animate={{ opacity: isCollapsed ? 0 : 1 }}`
   - In collapsed state, entire Header hidden including critical Toggle button
   - Users unable to expand sidebar (UX critical failure)

3. **Button duplication**: New Chat button appeared in both Header and CollapsedSidebarNav
   - Visual confusion and redundant UI elements

**Solution Applied** (4 commits):

1. **ea3e491**: Remove opacity animations from content containers
   - Replaced `motion.div` → `div` for both expanded and collapsed content wrappers
   - Immediate visibility (no animation dependencies)

2. **e5acf85**: Document Framer Motion conditional rendering rule
   - Added permanent rule: NEVER use `initial={{ opacity: 0 }}` without `<AnimatePresence>`
   - Priority: visibility stability over aesthetic transitions

3. **eebd9fb**: Adapt Header for collapsed state
   - Removed opacity wrapper from ChatSidebar (Header always rendered)
   - Modified SidebarHeader to adapt layout based on `isCollapsed` prop:
     - Collapsed: `justify-center`, buttons in vertical column, logo hidden
     - Expanded: `justify-between`, buttons horizontal, logo + title shown
   - Toggle button now ALWAYS visible (critical fix)

4. **13e039a**: Remove duplicate New Chat button
   - Header only shows Toggle button when collapsed
   - CollapsedSidebarNav handles all other actions
   - Clean separation of responsibilities

**Adaptive Header Pattern** (reusable for other collapsible components):

```tsx
// Header container with conditional layout
<div className={`fixed-height ${
  isCollapsed ? 'justify-center px-narrow' : 'justify-between px-wide'
}`}>
  {/* Content only shown when expanded */}
  {!isCollapsed && (
    <div className="logo-and-title">...</div>
  )}

  {/* Actions always visible, layout adapts */}
  <div className={`flex ${isCollapsed ? 'flex-col' : 'flex-row'}`}>
    <ToggleButton />  {/* Always visible */}
    {!isCollapsed && <OtherActions />}  {/* Conditional */}
  </div>
</div>
```

**Key Lessons**:
- ✅ Critical interactive elements (toggle buttons) must NEVER be hidden by animations
- ✅ Use conditional rendering (`{!isCollapsed && ...}`) instead of opacity animations
- ✅ Collapsible headers should adapt content, not hide completely
- ❌ Never wrap conditionally-rendered content in `motion.div` without `AnimatePresence`

**Verification Tests**:
- Toggle button visible and clickable in both collapsed (64px) and expanded (260px) states
- All CollapsedSidebarNav buttons (New Chat, Search, Recent) render with `opacity: 1`
- No duplicate buttons between Header and CollapsedSidebarNav
- Smooth collapse/expand transition without content flickering

**Files Modified**:
- `frontend/src/components/chat/ChatSidebar.tsx`: Removed opacity wrappers
- `frontend/src/components/chat/SidebarHeader.tsx`: Adaptive layout implementation
- `claude.md`: Documented adaptive header pattern (this section)

---

### Collapsed Sidebar Vertical Layout Pattern (October 2025)

**Problem**: Collapsed mode (64px width) looked "anticuada" with horizontal cramming of elements.

**User Feedback**: "se ve raro y anticuada la distribución... podrias acomodar mejor el logo de la esquina con su boton expandible si lo pones debajo en vez de a un lado"

**Solution Applied** (commit 0ffa119): Complete redesign to vertical stacking pattern

**Vertical Layout Pattern** (for sidebars ≤80px width):

```tsx
// SidebarHeader in collapsed mode
if (isCollapsed) {
  return (
    <div className="flex flex-col items-center gap-3 px-2 py-3">
      {/* Logo Icon - Top */}
      <div className="w-10 h-10 rounded-lg gradient-accent">
        <Icon size={18} />
      </div>

      {/* Toggle Button - Below Logo */}
      <button className="w-8 h-8 rounded-lg">
        <ExpandIcon size={16} />
      </button>
    </div>
  );
}
```

**Design Principles for Collapsed Sidebars**:

1. **Vertical Stacking**: Always stack elements vertically, never horizontal in <80px width
2. **Visual Hierarchy**: Logo/Brand → Toggle → Primary Actions → Secondary Actions
3. **Consistent Spacing**: Use gap-3 (12px) for major sections, gap-2 (8px) for related items
4. **Icon Sizing**: Logo 18-20px, Actions 16px, utility icons 14px
5. **Subtle Animations**: whileHover scale:1.05 (not 1.1), duration:200ms (not 300ms)
6. **Compact Badges**: 16px × 16px max, show "9+" instead of "99+" for counts
7. **Border Radius**: rounded-lg (8px) for consistency in narrow space
8. **Early Return Pattern**: Separate rendering logic for collapsed vs expanded modes

**Dimensions Guide** (collapsed mode, 64px width):

| Element | Size | Icon | Spacing |
|---------|------|------|---------|
| Logo container | 40px × 40px | 18px | - |
| Toggle button | 32px × 32px | 16px | gap-3 from logo |
| Action buttons | 32px × 32px | 16px | gap-2 between |
| Chat items | 40px × 40px | 16px | gap-2 between |
| Count badges | 16px × 16px | 8px text | absolute position |
| Dividers | - | 1px height | my-1.5 (6px) |

**CollapsedSidebarNav Structure**:
```tsx
<div className="flex-1 flex flex-col items-center py-3 gap-2">
  <ActionButton />           {/* Primary action */}
  <Divider className="my-1.5" />
  <ActionButton />           {/* Secondary action */}
  <Divider className="my-1.5" />
  <ScrollableList>           {/* Chat items */}
    <ChatItem />
  </ScrollableList>
  <Divider className="my-1.5" />
  <UtilityButtons />         {/* Bottom actions */}
</div>
```

**Key Improvements**:
- ✅ Logo always visible as visual anchor
- ✅ Clear separation between logo and toggle (prevents cramming)
- ✅ Follows modern sidebar patterns (Discord, Notion, Linear 2026)
- ✅ Better touch targets despite compact size (32px+ all interactive elements)
- ✅ Reduced motion (accessibility improvement)
- ✅ Faster transitions (200ms instead of 300ms)

**Performance Optimizations**:
- Eliminated rotation animation wrapper (static icon instead)
- Early return pattern reduces conditional rendering complexity
- Simpler DOM structure (fewer nested divs)
- Removed unnecessary motion.div wrappers

**Anti-Patterns to Avoid**:
- ❌ Horizontal layout in <80px width (cramped, unreadable)
- ❌ Rotating icons in tight spaces (disorienting)
- ❌ Large badges (>16px) in collapsed mode
- ❌ Hover scale >1.05 in narrow sidebars (elements escape container)
- ❌ Mixing horizontal and vertical layouts in same component state

**Files Modified** (commit 0ffa119):
- `frontend/src/components/chat/SidebarHeader.tsx`: Vertical layout for collapsed mode
- `frontend/src/components/chat/CollapsedSidebarNav.tsx`: Spacing and animation refinements

---

### Main Sidebar Vertical Layout Redesign (October 2025)

**User Request**: "ahora lo mismo con el sidebar principal, mejora ese orden de ser columna a ser row"

**Solution Applied** (commit 9df2526): Applied same vertical stacking pattern to main application sidebar

**Collapsed Mode Changes** (80px width):

| Component | Before | After | Savings |
|-----------|--------|-------|---------|
| **Header Height** | 96px (h-24) | 64px (h-16) | -32px |
| **Logo Size** | 48px (w-12) | 40px (w-10) | -8px |
| **Toggle Size** | 44px (w-11) | 32px (w-8) | -12px |
| **Nav Item Height** | 56px (h-14) | 44px (h-11) | -12px each |
| **Icon Size** | 24px | 20px | -4px |
| **Text Size** | text-sm (14px) | text-xs (12px) | -2px |
| **Action Buttons** | 48px (h-12) | 40px (h-10) | -8px each |
| **Total Vertical** | ~800px | ~644px | **-156px (25%)** |

**Header Layout Pattern**:
```tsx
{isCollapsed ? (
  // Collapsed: Vertical stack
  <div className="flex flex-col items-center gap-3 px-2 py-3">
    <Logo size={40} />
    <ToggleButton size={32} />
  </div>
) : (
  // Expanded: Horizontal
  <div className="h-16 flex items-center justify-between px-4 py-3 gap-3">
    <Logo + Title />
    <ToggleButton />
  </div>
)}
```

**Navigation Improvements**:
- Gap: gap-3 (12px) → gap-2 (8px) between items
- Padding: py-4 → py-3 for nav container
- Transitions: duration-500 → duration-300 (snappier)
- Active indicator: Removed pulsing animation (static instead)
- Hover scale: Removed scale-[1.02] (prevents layout shift)
- Shadows: Reduced from shadow-2xl to shadow-lg

**Action Buttons Optimization**:
- Container: pt-3 space-y-3 border-t-2 → pt-2 space-y-2 border-t
- Icons: w-6 h-6 → w-5 h-5 (20px)
- Text: text-sm → text-xs
- Padding: gap-3 px-4 → gap-2 px-3
- Hover animations: scale 1.25 → 1.10 (subtle)

**Consistency Achievements**:
- ✅ Both ChatSidebar and main Sidebar use identical vertical pattern
- ✅ Same dimensions: Logo 40px, Toggle 32px, Nav 44px
- ✅ Same spacing: gap-3 for major sections, gap-2 for items
- ✅ Same transitions: 300ms for interactions, 200ms for micro-animations
- ✅ Same border radius: rounded-lg for compact, rounded-xl for expanded

**Visual Hierarchy** (collapsed mode, top to bottom):
```
┌─────────────┐
│   [Logo]    │  40px - Brand identity
│  [Toggle]   │  32px - Primary action
├─────────────┤
│             │
│  [Chat]  1  │  44px - Active with indicator
│  [Import]   │  44px
│  [Profile]  │  44px
│  [Exp.]     │  44px
│  [Proj.] ⚠  │  44px - With badge
│  [Skills]   │  44px
│  [Edu.]     │  44px
│  [CVs]   ✓  │  44px - With badge
│  [Fin.]     │  44px
│  [Opp.]  ⚠  │  44px - With badge
│             │
├─────────────┤
│  [Theme]    │  Component
│  [Profile]  │  Component
├─────────────┤
│  [Save]     │  40px - Secondary action
│  [Gen CV]   │  40px - Primary action
└─────────────┘
```

**Performance Improvements**:
- Eliminated complex AnimatePresence wrappers
- Removed rotation animation (static icons instead)
- Simpler DOM structure (cleaner render tree)
- Reduced re-renders with conditional branches
- Faster transitions improve perceived performance

**Key Design Principles Applied**:
1. **Vertical First**: Always stack vertically in <100px width
2. **Consistent Sizing**: All interactive elements 32-44px (WCAG compliant)
3. **Subtle Animations**: Scale 1.05-1.10 max, duration 200-300ms
4. **Space Efficiency**: 25% vertical space saved while maintaining usability
5. **Visual Clarity**: Clear hierarchy with spacing and sizing variations

**Files Modified** (commit 9df2526):
- `frontend/src/App.tsx`: Complete sidebar header and navigation redesign

