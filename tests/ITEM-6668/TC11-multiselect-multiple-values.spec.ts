// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC11 — Multi-select label updates as items are selected', () => {
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

  test('TC11: selecting one item shows item name, selecting two shows "2 Selected"', async () => {
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

    // Step 7: Select the 'June_23' option
    await report.selectMultiSelectOption('June_23');

    // Step 8: Expect the Facility label to show 'June_23' (single item selected)
    await report.expectMultiSelectLabel('Facility', 'June_23');

    // Step 9: Select the 'Lower_Shed' option
    await report.selectMultiSelectOption('Lower_Shed');

    // Step 10: Expect the Facility label to show '2 Selected' (two items selected)
    await report.expectMultiSelectLabel('Facility', '2 Selected');
  });
});
