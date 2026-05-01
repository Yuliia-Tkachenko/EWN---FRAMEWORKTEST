// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC16 — Export button: loading overlay displays during API call', () => {
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

  test('TC16: clicking Export triggers a loading state and the button is not clickable during the API call', async () => {
    test.setTimeout(60000);
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Move one employee to Selected so Export is actionable
    await report.moveFirstAvailableItemToSelected();
    await report.expectSelectedItemsCount(1);

    // Step 3: Intercept the export API and hold the response to observe loading state
    let releaseRequest!: () => void;
    const requestHeld = new Promise<void>(resolve => { releaseRequest = resolve; });

    await page.route('**/ApiProxy**isn-evaluation-exports**', async route => {
      await requestHeld;
      await route.continue();
    });

    // Step 4: Click Export — the UI must enter loading state immediately
    await report.clickExportButton();

    // Step 5: Verify Export button is disabled (not clickable) while API call is in-flight
    await report.expectExportButtonDisabled();

    // Step 6: Release the intercepted request
    releaseRequest();

    // Step 7: Verify success toast appears after the API completes
    await report.expectSuccessAlertVisible();

    await page.unroute('**/ApiProxy**isn-evaluation-exports**');
  });
});
