// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC22 — persistentAlert: success alert can be dismissed', () => {
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

  test('TC22: clicking the dismiss button on the alert hides the alert banner', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Move an employee and click Export to trigger the success alert
    await report.moveFirstAvailableItemToSelected();
    await report.clickExportButton();
    await report.expectSuccessAlertVisible();

    // Step 3: Click the dismiss (✕ / Close) button on the alert banner
    await report.dismissAlert();

    // Step 4: Verify the alert is no longer visible
    await report.expectAlertNotVisible();

    // Step 5: Verify the rest of the page remains functional after dismissal
    await report.expectExportButtonVisible();
  });
});
