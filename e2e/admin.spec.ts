import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/login');
        await page.fill('input[type="email"]', 'admin@example.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        // Adjust timeout or expectation based on real app behavior (e.g. redirect)
        await expect(page).toHaveURL('/admin');
    });

    test('shows dashboard stats', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText(/Dashboard/);
    });

    test('settings can be updated', async ({ page }) => {
        // First ensure we are on dashboard
        await expect(page.locator('h1')).toHaveText(/Dashboard/);

        // Click settings in navigation (assuming sidebar/menu exists)
        // If sidebar is hidden on mobile, this might fail too, so we'll check layout
        // For now, let's keep goto but verify login state first
        await page.goto('/admin/settings');

        // Wait for H1 explicitly
        await expect(page.locator('h1')).toHaveText('Einstellungen', { timeout: 10000 });

        await page.fill('input[name="contact_email"]', 'new@example.com');
        // Ensure we click the right save button
        await page.click('button:has-text("Speichern")');
        await expect(page.getByText('Einstellungen gespeichert')).toBeVisible();
    });
});
