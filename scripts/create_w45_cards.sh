#!/bin/bash
# Create Sprint W45 Cards with Labels

TRELLO=~/Documents/trello-cli-python/trello
READY_LIST="68fd600c1a886dec034608cd"

echo "🎯 Creating Sprint W45 Cards..."
echo ""

# Card 2: SO-OPP-FIX-001
echo "📝 Creating SO-OPP-FIX-001..."
CARD_ID=$($TRELLO add-card "$READY_LIST" "🧪 SO-OPP-FIX-001: Opportunities Module E2E Testing & Fixes" "**Priority:** P0 - CRITICAL
**Size:** S (3h)
**Area:** Backend + UI
**Sprint:** W45
**Due Date:** 29-oct-2025

## Description
End-to-end testing and bug fixes for Opportunities module to ensure 100% functionality before interview.

## Acceptance Criteria
- [ ] Opportunities list renders correctly
- [ ] Filters by stage function (discovered, applied, interviewing, offer, closed)
- [ ] Filters by priority function (high, medium, low)
- [ ] Detail view shows all information (timeline, contacts, notes, fit analysis)
- [ ] Timeline visualization correct
- [ ] Fit analysis scores display correctly
- [ ] Contacts and notes visible
- [ ] Zero errors in console
- [ ] Responsive on mobile/tablet/desktop

## Technical Notes
- Test with Paylocity data
- Test with 5-7 opportunities dataset
- Fix any bugs encountered
- Performance check with real data
- Document any issues found

## Bugs to Fix
- Status vs Stage mapping (YAML uses 'stage', frontend expects 'status')
- Timeline rendering validation
- Fit analysis percentage calculation

## Dependencies
- SO-OPP-DATA-001 (needs enriched data for testing)

## Blocks
- SO-OPP-FEAT-001 (Analyzer needs working module)

**Sprint W45 - CRITICAL FOR INTERVIEW**" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "orange" "Sprint-W45" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "red" "P0" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "black" "Backend" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "red" "Bug" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-10-29" > /dev/null 2>&1
echo "  ✅ SO-OPP-FIX-001 created with labels"
echo ""

# Card 3: SO-OPP-DATA-002
echo "📝 Creating SO-OPP-DATA-002..."
CARD_ID=$($TRELLO add-card "$READY_LIST" "🗂️ SO-OPP-DATA-002: Create 5-7 Coherent Example Opportunities" "**Priority:** P1
**Size:** XS (2h)
**Area:** Data
**Sprint:** W45
**Due Date:** 30-oct-2025

## Description
Create 5-7 realistic example opportunities to demonstrate full pipeline and enable thorough testing.

## Acceptance Criteria
- [ ] 1-2 discovered (early stage exploration)
- [ ] 1-2 applied (waiting for response)
- [ ] 1-2 interviewing (active, including Paylocity)
- [ ] 0-1 offer (if applicable)
- [ ] 1-2 closed (rejected/declined with learnings)
- [ ] Data is coherent and realistic
- [ ] Variety of companies, roles, and stages
- [ ] Fit analysis scores make sense
- [ ] Timeline dates are realistic
- [ ] Valid YAML syntax

## Technical Notes
- Use real examples (anonymized) if possible
- Or create fictional but credible opportunities
- Maintain consistency in data format
- Follow same structure as Paylocity entry
- Include tech stack, benefits, requirements

## Example Companies (Ideas)
- Remote SaaS companies
- Mexico-based tech companies
- International companies with Mexico offices
- Mix of product and consulting companies

## Dependencies
- SO-OPP-DATA-001 (use as template)

**Sprint W45 - Demo & Testing Data**" | grep "ID:" | awk '{print $2}')

echo "  Adding labels..."
$TRELLO add-label "$CARD_ID" "orange" "Sprint-W45" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "sky" "XS" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Data" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Enhancement" > /dev/null 2>&1
$TRELLO set-due "$CARD_ID" "2025-10-30" > /dev/null 2>&1
echo "  ✅ SO-OPP-DATA-002 created with labels"
echo ""

echo "✅ All Sprint W45 cards created!"
echo ""
echo "📋 Summary:"
echo "  1. SO-OPP-DATA-001: Enrich Paylocity YAML Data (P0, XS, Data)"
echo "  2. SO-OPP-FIX-001: Module E2E Testing & Fixes (P0, S, Backend+UI)"
echo "  3. SO-OPP-FEAT-001: Analyzer Panel (P0, M, Analytics) [Already in Ready]"
echo "  4. SO-OPP-DATA-002: Create Example Opportunities (P1, XS, Data)"
echo ""
echo "🎯 Next: Add labels to SO-OPP-FEAT-001 (already exists in Ready)"
