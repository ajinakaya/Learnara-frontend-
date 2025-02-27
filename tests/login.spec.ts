import { expect, test } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/auth/login');

    // Listen for any console and network responses for debugging
    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });

    page.on('console', log => console.log(`Console: ${log.text()}`));
  });

 


  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator('button[type="button"]');

    await page.fill('input[name="password"]', 'TestPassword123');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Toggle password visibility
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle password visibility back
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show validation error for missing email', async ({ page }) => {
    await page.fill('input[name="password"]', 'SomePassword');
    await page.click('button[type="submit"]');

    const emailErrorMessage = page.locator('p.text-red-500');
    await emailErrorMessage.waitFor();
    await expect(emailErrorMessage).toHaveText('Email is required');
  });



  test('should show validation error for missing password', async ({ page }) => {
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.click('button[type="submit"]');

    const passwordErrorMessage = page.locator('p.text-red-500');
    await passwordErrorMessage.waitFor();
    await expect(passwordErrorMessage).toHaveText('Password is required');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=Sign up');
    await page.waitForURL('http://localhost:5173/register');
    await expect(page).toHaveURL('http://localhost:5173/register');
  });

  
});
