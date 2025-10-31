# SerenityOps E2E Test Suite

## Overview

This directory contains end-to-end (E2E) tests for SerenityOps using Playwright.

## Test Files

- **`chat.spec.ts`** - SO-QA-CHT-003: End-to-End Chat Validation
  - Tests the complete chat flow from creation to persistence
  - Validates conversation persistence across page reloads
  - Ensures no 404 errors during chat operations

## Running Tests

### Prerequisites

1. Ensure the backend API is running on `http://localhost:8000`
2. Ensure you have a valid `ANTHROPIC_API_KEY` in your `.env` file
3. Install Playwright browsers if not already installed:
   ```bash
   npx playwright install
   ```

### Run Commands

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Run with interactive UI mode
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Run in debug mode
pnpm test:e2e:debug

# Run specific test file
pnpm test:e2e chat.spec.ts

# Run specific test
pnpm test:e2e -g "Should create a new conversation"
```

## Test Results

Test results are saved in `/logs/e2e/chat/`:

- **`html-report/`** - Interactive HTML report
- **`results.json`** - Machine-readable test results
- **Screenshots** - Captured on test failures
- **Videos** - Recorded for failed tests
- **Traces** - Playwright traces for debugging

### View HTML Report

```bash
npx playwright show-report ../logs/e2e/chat/html-report
```

## Test Scenarios

### 1. Create New Conversation
- Clicks "New Chat" button
- Verifies API returns valid conversation ID
- Confirms conversation appears in sidebar

### 2. Send Message & Receive AI Response
- Creates conversation
- Sends test message
- Waits for AI response (with 30s timeout)
- Verifies both user and assistant messages appear

### 3. Persist Conversation to YAML
- Creates conversation and sends message
- Waits for file system write
- Verifies YAML file exists in `/logs/conversations/`
- Validates file contents match expected structure

### 4. Reload Page & Verify Persistence
- Creates conversation with test message
- Reloads the page
- Verifies conversation list loads
- Confirms conversation appears in sidebar
- Loads conversation and verifies messages persist

### 5. Complete End-to-End Flow
- Runs all steps sequentially:
  1. Create conversation
  2. Send message
  3. Verify persistence
  4. Reload page
  5. Load conversation
- Comprehensive validation of entire system

### 6. Error Handling: No 404 Errors
- Monitors all network requests during chat operations
- Fails if any `/api/chat/*` endpoint returns 404
- Ensures CHT-001 and CHT-002 bugs remain fixed

## Configuration

Configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:5173`
- **Test directory**: `./tests/e2e`
- **Browser**: Chromium (Desktop Chrome)
- **Parallel**: Enabled (except in CI)
- **Retries**: 2 on CI, 0 locally
- **Timeout**: 30s per test

## Debugging Failed Tests

### 1. View Trace
```bash
npx playwright show-trace path/to/trace.zip
```

### 2. Run in Debug Mode
```bash
pnpm test:e2e:debug
```

### 3. Run in Headed Mode
```bash
pnpm test:e2e:headed
```

### 4. Check Screenshots
Screenshots are saved to `test-results/` on failure.

### 5. Check HTML Report
```bash
npx playwright show-report ../logs/e2e/chat/html-report
```

## CI/CD Integration

Tests can be run in CI by ensuring:

1. Backend is running
2. Frontend dev server is running
3. Environment variables are set
4. Playwright browsers are installed

Example CI command:
```bash
CI=true pnpm test:e2e
```

## Related Issues

- **SO-BUG-CHT-001**: API 404 on Conversation Load ✅ Fixed
- **SO-BUG-CHT-002**: Message Send Fails (404) ✅ Fixed
- **SO-QA-CHT-003**: End-to-End Chat Validation (this test suite)

## Maintenance

- Update test selectors if UI changes
- Add new test scenarios as features are added
- Keep `playwright.config.ts` in sync with environment setup
- Monitor test execution time and optimize if needed

## Resources

- [Playwright Documentation](https://playwright.dev)
- [SerenityOps Chat Architecture](../../docs/chat-architecture.md)
- [Trello Board](https://trello.com/b/tG5MDUE1/serenityops)
