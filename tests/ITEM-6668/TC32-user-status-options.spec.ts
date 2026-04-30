// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC32 — User Status dropdown has exactly three options: All, Active, Inactive', () => {
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

  test('TC32: User Status has exactly 3 options and defaults to "Active"', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Retrieve all User Status options
    const options = await report.getUserStatusOptions();

    // Step 5: Expect options to contain 'All'
    expect(options).toContain('All');

    // Step 6: Expect options to contain 'Active'
    expect(options).toContain('Active');

    // Step 7: Expect options to contain 'Inactive'
    expect(options).toContain('Inactive');

    // Step 8: Expect exactly 3 options total
    expect(options).toHaveLength(3);

    // Step 9: Expect User Status to default to 'Active'
    await report.expectUserStatusValue('Active');
  });
});
