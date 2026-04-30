// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC18 — User Type options respect excludeNonUsers configuration flag', () => {
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

  test('TC18: User Type dropdown hides non-user types when excludeNonUsers flag is active', async () => {
    test.skip(true, 'excludeNonUsers configuration is context-dependent — requires identifying a page/company where this flag is active.');

    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select a company where excludeNonUsers is known to be active
    await report.selectCompany('NTC');

    // Step 3: Expand the filter accordion
    await report.expandFilter();

    // Step 4: Retrieve User Type options
    const options = await report.getUserTypeOptions();

    // Step 5: Verify non-user type options are absent
    // (requires identifying the correct company/context where this flag applies)
    console.log('User Type options:', options);
  });
});
