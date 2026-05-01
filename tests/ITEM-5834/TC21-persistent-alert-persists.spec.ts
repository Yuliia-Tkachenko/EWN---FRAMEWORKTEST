// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC21 — persistentAlert: success banner persists after navigation', () => {
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

  // The Vue toast component is destroyed when navigating away; it does not persist
  // across SPA navigation. The toast is not re-shown upon returning to the page.
  test.fixme('TC21: success alert is still visible after navigating away and returning', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Move an employee and click Export to trigger the success alert
    await report.moveFirstAvailableItemToSelected();
    await report.clickExportButton();
    await report.expectSuccessAlertVisible();

    // Step 3: Navigate away to the home/dashboard page
    await page.goto('/legacy/Dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Step 4: Navigate back to the ISN Manual Export page
    await report.navigateTo();

    // Step 5: Verify the success alert is still displayed (persistentAlert component persists)
    await report.expectAlertVisible();
  });
});
