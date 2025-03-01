import { expect, test } from '@playwright/test';

test.describe('Quiz Management Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the quiz page
    await page.goto('http://localhost:5173/admin/activities/quiz');
    
  
    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });
    
    page.on('console', log => console.log(`Console: ${log.text()}`));
  });
  
  test('should display the quiz page title and description', async ({ page }) => {
    const heading = page.locator('h1.text-3xl');
    const description = page.locator('p.mt-2.text-gray-600');
    
    await expect(heading).toHaveText('Quiz Activities');
    await expect(description).toHaveText('Create and manage your quiz sets');
  });
  
  test('should validate required fields when creating a quiz', async ({ page }) => {
  
    await page.click('button:has-text("Create Quiz")');
    
  
    const errorMessages = page.locator('.text-red-500, .bg-red-50');
    await expect(errorMessages).toBeVisible();
  });
  
  test('should add a new question when clicking "Add Question" button', async ({ page }) => {
    const initialQuestionCount = await page.locator('.p-4.bg-white.rounded-lg.border.border-gray-200').count();
    
    await page.click('button:has-text("Add Question")');
    
    await expect(page.locator('.p-4.bg-white.rounded-lg.border.border-gray-200')).toHaveCount(initialQuestionCount + 1);
    
   
    const newQuestionIndex = initialQuestionCount;
    const questionSelector = `.p-4.bg-white.rounded-lg.border.border-gray-200:nth-child(${newQuestionIndex + 1})`;
    
    await expect(page.locator(`${questionSelector} input[placeholder="Enter your question"]`)).toBeVisible();
    

    for (let i = 1; i <= 4; i++) {
      await expect(page.locator(`${questionSelector} input[placeholder="Option ${i}"]`)).toBeVisible();
    }
    
    await expect(page.locator(`${questionSelector} input[placeholder="Enter correct answer"]`)).toBeVisible();
    await expect(page.locator(`${questionSelector} input[placeholder="Optional explanation"]`)).toBeVisible();
  });
  
  test('should properly display difficulty options', async ({ page }) => {
    const difficultySelect = page.locator('select[name="difficulty"]');
   
    await expect(difficultySelect).toBeVisible();
    

    await expect(difficultySelect.locator('option[value="beginner"]')).toBeVisible();
    await expect(difficultySelect.locator('option[value="intermediate"]')).toBeVisible();
    await expect(difficultySelect.locator('option[value="advanced"]')).toBeVisible();
  });
  
  test('should create a quiz when all required fields are filled', async ({ page }) => {
 
    await page.fill('input[name="title"]', 'Test Quiz');
    await page.fill('textarea[name="description"]', 'This is a test quiz');
    
  
    await page.click('select[name="language"]');
    await page.locator('select[name="language"] option:not([value=""])').first().click();
    

    await page.click('button:has-text("Add Question")');
 
    await page.fill('input[placeholder="Enter your question"]', 'What is 2+2?');
    

    await page.fill('input[placeholder="Option 1"]', '3');
    await page.fill('input[placeholder="Option 2"]', '4');
    await page.fill('input[placeholder="Option 3"]', '5');
    await page.fill('input[placeholder="Option 4"]', '6');
    
 
    await page.fill('input[placeholder="Enter correct answer"]', '4');
    
   
    await page.click('button:has-text("Create Quiz")');

    await expect(page.locator('h2.text-2xl:has-text("Your Quizzes") + div .text-lg:has-text("Test Quiz")')).toBeVisible({
      timeout: 5000 
    });
  });
  
  test('should edit an existing quiz', async ({ page }) => {

    const hasQuizzes = await page.locator('.text-lg').first().isVisible().catch(() => false);
    
    if (!hasQuizzes) {
      // Create a quiz first
      await test.step('Create a quiz to edit', async () => {
        await page.fill('input[name="title"]', 'Quiz to Edit');
        await page.fill('textarea[name="description"]', 'This quiz will be edited');
        
        // Select a language
        await page.click('select[name="language"]');
        await page.locator('select[name="language"] option:not([value=""])').first().click();
        
        // Add a question
        await page.click('button:has-text("Add Question")');
        await page.fill('input[placeholder="Enter your question"]', 'Test question?');
        await page.fill('input[placeholder="Option 1"]', 'Option A');
        await page.fill('input[placeholder="Enter correct answer"]', 'Option A');
        
        // Submit
        await page.click('button:has-text("Create Quiz")');
        
        // Wait for the quiz to appear
        await expect(page.locator('.text-lg:has-text("Quiz to Edit")')).toBeVisible({
          timeout: 5000
        });
      });
    }
    
  
    await page.locator('button:has-text("Edit")').first().click();

    await expect(page.locator('h3:has-text("Edit Quiz")')).toBeVisible();
    
    await page.fill('input[name="title"]', 'Updated Quiz Title');
    
    await page.click('button:has-text("Update Quiz")');
    
    await expect(page.locator('.text-lg:has-text("Updated Quiz Title")')).toBeVisible({
      timeout: 5000
    });
  });
  
  test('should delete a quiz', async ({ page }) => {
    // First, check if we have a quiz to delete
    const hasQuizzes = await page.locator('.text-lg').first().isVisible().catch(() => false);
    
    if (!hasQuizzes) {
   
      await test.step('Create a quiz to delete', async () => {
        await page.fill('input[name="title"]', 'Quiz to Delete');
        await page.fill('textarea[name="description"]', 'This quiz will be deleted');

        await page.click('select[name="language"]');
        await page.locator('select[name="language"] option:not([value=""])').first().click();
        

        await page.click('button:has-text("Add Question")');
        await page.fill('input[placeholder="Enter your question"]', 'Test question?');
        await page.fill('input[placeholder="Option 1"]', 'Option A');
        await page.fill('input[placeholder="Enter correct answer"]', 'Option A');
        
        // Submit
        await page.click('button:has-text("Create Quiz")');
        
        // Wait for the quiz to appear
        await expect(page.locator('.text-lg:has-text("Quiz to Delete")')).toBeVisible({
          timeout: 5000
        });
      });
    }

    const initialQuizCount = await page.locator('.hover\\:shadow-lg').count();
    
    await page.locator('button:has-text("Delete")').first().click();
    
    await expect(page.locator('.hover\\:shadow-lg')).toHaveCount(initialQuizCount - 1, {
      timeout: 5000
    });
  });
});