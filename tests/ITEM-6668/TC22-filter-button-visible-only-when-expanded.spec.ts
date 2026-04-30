// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC22 — Filter button is only visible when the filter accordion is expanded', () => {
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

  test('TC22: filter button appears on expand and disappears on collapse', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expect the filter to start collapsed
    await report.expectFilterCollapsed();

    // Step 4: Expect the filter button to not be visible when collapsed
    await report.expectFilterButtonNotVisible();

    // Step 5: Expand the filter accordion
    await report.expandFilter();

    // Step 6: Expect the filter button to now be visible
    await report.expectFilterButtonVisible();

    // Step 7: Collapse the filter accordion
    await report.collapseFilter();

    // Step 8: Expect the filter button to not be visible again
    await report.expectFilterButtonNotVisible();
  });
});
