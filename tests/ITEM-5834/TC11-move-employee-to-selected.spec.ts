// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC11 — Dual list: move employee from Available to Selected', () => {
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

  test('TC11: checking a checkbox and clicking Move to Selected moves the employee', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Confirm Available has items and Selected is empty
    await report.expectAvailableItemsCountGreaterThan(0);
    await report.expectSelectedItemsCount(0);

    // Step 3: Note the initial count of available employees
    const initialAvailableCount = await report.getAvailableItemsCount();

    // Step 4: Check the first available employee and move to Selected
    await report.moveFirstAvailableItemToSelected();

    // Step 5: Verify the Selected panel now has exactly one item
    await report.expectSelectedItemsCount(1);

    // Step 6: Verify the Available panel count decreased by one
    const newAvailableCount = await report.getAvailableItemsCount();
    expect(newAvailableCount).toBe(initialAvailableCount - 1);
  });
});
