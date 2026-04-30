// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC30 — Multi-select label shows "N Selected" for two or more selected items', () => {
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

  test('TC30: label updates to "2 Selected" and "3 Selected" as more facilities are chosen', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Open the Facility multi-select dropdown
    await report.openMultiSelect('Facility');

    // Step 5: Select the 'June_23' option
    await report.selectMultiSelectOption('June_23');

    // Step 6: Select the 'Lower_Shed' option
    await report.selectMultiSelectOption('Lower_Shed');

    // Step 7: Expect the Facility label to show '2 Selected'
    await report.expectMultiSelectLabel('Facility', '2 Selected');

    // Step 8: Select the 'NTC_Building' option
    await report.selectMultiSelectOption('NTC_Building');

    // Step 9: Expect the Facility label to show '3 Selected'
    await report.expectMultiSelectLabel('Facility', '3 Selected');
  });
});
