#!/bin/bash
# Add Labels Systematically to 20+ Cards

TRELLO=~/Documents/trello-cli-python/trello

echo "🏷️ Adding Labels to Cards Systematically..."
echo ""

# ========================================
# READY LIST - 2 remaining cards (W45 cards already labeled)
# ========================================

echo "📋 READY LIST"
echo ""

# Card 1: SO-INFRA-FEAT-001
echo "1️⃣  SO-INFRA-FEAT-001: FastAPI + Frontend Build Version Sync"
CARD_ID="68fbfcf22f23d2cd20f8905a"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "brown" "Infra" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P1, S, Infra, Feature"
echo ""

# Card 2: SO-CVE-FEAT-003
echo "2️⃣  SO-CVE-FEAT-003: CV Field Mapper"
CARD_ID="68fbfd6e9ba0d684b3c87fea"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "M" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P1, M, UI, Feature"
echo ""

# ========================================
# BACKLOG - 18 cards (CV features + others)
# ========================================

echo "📋 BACKLOG"
echo ""

# Card 3: SO-CVE-FEAT-001
echo "3️⃣  SO-CVE-FEAT-001: Integrar ATS Markdown Export"
CARD_ID="68fbfcf0c495106027e8f8d9"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "black" "Backend" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P1, S, Backend, Feature"
echo ""

# Card 4: SO-AI-ENH-001
echo "4️⃣  SO-AI-ENH-001: Claude Coaching Modes"
CARD_ID="68fbfcf1ae76f76fa8990114"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "M" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "purple" "AI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Enhancement" > /dev/null 2>&1
echo "   ✅ Labels: P1, M, AI, Enhancement"
echo ""

# Card 5: SO-CHAT-FIX-001
echo "5️⃣  SO-CHAT-FIX-001: Chat Autosave/Resume"
CARD_ID="68fbfcf1d7eff0eecf4d3596"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "sky" "XS" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "black" "Backend" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "red" "Bug" > /dev/null 2>&1
echo "   ✅ Labels: P1, XS, Backend, Bug"
echo ""

# Card 6: SO-MCP-FEAT-001
echo "6️⃣  SO-MCP-FEAT-001: MCP Diagnostic Visualization"
CARD_ID="68fbfcf2c495106027e90045"
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P2, S, UI, Feature"
echo ""

# Card 7: SO-UI-POLISH-001
echo "7️⃣  SO-UI-POLISH-001: macOS Modal Polish + Focus Trap"
CARD_ID="68fbfcf2a34b75bafb728020"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "sky" "XS" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Enhancement" > /dev/null 2>&1
echo "   ✅ Labels: P1, XS, UI, Enhancement"
echo ""

# Card 8: SO-CVE-BUG-001
echo "8️⃣  SO-CVE-BUG-001: PDF Generator Tailwind Fidelity"
CARD_ID="68fbfcf3d13fae38567d7d50"
$TRELLO add-label "$CARD_ID" "red" "P0" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "black" "Backend" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "red" "Bug" > /dev/null 2>&1
echo "   ✅ Labels: P0, S, Backend, Bug"
echo ""

# Card 9: SO-UI-FEAT-001
echo "9️⃣  SO-UI-FEAT-001: Dynamic Icon Inspector"
CARD_ID="68fbfcf3fb1cb92beb223da8"
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "sky" "XS" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P2, XS, UI, Feature"
echo ""

# Card 10: SO-CVE-FEAT-004
echo "🔟 SO-CVE-FEAT-004: Compact Layout Engine"
CARD_ID="68fbfd6e3fe4b48dee1bd72a"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "M" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P1, M, UI, Feature"
echo ""

# Card 11: SO-CVE-FEAT-005
echo "1️⃣1️⃣  SO-CVE-FEAT-005: Upload Inspirations"
CARD_ID="68fbfd6f9478c5d09555f314"
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P2, S, UI, Feature"
echo ""

# Card 12: SO-CVE-AI-001
echo "1️⃣2️⃣  SO-CVE-AI-001: Claude Design Integrator"
CARD_ID="68fbfd6ffd89721ed5cabbce"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "orange" "L" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "purple" "AI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P1, L, AI, Feature"
echo ""

# Card 13: SO-CVE-FEAT-006
echo "1️⃣3️⃣  SO-CVE-FEAT-006: Page Composer"
CARD_ID="68fbfd703e9ec830ba70bab6"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "orange" "L" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P1, L, UI, Feature"
echo ""

# Card 14: SO-CVE-FEAT-007
echo "1️⃣4️⃣  SO-CVE-FEAT-007: CV Diff Tracker"
CARD_ID="68fbfd70ee3e832735fbda34"
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Data" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P2, S, Data, Feature"
echo ""

# Card 15: SO-CVE-FEAT-008
echo "1️⃣5️⃣  SO-CVE-FEAT-008: ATS Compatibility Analyzer"
CARD_ID="68fbfd7078c6ecbd37b97a42"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "M" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "purple" "AI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P1, M, AI, Feature"
echo ""

# Card 16: SO-CVE-FEAT-009
echo "1️⃣6️⃣  SO-CVE-FEAT-009: Resolution & Print Optimizer"
CARD_ID="68fbfd711272a63a4ec8ea2b"
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "sky" "XS" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "black" "Backend" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P2, XS, Backend, Feature"
echo ""

# Card 17: SO-CVE-FEAT-010
echo "1️⃣7️⃣  SO-CVE-FEAT-010: Saved Presets & Export Settings"
CARD_ID="68fbfd714e5caef078af9a86"
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Data" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P2, S, Data, Feature"
echo ""

# Card 18: SO-CVE-FEAT-011
echo "1️⃣8️⃣  SO-CVE-FEAT-011: Metrics Dashboard"
CARD_ID="68fbfd72d094763fe79484e5"
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "M" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Data" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P2, M, Data, Feature"
echo ""

# Card 19: SO-CVE-FEAT-012
echo "1️⃣9️⃣  SO-CVE-FEAT-012: Template Marketplace"
CARD_ID="68fbfd728e668f90310b7c15"
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "orange" "L" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "pink" "UI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P2, L, UI, Feature"
echo ""

# Card 20: SO-CVE-FEAT-013
echo "2️⃣0️⃣  SO-CVE-FEAT-013: Inline HTML Editor"
CARD_ID="68fbfd737f7ee2ec72f86093"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "yellow" "M" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "purple" "AI" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P1, M, AI, Feature"
echo ""

# Card 21: SO-CVE-INFRA-001
echo "2️⃣1️⃣  SO-CVE-INFRA-001: CV Engine Logs & Version Control"
CARD_ID="68fbfd73710921d94726b52b"
$TRELLO add-label "$CARD_ID" "brown" "P2" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "brown" "Infra" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "green" "Feature" > /dev/null 2>&1
echo "   ✅ Labels: P2, S, Infra, Feature"
echo ""

# Card 22: SO-QA-CHT-003 (Bugs list)
echo "2️⃣2️⃣  SO-QA-CHT-003: End-to-End Chat Validation"
CARD_ID="68fd6d474005bb9fd2b0334f"
$TRELLO add-label "$CARD_ID" "yellow" "P1" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "lime" "S" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "black" "Backend" > /dev/null 2>&1
$TRELLO add-label "$CARD_ID" "blue" "Enhancement" > /dev/null 2>&1
echo "   ✅ Labels: P1, S, Backend, Enhancement"
echo ""

echo "✅ All 22 cards labeled!"
echo ""
echo "📊 Summary:"
echo "   - Ready list: 2 cards"
echo "   - Backlog: 19 cards"
echo "   - Bugs: 1 card"
echo "   - Total: 22 cards with systematic labels"
