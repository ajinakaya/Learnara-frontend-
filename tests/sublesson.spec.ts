import { expect, test } from '@playwright/test';

test.describe('SubLesson Management Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/admin/Lesson');

    // Listen for any console and network responses for debugging
    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });

    page.on('console', log => console.log(`Console: ${log.text()}`));
  });



  test('should cancel form editing', async ({ page }) => {
    // Fill in some form data
    await page.fill('input[name="title"]', 'Test SubLesson');
    await page.fill('textarea[name="description"]', 'This is a test description');
    
    // Click cancel button
    await page.click('button:has-text("Cancel")');
    
    // Check if form was reset
    await expect(page.locator('input[name="title"]')).toHaveValue('');
    await expect(page.locator('textarea[name="description"]')).toHaveValue('');
  });

});

// Helper function to mock API responses
async function mockApiResponses(page) {
  // Mock languages API
  await page.route('http://localhost:3001/preferred-language/preferredlanguages', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { _id: '1', languageName: 'English' },
        { _id: '2', languageName: 'Spanish' },
        { _id: '3', languageName: 'French' }
      ]),
    });
  });
  
  // Mock video activities API
  await page.route('http://localhost:3001/video/video', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { _id: '1', title: 'Introduction Video' },
        { _id: '2', title: 'Advanced Concepts' }
      ]),
    });
  });
  
  // Mock quiz activities API
  await page.route('http://localhost:3001/quiz/quiz', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { _id: '3', title: 'Basic Quiz' },
        { _id: '4', title: 'Advanced Quiz' }
      ]),
    });
  });
}