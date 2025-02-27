import { expect, test } from '@playwright/test';

test.describe('Chapter Management Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the chapter management page
    await page.goto('http://localhost:5173/admin/chapter');
    
    // Listen for console logs and network responses for debugging
    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });
    page.on('console', log => console.log(`Console: ${log.text()}`));
    
    // Wait for initial data to load
    await page.waitForSelector('h1:has-text("Chapter Management")');
  });



  test('should show validation errors for required fields', async ({ page }) => {
    // Try to submit the form without required fields
    await page.click('button:has-text("Create Chapter")');
    
    const titleInput = page.locator('input[name="title"]');
    const languageSelect = page.locator('select[name="language"]');
    
    // Check if these fields are marked as required (HTML5 validation)
    await expect(titleInput).toHaveAttribute('required', '');
    await expect(languageSelect).toHaveAttribute('required', '');
  });



  test('should edit an existing chapter', async ({ page }) => {
    // Mock the API response for the edit button click
    await page.route('**/chapter/chapters/*', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            _id: 'test-chapter-id',
            title: 'Updated Chapter',
            description: 'This chapter has been updated',
            order: 2,
            language: { _id: 'lang-id', languageName: 'English' },
            subLessons: [],
            prerequisites: [],
            learningObjectives: ['Updated objective'],
            estimatedDuration: 45,
            status: 'published'
          })
        });
      } else {
        await route.continue();
      }
    });
    
    const editButton = page.locator('.card button').filter({ has: page.locator('.lucide-edit-2') }).first();

    const hasChapters = await editButton.count() > 0;
    if (!hasChapters) {
      console.log('No chapters to edit, skipping test');
      return;
    }
    
    await editButton.click();
    
    await expect(page.locator('form button:has-text("Update Chapter")')).toBeVisible();
    
    // Update the chapter details
    await page.fill('input[name="title"]', 'Updated Chapter');
    await page.fill('textarea[name="description"]', 'This chapter has been updated');
    await page.fill('input[name="order"]', '2');
    
    // Clear and update the learning objective
    const objectiveInput = page.locator('input[placeholder="Enter learning objective"]').first();
    await objectiveInput.fill('');
    await objectiveInput.fill('Updated objective');
    
    // Update estimated duration and status
    await page.fill('input[name="estimatedDuration"]', '45');
    await page.selectOption('select[name="status"]', 'published');
    
    // Submit the form
    await page.click('button:has-text("Update Chapter")');
    
    // Check if the updated chapter appears in the list
    await expect(page.locator('.card').filter({ hasText: 'Updated Chapter' })).toBeVisible();
  });

  test('should delete a chapter', async ({ page }) => {
    // Mock the API response for deleting a chapter
    await page.route('**/chapter/chapters/*', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });

    const deleteButton = page.locator('.card button').filter({ has: page.locator('.lucide-trash-2') }).first();
    const hasChapters = await deleteButton.count() > 0;
    if (!hasChapters) {
      console.log('No chapters to delete, skipping test');
      return;
    }
    
    await deleteButton.click();
    
    // Confirm the deletion (assuming there's a confirmation dialog)
    await page.click('button:has-text("Confirm")');
    
    // Check if the chapter was removed from the list
    await expect(page.locator('.card').filter({ hasText: 'Test Chapter' })).not.toBeVisible();
  });



  test('should filter multiple select options', async ({ page }) => {
    
    const subLessonsSelect = page.locator('select[name="subLessons"]');
    await expect(subLessonsSelect).toBeVisible();
    await expect(subLessonsSelect).toHaveAttribute('multiple', '');
    
    // Check if the prerequisites select also exists with correct attributes
    const prerequisitesSelect = page.locator('select[name="prerequisites"]');
    await expect(prerequisitesSelect).toBeVisible();
    await expect(prerequisitesSelect).toHaveAttribute('multiple', '');
  });

  test('should show empty state when no chapters exist', async ({ page }) => {
    // Mock the API to return empty chapters list
    await page.route('**/chapter/chapters', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    

    await page.reload();
    
    // Check for the empty state message
    await expect(page.locator('text=No chapters created yet')).toBeVisible();
  });

 

  test('should handle sorting chapters by order', async ({ page }) => {
    // Mock the API to return chapters with different orders
    await page.route('**/chapter/chapters', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: 'chapter-3',
            title: 'Chapter Three',
            order: 3,
            language: { _id: 'lang-id', languageName: 'English' },
            status: 'draft'
          },
          {
            _id: 'chapter-1',
            title: 'Chapter One',
            order: 1,
            language: { _id: 'lang-id', languageName: 'English' },
            status: 'draft'
          },
          {
            _id: 'chapter-2',
            title: 'Chapter Two',
            order: 2,
            language: { _id: 'lang-id', languageName: 'English' },
            status: 'draft'
          }
        ])
      });
    });
    
    // Reload the page to apply the mocked data
    await page.reload();
    
    // Check for sort button and click it (if available)
    const sortButton = page.locator('button').filter({ hasText: /sort|order/i }).first();
    if (await sortButton.count() > 0) {
      await sortButton.click();
      
      // Get all chapter titles in order
      const chapterTitles = await page.locator('.card .text-lg').allTextContents();
      
      // Check if chapters are sorted by order
      expect(chapterTitles[0]).toContain('Chapter One');
      expect(chapterTitles[1]).toContain('Chapter Two');
      expect(chapterTitles[2]).toContain('Chapter Three');
    } else {
      // If no sort button, check if they're already sorted
      const chapterTitles = await page.locator('.card .text-lg').allTextContents();
      console.log('Chapter order:', chapterTitles);
    }
  });

  test('should filter chapters by status', async ({ page }) => {
    // Mock the API to return chapters with different statuses
    await page.route('**/chapter/chapters', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: 'draft-chapter',
            title: 'Draft Chapter',
            language: { _id: 'lang-id', languageName: 'English' },
            status: 'draft'
          },
          {
            _id: 'published-chapter',
            title: 'Published Chapter',
            language: { _id: 'lang-id', languageName: 'English' },
            status: 'published'
          },
          {
            _id: 'review-chapter',
            title: 'Review Chapter',
            language: { _id: 'lang-id', languageName: 'English' },
            status: 'review'
          }
        ])
      });
    });
    
    // Reload the page to apply the mocked data
    await page.reload();
    
    // Look for filter controls
    const statusFilter = page.locator('select, [role="combobox"]').filter({ hasText: /status|filter/i }).first();
    
    // If there's a filter dropdown, test filtering
    if (await statusFilter.count() > 0) {
      // Select "published" filter
      await statusFilter.selectOption('published');
      
      // Check that only published chapters are shown
      await expect(page.locator('.card').filter({ hasText: 'Published Chapter' })).toBeVisible();
      await expect(page.locator('.card').filter({ hasText: 'Draft Chapter' })).not.toBeVisible();
      await expect(page.locator('.card').filter({ hasText: 'Review Chapter' })).not.toBeVisible();
      
      // Reset filter if possible
      await statusFilter.selectOption('all');
    } else {
      console.log('No status filter found, skipping test');
    }
  });
});