import { test, expect } from '@playwright/test';

test.describe('HandDrawnTimer e2e', () => {
  test('basic timer flow (start, pause, resume, reset)', async ({ page }) => {
    await page.goto('/');

    // Check default input values
    const inputs = await page.locator('input[type="text"]').all();
    expect(inputs).toHaveLength(3);
    await expect(inputs[0]).toHaveValue('00');
    await expect(inputs[1]).toHaveValue('08');
    await expect(inputs[2]).toHaveValue('12');

    // Change value to 00:00:03
    await inputs[0].fill('00');
    await inputs[1].fill('00');
    await inputs[2].fill('03');

    // Start timer
    await page.getByRole('button', { name: 'Start' }).click();

    // Inputs should be hidden, check pause button exists
    await expect(page.locator('input[type="text"]')).toHaveCount(0);
    const pauseButton = page.getByRole('button', { name: 'Pause' });
    await expect(pauseButton).toBeVisible();

    // Pause timer
    await pauseButton.click();
    const resumeButton = page.getByRole('button', { name: 'Resume' });
    await expect(resumeButton).toBeVisible();

    // Resume timer
    await resumeButton.click();

    // Wait for timer to finish (should take ~3 seconds)
    // Wait until 'Start' button disappears and only 'Reset' button is present (finished mode)
    await expect(page.getByRole('button', { name: 'Pause' })).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: 'Start' })).not.toBeVisible();

    // Check reset button still exists and click it
    const resetButton = page.getByRole('button', { name: 'Reset' });
    await expect(resetButton).toBeVisible();
    await resetButton.click();

    // Inputs should return and timer resets
    await expect(page.locator('input[type="text"]')).toHaveCount(3);
  });
});
