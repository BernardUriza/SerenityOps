# 📊 Opportunities Module - Gap Analysis for W45

**Analysis Date:** 27 oct 2025
**Purpose:** Identify gaps/bugs before Sprint W45 (Paylocity interview prep)
**Critical Deadline:** 30-oct PM (entrevista)

---

## ✅ What's Already Built (GOOD NEWS)

### Frontend Components (8 components)
✅ `OpportunitiesList.tsx` - List view with filtering
✅ `OpportunityCard.tsx` - Individual card display
✅ `AnalyzerPanel.tsx` - Analytics dashboard
✅ `ComparisonPanel.tsx` - Side-by-side comparison
✅ `PitchReader.tsx` - Elevator pitch management
✅ `FeedbackHistory.tsx` - Claude feedback tracking
✅ `PreparationPanel.tsx` - Interview prep materials
✅ `RiskAdviser.tsx` - Risk analysis & recommendations

### Service Layer
✅ `opportunitiesService.ts` - Complete API client with:
- CRUD operations
- Claude AI integration
- YAML → TypeScript mapping
- Fit analysis calculation
- Interview materials fetch

### Backend Endpoints (4 endpoints in main.py)
✅ `GET /api/opportunities` - List all opportunities
✅ `GET /api/opportunities/{id}` - Get single opportunity
✅ `GET /api/opportunities/pitch/{company}` - Fetch elevator pitch
✅ `GET /api/opportunities/{id}/feedback` - Get feedback history

### Data Structure
✅ `opportunities/structure.yaml` - YAML file with:
- Paylocity entry (partial data)
- Toka entry (declined, complete)
- Metadata & goals

---

## 🐛 Identified Gaps & Bugs

### CRITICAL (P0) - Must Fix for Interview

#### 1. Backend: Missing CRUD Endpoints
**Problem:** Frontend expects POST/PUT/DELETE but backend only has GET
**Impact:** Can't create/update/delete opportunities from UI
**Fix Required:**
- `POST /api/opportunities` - Create new opportunity
- `PUT /api/opportunities/{id}` - Update opportunity
- `DELETE /api/opportunities/{id}` - Delete opportunity

**Estimated:** 1-2h

#### 2. Backend: Missing Claude AI Endpoints
**Problem:** Frontend calls AI endpoints that don't exist
**Impact:** Analyzer, Pitch Improver, Mock Interview won't work
**Missing:**
- `POST /api/opportunities/analyze` - Analyze job description
- `POST /api/opportunities/{id}/pitch/improve` - Improve pitch
- `POST /api/opportunities/{id}/mock-interview` - Generate mock interview
- `POST /api/opportunities/compare` - Compare opportunities
- `POST /api/opportunities/career-strategy` - Generate career strategy

**Estimated:** 3-4h (but NOT critical for interview prep)

#### 3. Data: Paylocity Entry Incomplete
**Problem:** Missing critical interview prep data
**Impact:** Can't properly prepare for interview
**Missing:**
- Exact interview date/time
- Recruiter contact name
- More detailed notes from prep docs
- Preparation materials links validation

**Estimated:** 30min-1h (SO-OPP-DATA-001)

#### 4. Data Mapping Bug: Status vs Stage
**Problem:** YAML uses "stage" but service maps to "status"
**Impact:** Filter by status might not work correctly
**Fix:** Verify mapping in `mapYamlToOpportunity()`

**Estimated:** 15min

---

### HIGH (P1) - Important for Full Functionality

#### 5. Timeline Visualization Missing
**Problem:** OpportunityCard expects timeline but may not render correctly
**Impact:** Can't see interview progression visually
**Fix:** Test timeline rendering with Paylocity data

**Estimated:** 30min testing

#### 6. Fit Analysis Display
**Problem:** Not sure if fit_analysis scores display correctly
**Impact:** Can't see match percentages
**Fix:** Test with real data and verify UI

**Estimated:** 30min testing

#### 7. Analyzer Panel Not Implemented
**Problem:** AnalyzerPanel component exists but may not have data
**Impact:** No pipeline metrics or conversion funnel
**Fix:** SO-OPP-FEAT-001 (Analyzer Panel implementation)

**Estimated:** 5h

---

### MEDIUM (P2) - Nice to Have

#### 8. Example Opportunities Missing
**Problem:** Only 2 opportunities (1 active, 1 closed)
**Impact:** Can't demo/test with realistic pipeline
**Fix:** SO-OPP-DATA-002 (Create 5-7 examples)

**Estimated:** 2h

#### 9. Responsive Design Untested
**Problem:** May not work well on mobile/tablet
**Impact:** Can't review on phone before interview
**Fix:** Test responsive layouts

**Estimated:** 1h

---

## 📋 Sprint W45 Card Breakdown

### Card 1: SO-OPP-DATA-001 - Enrich Paylocity YAML (2h)
**Fixes:**
- Gap #3: Complete Paylocity data
- Gap #4: Verify status/stage mapping

**Deliverables:**
- Timeline with exact dates
- Recruiter contact info
- Enriched notes
- Validated fit_analysis scores

---

### Card 2: SO-OPP-FIX-001 - Module E2E Testing & Fixes (3h)
**Fixes:**
- Gap #1: Implement missing CRUD endpoints (if time)
- Gap #4: Fix status/stage mapping
- Gap #5: Test timeline visualization
- Gap #6: Test fit analysis display
- Gap #9: Test responsive design

**Deliverables:**
- Working list/filter/detail views
- Zero console errors
- Responsive validation
- Bug fixes documented

---

### Card 3: SO-OPP-FEAT-001 - Analyzer Panel (5h)
**Fixes:**
- Gap #7: Implement Analyzer Panel

**Deliverables:**
- Pipeline metrics (discovered, applied, interviewing, offer, closed)
- Conversion funnel visualization
- Stage-by-stage analytics
- Date range filtering
- Export to CSV/JSON

---

### Card 4: SO-OPP-DATA-002 - Create 5-7 Examples (2h)
**Fixes:**
- Gap #8: Add example opportunities

**Deliverables:**
- 1-2 discovered
- 1-2 applied
- 1-2 interviewing (including Paylocity)
- 0-1 offer
- 1-2 closed with learnings

---

## ⚠️ Risks & Mitigation

### Risk 1: Backend CRUD Endpoints Not Implemented
**Probability:** High (80%)
**Impact:** Medium (can view data but not edit)
**Mitigation:**
- Manual YAML editing for now
- Implement POST/PUT/DELETE in future sprint
- Focus on READ operations for interview prep

### Risk 2: Claude AI Endpoints Missing
**Probability:** High (100%)
**Impact:** Low (not critical for interview)
**Mitigation:**
- Mock data for Analyzer Panel
- Skip AI features for now
- Implement in W46+

### Risk 3: Timeline Too Tight (70h)
**Probability:** Medium (40%)
**Impact:** High
**Mitigation:**
- Conservative scope (4 cards, 12h)
- Priority on Paylocity data over examples
- Testing > Polish

---

## ✅ Success Criteria for W45

**MUST HAVE (P0):**
1. ✅ Paylocity data complete and accurate
2. ✅ Opportunities list renders without errors
3. ✅ Can view Paylocity details (timeline, fit, notes)
4. ✅ Analyzer Panel shows basic metrics

**SHOULD HAVE (P1):**
5. ✅ 5-7 example opportunities
6. ✅ Filters work correctly (stage, priority)
7. ✅ Timeline visualization working

**NICE TO HAVE (P2):**
8. Responsive on mobile
9. Export functionality
10. AI features (defer to W46)

---

## 📊 Estimated Effort Breakdown

| Task | Estimate | Priority | Sprint Card |
|------|----------|----------|-------------|
| Enrich Paylocity data | 1-2h | P0 | SO-OPP-DATA-001 |
| Fix status/stage mapping | 15min | P0 | SO-OPP-FIX-001 |
| Test timeline visualization | 30min | P1 | SO-OPP-FIX-001 |
| Test fit analysis display | 30min | P1 | SO-OPP-FIX-001 |
| Test responsive design | 1h | P2 | SO-OPP-FIX-001 |
| Implement Analyzer Panel | 5h | P0 | SO-OPP-FEAT-001 |
| Create 5-7 examples | 2h | P1 | SO-OPP-DATA-002 |
| **TOTAL** | **10.5-11.5h** | | **12h planned** |

**Velocity Factor:** 0.70
**Effective Hours:** 12h × 0.70 = 8.4h
**Fits within estimate:** ✅ YES

---

## 🎯 Recommendation

**PROCEED WITH W45 AS PLANNED**

Rationale:
- Gaps are manageable
- Most critical issues are data-related (quick fixes)
- Frontend components already exist
- Backend has basic READ operations
- Can defer CRUD/AI to W46
- Scope is conservative for 3-day sprint

**Focus Areas:**
1. Day 1: Enrich Paylocity data + test current functionality
2. Day 2: Fix bugs + implement Analyzer Panel (MVP)
3. Day 3: Add examples + final polish

**Defer to W46:**
- POST/PUT/DELETE endpoints
- Claude AI integrations
- Advanced analytics
- Export functionality (full implementation)

---

**Next Steps:**
1. ✅ Create labels system for Trello
2. ✅ Fix malformed cards
3. ✅ Create 4 W45 cards with labels
4. 🚀 Start Day 1 execution (28-oct)

**Last Updated:** 27-oct-2025
