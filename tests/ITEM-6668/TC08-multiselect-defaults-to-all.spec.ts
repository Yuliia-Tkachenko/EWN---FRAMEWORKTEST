// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC08 — All multi-select fields default to "All"', () => {
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

  test('TC08: every multi-select field shows "All" as the default label', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Expect Facility defaults to 'All'
    await report.expectMultiSelectLabel('Facility', 'All');

    // Step 5: Expect Job Title defaults to 'All'
    await report.expectMultiSelectLabel('Job Title', 'All');

    // Step 6: Expect Group defaults to 'All'
    await report.expectMultiSelectLabel('Group', 'All');

    // Step 7: Expect Project defaults to 'All'
    await report.expectMultiSelectLabel('Project', 'All');

    // Step 8: Expect Supervisor defaults to 'All'
    await report.expectMultiSelectLabel('Supervisor', 'All');

    // Step 9: Expect Testing Pool defaults to 'All'
    await report.expectMultiSelectLabel('Testing Pool', 'All');

    // Step 10: Expect Subscription defaults to 'All'
    await report.expectMultiSelectLabel('Subscription', 'All');
  });
});
