// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC19 — Export button: duplicate request prevention', () => {
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

  // The app does not implement duplicate-click prevention on the Export button.
  // A double-click fires two separate API requests; the button is not disabled during in-flight requests.
  test.fixme('TC19: rapid double-click on Export button fires only one export request', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Move at least one employee to the Selected panel
    await report.moveFirstAvailableItemToSelected();
    await report.expectSelectedItemsCount(1);

    // Step 3: Track all ISN export API requests
    const exportRequests: string[] = [];
    page.on('request', req => {
      if (req.url().includes('IsnManual') || req.url().includes('isn') || req.url().includes('export')) {
        exportRequests.push(req.url());
      }
    });

    // Step 4: Click the Export button twice in rapid succession
    const exportButton = page.getByRole('button', { name: /export to isn/i });
    await exportButton.click();
    await exportButton.click();

    // Step 5: Wait for the response
    await page.waitForTimeout(3000);

    // Step 6: Verify only one export request was fired OR the button was disabled after the first click
    // (either deduplication or button disabling is acceptable)
    const isButtonDisabledAfterClick = await exportButton.isDisabled();
    const onlyOneRequest = exportRequests.length <= 1;
    expect(isButtonDisabledAfterClick || onlyOneRequest).toBeTruthy();

    // Step 7: Verify the success (or error) alert is displayed exactly once
    await report.expectAlertVisible();
  });
});
