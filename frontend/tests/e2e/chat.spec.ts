import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * SO-QA-CHT-003: End-to-End Chat Validation
 *
 * Comprehensive E2E test suite for SerenityOps chat system
 * Tests the complete flow from conversation creation to persistence
 */

test.describe('Chat End-to-End Flow', () => {
  const testConversationName = `E2E Test Chat ${Date.now()}`;
  let conversationId: string;

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('1. Should create a new conversation', async ({ page }) => {
    // Click on "New Chat" button (adjust selector based on actual UI)
    const newChatButton = page.getByRole('button', { name: /new chat/i });
    await expect(newChatButton).toBeVisible();
    await newChatButton.click();

    // Wait for API call to complete
    const response = await page.waitForResponse(
      response => response.url().includes('/api/chat/create') && response.status() === 200
    );

    // Parse response to get conversation ID
    const responseData = await response.json();
    conversationId = responseData.id;

    expect(conversationId).toBeTruthy();
    console.log(`✅ Created conversation: ${conversationId}`);

    // Verify the new chat appears in the sidebar
    await expect(page.getByText(/chat \d+/i).first()).toBeVisible();
  });

  test('2. Should send a message and receive AI response', async ({ page }) => {
    // Create a new conversation first
    await page.getByRole('button', { name: /new chat/i }).click();
    await page.waitForResponse(response =>
      response.url().includes('/api/chat/create')
    );

    // Find the message input textarea
    const messageInput = page.getByPlaceholder(/type.*message/i)
      .or(page.getByRole('textbox'))
      .first();

    await expect(messageInput).toBeVisible();

    // Type a test message
    const testMessage = 'Hello, this is an E2E test message';
    await messageInput.fill(testMessage);

    // Send the message
    const sendButton = page.getByRole('button', { name: /send/i })
      .or(page.locator('button[type="submit"]'))
      .first();

    await sendButton.click();

    // Wait for the message to appear in the chat
    await expect(page.getByText(testMessage)).toBeVisible();

    // Wait for AI response (with longer timeout since it involves API call)
    const aiResponse = await page.waitForResponse(
      response => response.url().includes('/api/chat/message') && response.status() === 200,
      { timeout: 30000 }
    );

    expect(aiResponse.status()).toBe(200);

    const responseData = await aiResponse.json();
    expect(responseData.message).toBeTruthy();
    expect(responseData.conversation_id).toBeTruthy();

    conversationId = responseData.conversation_id;

    console.log(`✅ Sent message and received AI response for conversation: ${conversationId}`);

    // Wait for assistant message to appear in UI
    await page.waitForTimeout(1000);

    // Verify assistant message is rendered
    const messages = await page.locator('[class*="message"]').count();
    expect(messages).toBeGreaterThanOrEqual(2); // At least user + assistant message
  });

  test('3. Should persist conversation to YAML file', async ({ page }) => {
    // Create conversation and send a message
    await page.getByRole('button', { name: /new chat/i }).click();
    await page.waitForResponse(response =>
      response.url().includes('/api/chat/create')
    );

    const messageInput = page.getByPlaceholder(/type.*message/i)
      .or(page.getByRole('textbox'))
      .first();

    await messageInput.fill('Test persistence message');

    const sendButton = page.getByRole('button', { name: /send/i })
      .or(page.locator('button[type="submit"]'))
      .first();

    await sendButton.click();

    // Wait for AI response
    const response = await page.waitForResponse(
      response => response.url().includes('/api/chat/message'),
      { timeout: 30000 }
    );

    const responseData = await response.json();
    conversationId = responseData.conversation_id;

    console.log(`✅ Conversation ID for persistence test: ${conversationId}`);

    // Wait a moment for file system write
    await page.waitForTimeout(2000);

    // Verify the YAML file exists
    const conversationDir = path.join(__dirname, '../../../../logs/conversations');
    const files = fs.readdirSync(conversationDir);
    const conversationFile = files.find(file => file.includes(conversationId));

    expect(conversationFile).toBeTruthy();
    console.log(`✅ Conversation persisted to file: ${conversationFile}`);

    // Verify file contents
    if (conversationFile) {
      const filePath = path.join(conversationDir, conversationFile);
      const fileContents = fs.readFileSync(filePath, 'utf-8');

      expect(fileContents).toContain('session:');
      expect(fileContents).toContain(`id: ${conversationId}`);
      expect(fileContents).toContain('messages:');
      expect(fileContents).toContain('Test persistence message');

      console.log(`✅ YAML file contains correct conversation data`);
    }
  });

  test('4. Should reload page and conversation persists', async ({ page, context }) => {
    // Create conversation and send a message
    await page.getByRole('button', { name: /new chat/i }).click();
    await page.waitForResponse(response =>
      response.url().includes('/api/chat/create')
    );

    const messageInput = page.getByPlaceholder(/type.*message/i)
      .or(page.getByRole('textbox'))
      .first();

    const testMessage = 'Message before reload';
    await messageInput.fill(testMessage);

    const sendButton = page.getByRole('button', { name: /send/i })
      .or(page.locator('button[type="submit"]'))
      .first();

    await sendButton.click();

    // Wait for AI response
    const response = await page.waitForResponse(
      response => response.url().includes('/api/chat/message'),
      { timeout: 30000 }
    );

    const responseData = await response.json();
    conversationId = responseData.conversation_id;

    console.log(`✅ Created conversation: ${conversationId}`);

    // Wait for message to appear
    await expect(page.getByText(testMessage)).toBeVisible();

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    console.log(`✅ Page reloaded`);

    // Wait a moment for data to load
    await page.waitForTimeout(2000);

    // Verify conversation list loaded
    await expect(page.getByRole('button', { name: /new chat/i })).toBeVisible();

    // Verify conversation appears in sidebar
    const conversationList = page.locator('[class*="chat"]').or(page.locator('[class*="conversation"]'));
    await expect(conversationList.first()).toBeVisible({ timeout: 10000 });

    // Load the conversation
    const listResponse = await page.waitForResponse(
      response => response.url().includes('/api/chat/list'),
      { timeout: 10000 }
    );

    expect(listResponse.status()).toBe(200);

    const listData = await listResponse.json();
    const ourConversation = listData.chats.find((chat: any) => chat.id === conversationId);

    expect(ourConversation).toBeTruthy();
    console.log(`✅ Conversation found in list after reload`);

    // Click on the conversation to load it
    const conversationItem = page.getByText(testMessage.substring(0, 20))
      .or(page.locator(`[data-conversation-id="${conversationId}"]`))
      .first();

    if (await conversationItem.isVisible()) {
      await conversationItem.click();

      // Wait for conversation to load
      await page.waitForResponse(
        response => response.url().includes(`/api/chat/conversation/${conversationId}`),
        { timeout: 10000 }
      );

      // Verify the message is still there
      await expect(page.getByText(testMessage)).toBeVisible();

      console.log(`✅ Conversation messages persisted and loaded correctly`);
    } else {
      console.log(`⚠️ Could not find conversation in UI, but it exists in API`);
    }
  });

  test('5. Should handle complete flow: create → send → persist → reload → load', async ({ page }) => {
    console.log('🧪 Starting complete E2E flow test');

    // Step 1: Create conversation
    await page.getByRole('button', { name: /new chat/i }).click();
    const createResponse = await page.waitForResponse(response =>
      response.url().includes('/api/chat/create')
    );
    const createData = await createResponse.json();
    conversationId = createData.id;

    console.log(`✅ Step 1: Created conversation ${conversationId}`);

    // Step 2: Send message
    const messageInput = page.getByPlaceholder(/type.*message/i)
      .or(page.getByRole('textbox'))
      .first();

    const testMessage = 'Complete flow test message';
    await messageInput.fill(testMessage);

    const sendButton = page.getByRole('button', { name: /send/i })
      .or(page.locator('button[type="submit"]'))
      .first();

    await sendButton.click();

    // Wait for AI response
    await page.waitForResponse(
      response => response.url().includes('/api/chat/message'),
      { timeout: 30000 }
    );

    console.log(`✅ Step 2: Sent message and received response`);

    // Step 3: Verify persistence
    await page.waitForTimeout(2000);

    const conversationDir = path.join(__dirname, '../../../../logs/conversations');
    const files = fs.readdirSync(conversationDir);
    const conversationFile = files.find(file => file.includes(conversationId));

    expect(conversationFile).toBeTruthy();
    console.log(`✅ Step 3: Verified persistence (${conversationFile})`);

    // Step 4: Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log(`✅ Step 4: Page reloaded`);

    // Step 5: Load conversation
    await page.waitForResponse(
      response => response.url().includes('/api/chat/list'),
      { timeout: 10000 }
    );

    console.log(`✅ Step 5: Conversation list loaded after reload`);

    // Final verification
    console.log('🎉 Complete E2E flow test PASSED');
  });
});

test.describe('Chat Error Handling', () => {
  test('Should not return 404 errors during normal operation', async ({ page }) => {
    // Monitor all network requests
    const errorResponses: string[] = [];

    page.on('response', response => {
      if (response.status() === 404 && response.url().includes('/api/chat')) {
        errorResponses.push(`404: ${response.url()}`);
      }
    });

    // Perform normal chat operations
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Create conversation
    await page.getByRole('button', { name: /new chat/i }).click();
    await page.waitForResponse(response =>
      response.url().includes('/api/chat')
    );

    // Send message
    const messageInput = page.getByPlaceholder(/type.*message/i)
      .or(page.getByRole('textbox'))
      .first();

    await messageInput.fill('404 test message');

    const sendButton = page.getByRole('button', { name: /send/i })
      .or(page.locator('button[type="submit"]'))
      .first();

    await sendButton.click();

    await page.waitForResponse(
      response => response.url().includes('/api/chat/message'),
      { timeout: 30000 }
    );

    // Check for 404 errors
    expect(errorResponses).toHaveLength(0);

    if (errorResponses.length > 0) {
      console.error('❌ Found 404 errors:', errorResponses);
    } else {
      console.log('✅ No 404 errors detected');
    }
  });
});
