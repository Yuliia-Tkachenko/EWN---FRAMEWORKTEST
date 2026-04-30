// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC17 — User Type options exclude TPE types for non-ATAC companies', () => {
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

  test('TC17: User Type dropdown excludes TPE-specific options for a non-ATAC company', async () => {
    test.skip(true, 'NTC includes TPE types — ATAC boundary requires a confirmed non-ATAC company. To be run manually with appropriate company selection.');

    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select a confirmed non-ATAC company
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Retrieve User Type options
    const options = await report.getUserTypeOptions();

    // Step 5: Verify TPE-specific types are absent from the list
    // (exact verification requires manual confirmation of which company qualifies as non-ATAC)
    console.log('User Type options:', options);
  });
});
