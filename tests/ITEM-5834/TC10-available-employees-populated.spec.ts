// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC10 — Dual list: Available Employees populated after company selection', () => {
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

  test('TC10: Available Employees panel has items and Selected panel is empty after company selection', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to the ISN Manual Export page
    await report.navigateTo();

    // Step 2: Select company 'JuliaLLC'
    await report.selectCompany('JuliaLLC');

    // Step 3: Wait for the dual list to load
    await report.waitForDualListToLoad();

    // Step 4: Verify the Available Employees panel has at least one item
    await report.expectAvailableItemsCountGreaterThan(0);

    // Step 5: Verify the Selected Employees panel starts empty
    await report.expectSelectedItemsCount(0);

    // Step 6: Verify both panels ('Available Employees' / 'Selected Employees') are visible
    await report.expectDualListVisible();
  });
});
