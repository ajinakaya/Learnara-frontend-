import { expect, test } from '@playwright/test';

test.describe('Audio Activity Management Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the audio activity management page
    await page.goto('http://localhost:5173/admin/activities/audio');
    
    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });
    page.on('console', log => console.log(`Console: ${log.text()}`));
    await page.waitForSelector('h1:has-text("Audio Activities")');
  });

  test('should display the audio activities page', async ({ page }) => {
    // Check page title and description
    await expect(page.locator('h1:has-text("Audio Activities")')).toBeVisible();
    await expect(page.locator('p:has-text("Create and manage your audio lessons")')).toBeVisible();
    
    // Check form is visible
    await expect(page.locator('form')).toBeVisible();
  });

  test('should validate form fields', async ({ page }) => {
    // Try to submit the form without required fields
    await page.click('button:has-text("Create Activity")');
    
    // Check if these fields are marked as required (HTML5 validation)
    await expect(page.locator('input[type="text"]').first()).toHaveAttribute('required', '');
    await expect(page.locator('textarea').first()).toHaveAttribute('required', '');
    await expect(page.locator('select').filter({ hasText: 'Select a language' })).toHaveAttribute('required', '');
  });


  test('should edit an existing audio activity', async ({ page }) => {
    // Mock the API response for the edit button click
    await page.route('**/audio/audio/*', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            _id: 'test-audio-id',
            title: 'Updated Audio Lesson',
            description: 'This audio has been updated',
            language: { _id: 'lang-id', languageName: 'Spanish' },
            difficulty: 'advanced',
            duration: 10,
            order: 2,
            audio: 'uploads/audio/test-audio.mp3',
            transcript: 'Updated transcript',
            completionCriteria: { listenPercentage: 95 },
            resources: []
          })
        });
      } else {
        await route.continue();
      }
    });
    
    const editButton = page.locator('.card button').filter({ has: page.locator('.lucide-edit-2') }).first();

    const hasActivities = await editButton.count() > 0;
    if (!hasActivities) {
      console.log('No audio activities to edit, skipping test');
      return;
    }
    
    await editButton.click();
    
    await expect(page.locator('form button:has-text("Update Activity")')).toBeVisible();
    
    // Update the activity details
    await page.fill('input[type="text"]', 'Updated Audio Lesson');
    await page.fill('textarea:first-of-type', 'This audio has been updated');
    await page.fill('input[name="order"], input[type="number"]:near(:text("Order"))', '2');
    
    // Update difficulty
    await page.selectOption('select:has-text("Beginner"), select:has-text("Intermediate"), select:has-text("Advanced")', 'advanced');
    
    // Update duration
    await page.fill('input[type="number"]:near(:text("Duration"))', '10');
    
    // Update completion criteria
    await page.fill('input[type="number"]:near(:text("Required Listen Percentage"))', '95');
    
    // Update transcript
    await page.fill('textarea:near(:text("Transcript"))', 'Updated transcript');
    
    // Submit the form
    await page.click('button:has-text("Update Activity")');
    
    // Check if the updated activity appears in the list
    await expect(page.locator('.card').filter({ hasText: 'Updated Audio Lesson' })).toBeVisible();
  });

  test('should delete an audio activity', async ({ page }) => {
    // Mock the API response for deleting an activity
    await page.route('**/audio/audio/*', async route => {
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
    const hasActivities = await deleteButton.count() > 0;
    if (!hasActivities) {
      console.log('No audio activities to delete, skipping test');
      return;
    }
    
    await deleteButton.click();

  });

  test('should show empty state when no audio activities exist', async ({ page }) => {
    // Mock the API to return empty activities list
    await page.route('**/audio/audio', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.reload();
    
    // Check for the empty state message
    await expect(page.locator('text=No audio activities created yet')).toBeVisible();
  });



  

  
  });
