import { test, expect } from '@playwright/test';

test.describe('Öffentliche Seiten', () => {
    test('/ leitet auf eine Sprache weiter und zeigt den Hero', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/(de|en)$/);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('Sprachumschalter behält die Seite', async ({ page }) => {
        await page.goto('/de/speisekarte');
        await page.getByRole('button', { name: 'en', exact: true }).click();
        await expect(page).toHaveURL(/\/en\/menu$/);
        await expect(page.getByRole('heading', { level: 1, name: 'Menu' })).toBeVisible();
    });

    test('Speisekarte lädt Kategorien und Filter', async ({ page }) => {
        await page.goto('/de/speisekarte');
        // level 2 + exact: die Karte enthält auch Gerichte wie "Pulled Beef Burger" (h3).
        const beefHeading = page.getByRole('heading', { level: 2, name: 'Beef Burger', exact: true });
        await expect(beefHeading).toBeVisible();
        await page.getByRole('button', { name: 'Vegan', exact: true }).first().click();
        await expect(page.getByRole('heading', { level: 2, name: 'Vegane Burger', exact: true })).toBeVisible();
        await expect(beefHeading).toHaveCount(0);
    });

    test('Galerie öffnet die Lightbox', async ({ page }) => {
        await page.goto('/de/galerie');
        const first = page.getByRole('button', { name: /Bild 1 von/ });
        await expect(first).toBeVisible();
        await first.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('Reservierung: Validierung und Erfolg', async ({ page }) => {
        await page.goto('/de/reservieren');
        await page.getByRole('button', { name: 'Anfrage senden' }).click();
        await expect(page.getByRole('alert').first()).toContainText('Bitte prüfen Sie die markierten Felder');

        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        await page.getByLabel('Ihr Name').fill('Playwright Gast');
        await page.getByLabel('E-Mail').fill('playwright@example.com');
        await page.getByLabel('Telefon').fill('0341 123456');
        await page.getByLabel('Anzahl Gäste').selectOption('3');
        await page.getByLabel('Datum').fill(tomorrow);
        await page.getByLabel('Uhrzeit').selectOption('19:00');
        await page.getByRole('button', { name: 'Anfrage senden' }).click();

        await expect(page.getByRole('heading', { name: /Vielen Dank/ })).toBeVisible({ timeout: 15000 });
        await expect(page.getByText('playwright@example.com')).toBeVisible();
    });
});
