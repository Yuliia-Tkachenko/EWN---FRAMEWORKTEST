// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC04 — Filter accordion and dual list appear after company is selected', () => {
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

  test('TC04: filter accordion and dual list become visible after selecting a company', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Expect the filter accordion to not be visible before company selection
    await report.expectFilterAccordionNotVisible();

    // Step 3: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 4: Expect the selected company display to be visible
    await report.expectSelectedCompanyDisplayVisible();

    // Step 5: Expect the 'Change' link to be visible
    await report.expectChangeLinkVisible();

    // Step 6: Expect the filter accordion to now be visible
    await report.expectFilterAccordionVisible();

    // Step 7: Expect the filter to be collapsed by default
    await report.expectFilterCollapsed();

    // Step 8: Expect the dual list to be visible
    await report.expectDualListVisible();
  });
});
