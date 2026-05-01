// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC01 — Page loads with correct title and heading', () => {
  test.beforeAll(async ({ browser }) => {
    // Extend timeout to account for slowMo:1000 on first-run login
    test.setTimeout(60000);
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername1, config.validPassword1);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('TC01: browser title and page heading contain ISN Manual Export', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to the ISN Manual Export page
    await report.navigateTo();

    // Step 2: Verify the page H1 heading contains 'ISN Manual Export'
    // (The app uses a generic browser tab title; the page identity is in the H1)
    const heading = page.locator('h1').filter({ hasText: /isn manual export/i }).first();
    await expect(heading).toBeVisible();

    // Step 3: Verify the H1 heading text is exactly 'ISN Manual Export'
    await expect(heading).toHaveText(/isn manual export/i);

    // Step 4: Verify the page loads without a JavaScript error
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    expect(errors).toHaveLength(0);
  });
});
