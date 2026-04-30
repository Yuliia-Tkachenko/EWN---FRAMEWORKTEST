// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC21 — Typing in Employee Name does not trigger an automatic search', () => {
  test.beforeAll(async ({ browser }) => {
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

  test('TC21: dual list count stays unchanged while typing in Employee Name without submitting', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Wait for the dual list to fully load
    await report.waitForDualListToLoad();

    // Step 5: Record the initial available items count
    const initialCount = await report.getAvailableItemsCount();

    // Step 6: Type 't' in the Employee Name field
    await report.fillEmployeeName('t');

    // NOTE: page.waitForTimeout is used directly here since the page object has no wait method
    // Step 7: Wait 500ms to ensure no auto-search fires
    await page.waitForTimeout(500);

    // Step 8: Expect the count to still equal the initial count (no auto-search)
    const countAfterT = await report.getAvailableItemsCount();
    expect(countAfterT).toBe(initialCount);

    // Step 9: Type 'te' in the Employee Name field
    await report.fillEmployeeName('te');

    // Step 10: Wait another 500ms
    await page.waitForTimeout(500);

    // Step 11: Expect the count to still equal the initial count (still no auto-search)
    const countAfterTe = await report.getAvailableItemsCount();
    expect(countAfterTe).toBe(initialCount);
  });
});
