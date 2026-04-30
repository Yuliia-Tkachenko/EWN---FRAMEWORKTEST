// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC03 — EWN filter is hidden until a company is selected', () => {
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

  test('TC03: filter accordion and dual list are not visible before a company is selected', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page (no company selected)
    await report.navigateTo();

    // Step 2: Expect the filter accordion to not be visible without a company
    await report.expectFilterAccordionNotVisible();

    // Step 3: Expect the dual list to not be visible without a company
    await report.expectDualListNotVisible();

    // Step 4: Expect the company search input to be visible (prompting the user to select a company)
    await report.expectCompanySearchInputVisible();
  });
});
