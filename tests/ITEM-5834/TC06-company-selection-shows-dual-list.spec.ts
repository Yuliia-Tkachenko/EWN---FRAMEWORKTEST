// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC06 — Company selection reveals the dual list and Export button', () => {
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

  test('TC06: selecting JuliaLLC shows the dual list and Export to ISN button', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to the ISN Manual Export page
    await report.navigateTo();

    // Step 2: Select company 'JuliaLLC'
    await report.selectCompany('JuliaLLC');

    // Step 3: Verify the selected company display is visible
    await report.expectSelectedCompanyDisplayVisible();

    // Step 4: Verify the 'Change' link appears next to the company name
    await report.expectChangeLinkVisible();

    // Step 5: Verify the typeahead input is no longer shown
    await report.expectCompanySearchInputNotVisible();

    // Step 6: Verify the Associate Dual List is visible
    await report.expectDualListVisible();

    // Step 7: Verify the 'Export to ISN' button is visible
    await report.expectExportButtonVisible();
  });
});
