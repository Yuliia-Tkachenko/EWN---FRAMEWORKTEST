// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC33 — User Type dropdown contains all standard options', () => {
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

  test('TC33: User Type contains all standard options and defaults to "All Users"', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Retrieve all User Type options
    const options = await report.getUserTypeOptions();

    // Step 5: Expect options to contain 'All Users'
    expect(options).toContain('All Users');

    // Step 6: Expect options to contain 'Administrator'
    expect(options).toContain('Administrator');

    // Step 7: Expect options to contain 'Supervisor'
    expect(options).toContain('Supervisor');

    // Step 8: Expect options to contain 'Evaluator'
    expect(options).toContain('Evaluator');

    // Step 9: Expect options to contain 'Non-Billable User'
    expect(options).toContain('Non-Billable User');

    // Step 10: Expect options to contain 'All Billable Users'
    expect(options).toContain('All Billable Users');

    // Step 11: Expect User Type to default to 'All Users'
    await report.expectUserTypeValue('All Users');
  });
});
