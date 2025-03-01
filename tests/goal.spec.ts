import { expect, test } from '@playwright/test';

test.describe('Goal Management Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the goal management page
    await page.goto('http://localhost:5173/admin/goals');
 
    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });
    page.on('console', log => console.log(`Console: ${log.text()}`));
    
    // Wait for initial data to load
    await page.waitForSelector('h1:has-text("Goal Management")');
  });


  test('should show validation errors for required fields', async ({ page }) => {
    await page.locator('textarea[placeholder="Level description"]').fill('');
    await page.click('button:has-text("Create Goal")');
    const goalInput = page.locator('input[name="goal"]');
    const descriptionTextarea = page.locator('textarea[placeholder="Level description"]');

    await expect(goalInput).toHaveAttribute('required', '');
    await expect(descriptionTextarea).toHaveAttribute('required', '');
  });



  test('should show empty state when no goals exist', async ({ page }) => {
    // Mock the API to return empty goals list
    await page.route('**/set-goal/goals', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else {
        await route.continue();
      }
    });
    
    await page.reload();
    await expect(page.locator('text=No goals created yet')).toBeVisible();
  });

  test('should handle API errors when fetching goals', async ({ page }) => {
    // Mock the API to return an error
    await page.route('**/set-goal/goals', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Server error' })
        });
      } else {
        await route.continue();
      }
    });
    
    // Reload the page to trigger the error
    await page.reload();
    
    // Check for error message
    await expect(page.locator('text=Failed to fetch goals')).toBeVisible();
  });

  test('should handle API errors when creating a goal', async ({ page }) => {
    // Mock the API to return an error for goal creation
    await page.route('**/set-goal/goals', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid goal data' })
        });
      } else {
        await route.continue();
      }
    });
    
    // Fill in the form
    await page.fill('input[name="goal"]', 'Error Test Goal');
    await page.locator('textarea').fill('Test description');
    
    // Submit the form
    await page.click('button:has-text("Create Goal")');
    
    // Check for error message
    await expect(page.locator('text=Failed to create goal')).toBeVisible();
  });

  test('should display loading states correctly', async ({ page }) => {
    // Mock the API with a delayed response for fetching goals
    await page.route('**/set-goal/goals', async route => {
      if (route.request().method() === 'GET') {
        // Delay the response to see loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else {
        await route.continue();
      }
    });
    
    // Reload the page to trigger loading state
    await page.reload();
    
    // Check for loading message
    await expect(page.locator('text=Loading goals...')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('text=No goals created yet');
  });

});