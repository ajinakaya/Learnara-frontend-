import { test, expect } from '@playwright/test';

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/register'); 
  });

  test('should display validation errors for empty fields', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.click('button[type="submit"]');

    // Ensure validation messages are shown correctly
    await expect(page.getByText('Email is required', { exact: true })).toBeVisible();
    await expect(page.getByText('Username is required', { exact: true })).toBeVisible();
    await expect(page.getByText('Password is required', { exact: true })).toBeVisible();
    await expect(page.getByText('Confirm Password is required', { exact: true })).toBeVisible();
  });

  

  test('should display error when passwords do not match', async ({ page }) => {
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmpassword"]', 'Password1234');

    await page.click('button[type="submit"]'); 

    // Check for password mismatch error message
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });


  
});
