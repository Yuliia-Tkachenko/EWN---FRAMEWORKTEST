// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC08 — Change button resets page to initial state', () => {
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

  test('TC08: clicking Change hides dual list and Export button, shows typeahead again', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');

    // Step 2: Confirm the dual list and Export button are visible
    await report.expectDualListVisible();
    await report.expectExportButtonVisible();
    await report.expectChangeLinkVisible();

    // Step 3: Click the 'Change' link to deselect the company
    await report.clickChangeCompany();

    // Step 4: Verify the company typeahead input reappears
    await report.expectCompanySearchInputVisible();

    // Step 5: Verify the 'Change' link is gone
    await report.expectChangeLinkNotVisible();

    // Step 6: Verify the Associate Dual List is hidden
    await report.expectDualListNotVisible();

    // Step 7: Verify the 'Export to ISN' button is hidden
    await report.expectExportButtonNotVisible();
  });
});
