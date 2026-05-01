// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC20 — Export button: API error shows failure alert', () => {
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

  test('TC20: when the export API returns a 500 error, an error alert is displayed', async () => {
    test.setTimeout(90000);
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Set up a route to intercept the ISN export API call and return 500.
    // The actual export endpoint is: /legacy/ApiProxy?url=api%2Fcompanies%2F{id}%2Fisn-evaluation-exports
    await page.route('**/ApiProxy**isn-evaluation-exports**', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ message: 'Internal Server Error' }) });
    });

    // Step 3: Move at least one employee to the Selected panel
    await report.moveFirstAvailableItemToSelected();
    await report.expectSelectedItemsCount(1);

    // Step 4: Click the 'Export to ISN' button
    await report.clickExportButton();

    // Step 5: Verify an error alert is shown (not a success alert)
    await report.expectErrorAlertVisible();

    // Step 6: Verify the page is still functional after the error
    await report.expectExportButtonVisible();

    // Cleanup routes
    await page.unroute('**/ApiProxy**isn-evaluation-exports**');
  });
});
