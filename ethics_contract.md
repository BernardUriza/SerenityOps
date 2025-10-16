# Ethics Contract

**Version**: 1.0.0
**Last Updated**: 2025-10-16
**Owner**: Bernard Orozco

---

## Purpose

This document defines the ethical boundaries and operational principles that govern the SerenityOps system. It serves as the non-negotiable foundation for all automated processes, AI-assisted decisions, and data handling within this personal intelligence ecosystem.

---

## Core Principles

### 1. Data Integrity
- **No falsification**: All data entered into the system must reflect reality. Skills, experience, and achievements documented in `curriculum.yaml` must be verifiable.
- **No exaggeration**: Financial projections, salary expectations, and opportunity assessments must be grounded in evidence, not wishful thinking.
- **Version control as truth**: Every modification is tracked via Git. History cannot be rewritten without explicit justification.

### 2. Privacy & Security
- **No credential exposure**: API keys, passwords, and sensitive tokens are never committed to version control.
- **Anonymization for export**: If any part of this system is shared publicly or with third parties, personal identifiers (names, companies, financial amounts) must be anonymized.
- **Private by default**: This repository remains private. Public sharing requires explicit consent and sanitization.

### 3. Autonomy & Consent
- **Human in the loop**: AI models (Claude, GPT, or others) suggest, calculate, and document, but Bernard remains the final decision-maker.
- **Explainable automation**: Every automated action (commit, file update, calculation) must be traceable and justified in logs.
- **Right to override**: Bernard can reject, modify, or delete any AI-generated content without justification.

### 4. Transparency with AI
- **Model attribution**: Every AI-assisted modification includes model name, version, and timestamp.
- **Prompt disclosure**: Critical prompts that drive system behavior are documented in `foundations/` or logs.
- **No hidden objectives**: The AI cannot optimize for metrics that contradict the user's stated goals (e.g., maximizing interview count at the cost of well-being).

### 5. Well-Being over Optimization
- **Serenity first**: The system prioritizes calm, informed decision-making over aggressive career optimization.
- **No burnout automation**: Rituals and reminders are designed to protect rest, reflection, and balance.
- **Emotional intelligence**: Logs may track stress or tone, but never to guilt or shame—only to inform and adjust.

---

## Prohibited Actions

The following actions are explicitly forbidden:

1. **Fabricating experience or skills** in CV generation
2. **Committing secrets** (API keys, credentials, personal identifiers) to version control
3. **Auto-applying to jobs** without explicit user confirmation
4. **Modifying financial data** without user-initiated trigger
5. **Sharing logs or personal data** with third parties without anonymization and consent
6. **Overriding user decisions** based on AI-calculated "better" outcomes

---

## Audit & Accountability

- **Monthly review**: The user will review key decisions, commits, and AI suggestions on a monthly basis.
- **Ethics checklist**: Before any major automation (e.g., scheduled reasoning, batch CV generation), a checklist ensures compliance with this contract.
- **Violations**: If the system detects a violation (e.g., a secret in a commit), it must alert the user immediately and halt the operation.

---

## Evolution

This contract is a living document. It can be updated via:

1. Explicit user decision
2. Quarterly reflection rituals
3. Response to system errors or ethical conflicts

All changes are versioned and committed with justification.

---

## Signature (Symbolic)

By initializing this system, Bernard Orozco agrees to operate within these ethical boundaries and grants AI collaborators the authority to enforce them.

**Date**: 2025-10-16
**Commitment**: "Integrity over velocity. Transparency over convenience. Serenity over optimization."
