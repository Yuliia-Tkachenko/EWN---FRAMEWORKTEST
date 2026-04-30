// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC06 — Company-level user page load', () => {
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

  test('TC06: company-level user sees filter accordion and dual list on page load without company selector', async () => {
    test.skip(true, 'Requires a Company-level user account — no credentials available in TestConfig');

    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page as a company-level user
    await report.navigateTo();

    // Step 2: Expect the filter accordion to be visible (no company selection step needed for company users)
    await report.expectFilterAccordionVisible();

    // Step 3: Expect the filter to be collapsed by default
    await report.expectFilterCollapsed();

    // Step 4: Expect the dual list to be visible
    await report.expectDualListVisible();
  });
});
