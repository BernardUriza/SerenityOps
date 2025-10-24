# SerenityOps Quick Start Guide

**Get up and running in 5 minutes**

---

## Prerequisites

- Python 3.11 or higher
- Git
- Terminal/Command Prompt

---

## Step 1: Verify Installation

Clone the repository (if not already done):

```bash
git clone https://github.com/bernardorozco/serenityops.git
cd serenityops
```

---

## Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

**Note**: For full PDF generation support (not required for MVP), you'll need WeasyPrint system dependencies. See `requirements.txt` for details.

---

## Step 3: Validate System Integrity

Run the validation script to ensure all files are intact:

```bash
python scripts/validate.py
```

You should see:

```
[PASS] Directory Structure
[PASS] Required Files
[PASS] YAML: foundations/axioms.yaml
[PASS] YAML: finances/structure.yaml
[PASS] YAML: opportunities/structure.yaml
[PASS] YAML: curriculum/curriculum.yaml
[PASS] Python: scripts/cv_builder.py
[PASS] CV Builder Execution

[VALIDATION PASSED] System integrity verified.
```

---

## Step 4: Generate Your First CV

Run the CV builder:

```bash
python scripts/cv_builder.py
```

Output:

```
[OK] CV generated successfully: curriculum\versions\cv_technical_2025-10-16.md
```

View the generated CV:

```bash
cat curriculum/versions/cv_technical_2025-10-16.md
```

---

## Step 5: Customize Your Data

### Update Personal Information

Edit `curriculum/curriculum.yaml`:

```yaml
personal:
  full_name: "Your Name"
  title: "Your Title"
  location: "Your City"
  contact:
    email: "your.email@example.com"
    linkedin: "https://linkedin.com/in/yourprofile"
    github: "https://github.com/yourusername"
```

### Add Your Experience

```yaml
experience:
  - company: "Your Company"
    role: "Your Role"
    location: "Location"
    start_date: "2023-01"
    end_date: null  # null means current
    current: true
    description: |
      Brief description of your role.
    achievements:
      - "Achievement 1"
      - "Achievement 2"
    tech_stack:
      - "Technology 1"
      - "Technology 2"
```

### Regenerate CV

```bash
python scripts/cv_builder.py
```

---

## Step 6: Explore Other Variants

Generate executive variant:

```bash
python scripts/cv_builder.py --variant executive
```

Generate with custom filename:

```bash
python scripts/cv_builder.py --output my_custom_cv.md
```

---

## Next Steps

### Track Financial Goals

Edit `finances/structure.yaml`:

```yaml
current_state:
  monthly_income:
    current: 15000  # Your current income
    target: 20000   # Your target
```

### Add Job Opportunities

Edit `opportunities/structure.yaml`:

```yaml
pipeline:
  - id: "company-role-001"
    company: "Target Company"
    role: "Backend Engineer"
    stage: "applied"  # discovered | applied | interviewing | offer
    priority: "high"
    salary_range: "20000-25000 MXN/month"
```

### Review Ethics Contract

Read and acknowledge `ethics_contract.md`:

```bash
cat ethics_contract.md
```

This defines the ethical boundaries governing all automated actions.

### Explore Core Principles

```bash
cat foundations/axioms.yaml
```

These are the philosophical foundations of SerenityOps.

---

## Common Commands

| Command | Description |
|---------|-------------|
| `python scripts/validate.py` | Validate system integrity |
| `python scripts/cv_builder.py` | Generate default CV |
| `python scripts/cv_builder.py --variant executive` | Generate executive CV |
| `python scripts/cv_builder.py --help` | Show all options |

---

## Troubleshooting

### "Module not found" error

```bash
pip install -r requirements.txt
```

### "File not found: curriculum.yaml"

Ensure you're running commands from the root `serenityops/` directory.

### YAML syntax errors

Run validation to identify issues:

```bash
python scripts/validate.py --verbose
```

---

## What's Functional (MVP)

- [x] YAML data structures for curriculum, finances, opportunities
- [x] CV generation to Markdown format
- [x] System integrity validation
- [x] Ethics contract and axioms framework
- [x] Git version control with semantic commits

## What's Coming Next

- [ ] PDF generation (WeasyPrint/LaTeX)
- [ ] CV tailoring to specific opportunities
- [ ] Financial metrics calculation (`scripts/metrics.py`)
- [ ] Periodic reasoning engine (`scripts/reason.py`)
- [ ] Claude API integration for AI-assisted features
- [ ] Conversational log structure
- [ ] Automated rituals (weekly/monthly/quarterly)

---

## Getting Help

- Review `README.md` for comprehensive documentation
- Check `ethics_contract.md` for governance principles
- Read `foundations/axioms.yaml` for philosophical foundation
- Run `python scripts/cv_builder.py --help` for CLI options

---

## Pro Tips

1. **Version Control Everything**: Commit after every significant change
2. **Validate Before Committing**: Run `python scripts/validate.py`
3. **Keep Data Real**: The system works best with accurate, non-aspirational data
4. **Review Regularly**: Weekly check-ins maintain system health
5. **Iterate Gradually**: Start with core data, expand over time

---

**Welcome to structured career intelligence. Start calm, stay traceable.**
