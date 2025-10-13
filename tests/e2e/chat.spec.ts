import { test, expect } from '@playwright/test'

// Note: These tests require valid Clerk test credentials
// For CI/CD, you'll need to set up Clerk test mode or use mock auth

test.describe('Chat Application', () => {
  test.skip('should redirect to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/.*sign-in/)
  })

  test.skip('should create a room and send a message', async ({ page }) => {
   
    
    await page.goto('/chat')
    
    // Create room
    await page.fill('input[placeholder*="Room name"]', 'Test Room')
    await page.click('button:has-text("Create Room")')
    
    // Wait for navigation to room
    await expect(page).toHaveURL(/\/chat\/.*/)
    
    // Send message
    await page.fill('input[placeholder*="Type a message"]', 'Hello World!')
    await page.click('button:has-text("Send")')
    
    // Verify message appears
    await expect(page.locator('text=Hello World!')).toBeVisible()
  })

  test.skip('should display typing indicator', async ({ page, context }) => {
    // Test requires multiple users - would need separate sessions
    // This is a placeholder for demonstrating E2E test structure
  })
})