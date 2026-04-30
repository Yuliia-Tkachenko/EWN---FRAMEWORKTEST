// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC20 — Pressing Enter in Employee Name field submits the filter', () => {
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

  test('TC20: pressing Enter in the Employee Name field triggers the filter search', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Wait for the dual list to fully load
    await report.waitForDualListToLoad();

    // Step 5: Type 'bond' in the Employee Name field
    await report.fillEmployeeName('bond');

    // Step 6: Press Enter to submit the filter
    await report.pressEnterInFilter();

    // Step 7: Wait for search results to load
    await report.waitForSearchResults();

    // Step 8: Expect at least one result in the available items list
    await report.expectAvailableItemsCountGreaterThan(0);
  });
});
