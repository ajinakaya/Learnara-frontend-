import { expect, test } from '@playwright/test';

test.describe('Language Management Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/admin/Languages');
   
    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });
    
    page.on('console', log => console.log(`Console: ${log.text()}`));

    // Wait for the page to load completely
    await page.waitForSelector('h1:has-text("Language Management")');
  });

  test('should handle language creation error', async ({ page }) => {
    // Mock API error
    await page.route('/preferred-language/preferredlanguages', async (route) => {
      await route.fulfill({ status: 500 });
    });
    
    // Fill and submit form
    await page.fill('input[type="text"]', 'Error Test Language');
    await page.click('button:has-text("Create Language")');
    
    // Check error message
    await expect(page.locator('text=Failed to create language')).toBeVisible();
  });

 
  test('should handle image upload for new language', async ({ page }) => {
    // Set up a mock file
    await page.route('/preferred-language/preferredlanguages', async (route) => {
      const json = {
        _id: 'test-id-4',
        languageName: 'Image Test Language',
        languageImage: 'uploads/test-image.png'
      };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) });
    });
    
    // Create a fake file input event
    const fileName = 'test-image.png';
    const fileInput = page.locator('input[type="file"]');
    
    // Set file input value
    await fileInput.setInputFiles({
      name: fileName,
      mimeType: 'image/png',
      buffer: Buffer.from('fake image content')
    });
    
    // Fill language name
    await page.fill('input[type="text"]', 'Image Test Language');
    
    // Submit the form
    await page.click('button:has-text("Create Language")');
    
    // Check if the new language with image appears
    await expect(page.locator('text=Image Test Language')).toBeVisible();
  });
});