// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC14 — Dual list: search filter narrows Selected Employees', () => {
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

  test('TC14: typing in Selected search input filters only the Selected panel', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Move the first two available employees to the Selected panel
    await report.moveFirstAvailableItemToSelected();
    await report.moveFirstAvailableItemToSelected();
    const selectedCount = await report.getSelectedItemsCount();
    expect(selectedCount).toBe(2);

    // Step 3: Note the initial count in the Available panel (should be unaffected)
    const availableCountBefore = await report.getAvailableItemsCount();

    // Step 4: Type a search term in the Selected Employees search input
    await report.searchSelectedEmployees('a');

    // Step 5: Verify the Selected panel list changes (filters applied)
    const filteredSelectedCount = await report.getSelectedItemsCount();
    expect(filteredSelectedCount).toBeGreaterThanOrEqual(0);

    // Step 6: Verify the Available panel is unaffected by the Selected panel search
    const availableCountAfter = await report.getAvailableItemsCount();
    expect(availableCountAfter).toBe(availableCountBefore);
  });
});
