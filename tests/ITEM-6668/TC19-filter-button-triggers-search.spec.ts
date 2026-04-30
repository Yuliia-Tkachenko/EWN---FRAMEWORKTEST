// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC19 — Filter button triggers search; typing alone does not auto-search', () => {
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

  test('TC19: typing in Employee Name does not trigger search; Filter button does', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Wait for the dual list to fully load
    await report.waitForDualListToLoad();

    // Step 5: Record the initial available items count before filtering
    const initialCount = await report.getAvailableItemsCount();

    // Step 6: Type 'admin' in the Employee Name field
    await report.fillEmployeeName('admin');

    // Step 7: Expect the count to remain the same (no auto-search triggered by typing)
    const countAfterTyping = await report.getAvailableItemsCount();
    expect(countAfterTyping).toBe(initialCount);

    // Step 8: Click the Filter button to trigger the search
    await report.clickFilterButton();

    // Step 9: Wait for search results to load
    await report.waitForSearchResults();

    // Step 10: Expect at least one result in the available items list
    await report.expectAvailableItemsCountGreaterThan(0);
  });
});
