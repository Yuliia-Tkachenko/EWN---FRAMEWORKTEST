// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC14 — Multi-select dropdown has scrollable overflow when list is long', () => {
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

  test('TC14: Supervisor multi-select dropdown container has scrollable overflow-y', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Open the Supervisor multi-select dropdown
    await report.openMultiSelect('Supervisor');

    // Step 5: Check the dropdown list container has CSS overflow-y set to 'auto' or 'scroll'
    // NOTE: page is used directly here since the page object has no scrollbar CSS inspection method
    const overflowY = await page.evaluate(() => {
      const listContainer = document.querySelector('.multi-select-dropdown__menu');
      if (!listContainer) return null;
      return window.getComputedStyle(listContainer).overflowY;
    });

    // Step 6: Expect overflow-y to be 'auto' or 'scroll', indicating a scrollable container
    expect(['auto', 'scroll']).toContain(overflowY);
  });
});
