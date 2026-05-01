// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC04 — Initial page state: only info panel and company input visible', () => {
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

  test('TC04: before company selection only the company typeahead input is visible', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to the ISN Manual Export page
    await report.navigateTo();

    // Step 2: Verify the 'Select Company' typeahead input is visible and empty
    await report.expectCompanySearchInputVisible();

    // Step 3: Verify the Associate Dual List is NOT visible
    await report.expectDualListNotVisible();

    // Step 4: Verify the 'Export to ISN' button is NOT visible
    await report.expectExportButtonNotVisible();

    // Step 5: Verify the 'Change' link is NOT visible
    await report.expectChangeLinkNotVisible();

    // Step 6: Verify the selected company display is NOT visible
    const companyDisplay = page.locator('p.form-control-static');
    await expect(companyDisplay).toBeHidden();
  });
});
