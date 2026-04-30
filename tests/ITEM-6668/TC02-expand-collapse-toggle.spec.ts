// spec: specs/ITEM-6668-advanced-employee-filter-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { LoginStatisticsReportPage } from '../../pages/reports/LoginStatisticsReportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC02 — Expand and collapse toggle for filter accordion', () => {
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

  test('TC02: filter accordion can be expanded and collapsed by clicking the header', async () => {
    const report = new LoginStatisticsReportPage(page);

    // Step 1: Navigate to the Login Statistics Report page
    await report.navigateTo();

    // Step 2: Select company 'NTC'
    await report.selectCompany('NTC');

    // Step 3: Expect the filter to start collapsed
    await report.expectFilterCollapsed();

    // Step 4: Expand the filter accordion
    await report.expandFilter();

    // Step 5: Expect the filter to be expanded
    await report.expectFilterExpanded();

    // Step 6: Expect the filter header to show the up arrow (expanded indicator)
    await report.expectFilterHeaderHasUpArrow();

    // Step 7: Expect the filter button to be visible when expanded
    await report.expectFilterButtonVisible();

    // Step 8: Collapse the filter accordion
    await report.collapseFilter();

    // Step 9: Expect the filter to be collapsed again
    await report.expectFilterCollapsed();

    // Step 10: Expect the filter header to show the down arrow again
    await report.expectFilterHeaderHasDownArrow();

    // Step 11: Expect the filter button to not be visible when collapsed
    await report.expectFilterButtonNotVisible();
  });
});
