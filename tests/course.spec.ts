import { expect, test } from '@playwright/test';

test.describe('Course Management Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/admin/courses');

    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });

    page.on('console', log => console.log(`Console: ${log.text()}`));
  });

  test('should display course management interface', async ({ page }) => {
    const heading = page.locator('h1:has-text("Course Management")');
    await expect(heading).toBeVisible();
    
    const courseForm = page.locator('form');
    await expect(courseForm).toBeVisible();
  });



  test('should be able to add and remove tags', async ({ page }) => {
    // Add a tag
    await page.fill('input[placeholder="Add a tag"]', 'TestTag');
    await page.click('button:has-text("Add")');
    
    // Verify tag was added
    const tag = page.locator('.bg-blue-100:has-text("TestTag")');
    await expect(tag).toBeVisible();
    
    // Remove the tag
    await tag.locator('button').click();
    
    // Verify tag was removed
    await expect(tag).toBeHidden();
  });

  test('should toggle premium course options', async ({ page }) => {
    // Check the premium checkbox
    const premiumCheckbox = page.locator('input[name="premium"]');
    await premiumCheckbox.check();
    
    // Verify price inputs appear
    const priceInput = page.locator('input[name="price.amount"]');
    await expect(priceInput).toBeVisible();
    
    // Uncheck the premium checkbox
    await premiumCheckbox.uncheck();
    
    // Verify price inputs disappear
    await expect(priceInput).toBeHidden();
  });

  test('should be able to select multiple levels', async ({ page }) => {
    // By default, A1 should be selected (according to initial state)
    const a1Checkbox = page.locator('input[type="checkbox"]').nth(0);
    await expect(a1Checkbox).toBeChecked();
    
    // Select A2 level
    const a2Checkbox = page.locator('input[type="checkbox"]').nth(1);
    await a2Checkbox.check();
    
    // Verify both A1 and A2 are selected
    await expect(a1Checkbox).toBeChecked();
    await expect(a2Checkbox).toBeChecked();
    
    // Unselect A1
    await a1Checkbox.uncheck();
    
    // Verify only A2 is selected
    await expect(a1Checkbox).not.toBeChecked();
    await expect(a2Checkbox).toBeChecked();
  });


  test('should handle network errors gracefully', async ({ page, context }) => {
    // Mock a network failure for the course creation API
    await context.route('**/course/course', route => {
      route.abort();
    });
    
    // Fill out the form and try to submit
    await page.fill('input[name="title"]', 'Network Test Course');
    await page.selectOption('select[name="language"]', { index: 1 });
    await page.fill('textarea[name="description"]', 'Test description');
    await page.click('button[type="submit"]:has-text("Create Course")');
    
    // Check that an error message is displayed
    const errorMessage = page.locator('.bg-red-50');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Failed to create course');
  });
});