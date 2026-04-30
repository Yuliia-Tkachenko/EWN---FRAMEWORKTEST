// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC07 — Filter panel contains all expected fields with correct defaults', () => {
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

  test('TC07: all filter fields are present and display correct default values', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Expect the Employee Name input to be visible
    await report.expectEmployeeNameInputVisible();

    // Step 5: Expect Facility multi-select label defaults to 'All'
    await report.expectMultiSelectLabel('Facility', 'All');

    // Step 6: Expect Job Title multi-select label defaults to 'All'
    await report.expectMultiSelectLabel('Job Title', 'All');

    // Step 7: Expect Group multi-select label defaults to 'All'
    await report.expectMultiSelectLabel('Group', 'All');

    // Step 8: Expect Project multi-select label defaults to 'All'
    await report.expectMultiSelectLabel('Project', 'All');

    // Step 9: Expect Supervisor multi-select label defaults to 'All'
    await report.expectMultiSelectLabel('Supervisor', 'All');

    // Step 10: Expect Testing Pool multi-select label defaults to 'All'
    await report.expectMultiSelectLabel('Testing Pool', 'All');

    // Step 11: Expect Subscription multi-select label defaults to 'All'
    await report.expectMultiSelectLabel('Subscription', 'All');

    // Step 12: Expect User Type defaults to 'All Users'
    await report.expectUserTypeValue('All Users');

    // Step 13: Expect User Status defaults to 'Active'
    await report.expectUserStatusValue('Active');

    // Step 14: Expect the Filter button to be visible
    await report.expectFilterButtonVisible();
  });
});
