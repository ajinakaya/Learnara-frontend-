import { expect, test } from '@playwright/test';

test.describe('Flashcard Management Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the flashcard page (adjust URL as needed)
    await page.goto('http://localhost:5173/admin/activities/flashcard');

    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });

    page.on('console', log => console.log(`Console: ${log.text()}`));
  });

  test('should display the flashcard page title and description', async ({ page }) => {
    const heading = page.locator('h1.text-3xl');
    const description = page.locator('p.mt-2.text-gray-600');

    await expect(heading).toHaveText('Flashcard Activities');
    await expect(description).toHaveText('Create and manage your flashcard study sets');
  });



  test('should validate required fields when creating a flashcard set', async ({ page }) => {
    
    await page.click('button:has-text("Create Flashcard Set")');
    const errorMessages = page.locator('.text-red-500');
    await expect(errorMessages).toBeVisible();
  });

  test('should add a new flashcard when clicking "Add Card" button', async ({ page }) => {
    const initialCardCount = await page.locator('.p-4.bg-white.rounded-lg.border.border-gray-200').count();

    await page.click('button:has-text("Add Card")');

    // Check that a new card form was added
    await expect(page.locator('.p-4.bg-white.rounded-lg.border.border-gray-200')).toHaveCount(initialCardCount + 1);
    
    // Verify the new card has input fields
    const newCardIndex = initialCardCount;
    await expect(page.locator(`input[name="front"]`).nth(newCardIndex)).toBeVisible();
    await expect(page.locator(`input[name="back"]`).nth(newCardIndex)).toBeVisible();
    await expect(page.locator(`input[name="hint"]`).nth(newCardIndex)).toBeVisible();
    await expect(page.locator(`input[name="example"]`).nth(newCardIndex)).toBeVisible();
  });



 
});