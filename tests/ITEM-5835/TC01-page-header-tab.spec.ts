// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Page Load & Tab Navigation', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(60000);
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername1, config.validPassword1);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('TC01 â€” Verify Page Loads with Correct Header and "Search" Tab Active', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate to /legacy/CardDataExport
    await eCardPage.navigateTo();

    // Collect JS errors throughout
    const jsErrors: string[] = [];
    page.on('pageerror', err => jsErrors.push(err.message));

    // expect: The page H1 heading contains "eCard Data Export"
    const heading = page.locator('.product-section h1').filter({ hasText: /eCard Data Export/i });
    await expect(heading, 'H1 heading should contain "eCard Data Export"').toBeVisible();
    await expect(heading).toHaveText(/eCard Data Export/i);

    // expect: A "Search" tab is visible and marked as the active/selected tab
    await expect(eCardPage.searchTab, 'Search tab should be visible').toBeVisible();
    await expect(eCardPage.searchTab, 'Search tab should have active class').toHaveClass(/active/);

    // expect: Search tab contains the text "Search"
    await expect(eCardPage.searchTab).toContainText('Search');

    // expect: No JavaScript errors on page load
    expect(jsErrors, 'No JavaScript errors should appear on page load').toHaveLength(0);
  });
});
