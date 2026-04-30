// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC26 — Dual list interaction works correctly alongside the filter (regression)', () => {
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

  test('TC26: items can be moved between available and selected lists, and filter search works', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Wait for the dual list to fully load
    await report.waitForDualListToLoad();

    // Step 4: Move the first available item to the selected list
    await report.moveFirstAvailableItemToSelected();

    // Step 5: Expect the selected items count to be 1
    await report.expectSelectedItemsCount(1);

    // Step 6: Move the first selected item back to the available list
    await report.moveFirstSelectedItemToAvailable();

    // Step 7: Expect the selected items count to be 0
    await report.expectSelectedItemsCount(0);

    // Step 8: Expand the filter accordion
    await report.expandFilter();

    // Step 9: Type 'bond' in the Employee Name field
    await report.fillEmployeeName('bond');

    // Step 10: Click the filter button
    await report.clickFilterButton();

    // Step 11: Wait for search results to load
    await report.waitForSearchResults();

    // Step 12: Expect at least one result in the available items list
    await report.expectAvailableItemsCountGreaterThan(0);
  });
});
