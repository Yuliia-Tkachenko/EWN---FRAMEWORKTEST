// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC12 — Select All control selects all items in a multi-select', () => {
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

  test('TC12: clicking Select All updates label to show count of selected items (not "All")', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Open the Facility multi-select dropdown
    await report.openMultiSelect('Facility');

    // Step 5: Expect the Select All control to be visible
    await report.expectSelectAllControlVisible();

    // Step 6: Expect the Deselect All control to be visible
    await report.expectDeselectAllControlVisible();

    // Step 7: Click Select All to select every facility
    await report.clickSelectAll();

    // Step 8: Retrieve the current label for Facility
    const label = await report.getMultiSelectLabel('Facility');

    // Step 9: After selecting all, the label should NOT be 'All' — it should show a count
    expect(label).not.toBe('All');
  });
});
