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

  test.fixme('TC20: when the export API returns a 500 error, an error alert is displayed',
    // ⚠️ SKIP REASON: Route intercept pattern '**/ApiProxy**isn-evaluation-exports**' does not
    // match the real export endpoint. When run, the real API is called and returns a success toast.
    // The assertion also incorrectly matched the success toast (false pass).
    //
    // TO FIX:
    // 1. Open DevTools → Network tab (Fetch/XHR filter)
    // 2. Navigate to /legacy/IsnManualExport, select a company, move an employee, click Export to ISN
    // 3. Copy the exact request URL from the Network tab
    // 4. Update the route pattern below with the real URL
    // 5. Update expectErrorAlertVisible() to assert on the specific error toast selector
    async () => {
      test.setTimeout(90000);
      const report = new IsnManualExportPage(page);

      await report.navigateTo();
      await report.selectCompany('JuliaLLC');
      await report.waitForDualListToLoad();

      // TODO: replace with real endpoint URL confirmed from Network tab
      await page.route('**/ApiProxy**isn-evaluation-exports**', route => {
        route.fulfill({ status: 500, body: JSON.stringify({ message: 'Internal Server Error' }) });
      });

      await report.moveFirstAvailableItemToSelected();
      await report.expectSelectedItemsCount(1);
      await report.clickExportButton();
      await report.expectErrorAlertVisible();
      await report.expectExportButtonVisible();

      await page.unroute('**/ApiProxy**isn-evaluation-exports**');
    }
  );
});
