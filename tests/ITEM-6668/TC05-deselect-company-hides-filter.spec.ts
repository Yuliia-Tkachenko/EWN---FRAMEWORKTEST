// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC05 — Clicking Change company hides the filter accordion and dual list', () => {
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

  test('TC05: filter accordion and dual list are hidden when company is deselected via Change link', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expect the filter accordion to be visible
    await report.expectFilterAccordionVisible();

    // Step 4: Expect the dual list to be visible
    await report.expectDualListVisible();

    // Step 5: Click the 'Change' link to deselect the company
    await report.clickChangeCompany();

    // Step 6: Expect the company required message to be visible
    await report.expectCompanyRequiredMessageVisible();

    // Step 7: Expect the filter accordion to no longer be visible
    await report.expectFilterAccordionNotVisible();

    // Step 8: Expect the dual list to no longer be visible
    await report.expectDualListNotVisible();
  });
});
