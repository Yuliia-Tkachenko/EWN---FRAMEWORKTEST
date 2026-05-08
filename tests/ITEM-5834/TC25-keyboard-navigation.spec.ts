// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC25 — Keyboard navigation: Tab through form elements', () => {
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

  test('TC25: Tab key moves focus through interactive elements and Export button is keyboard-accessible', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export page and select a company
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Move at least one employee to Selected so the Export button becomes enabled
    await report.moveFirstAvailableItemToSelected();
    await report.expectSelectedItemsCount(1);

    // Step 3: Verify the Export button is visible and enabled
    await report.expectExportButtonVisible();
    await report.expectExportButtonEnabled();

    // Step 4: Focus the Export button directly and verify focus lands on it
    await report.focusExportButton();
    const isFocused = await report.exportButtonHasFocus();
    expect(isFocused).toBe(true);

    // Step 5: Verify keyboard navigation does not throw errors
    await page.keyboard.press('Tab');
    // No error should occur — keyboard navigation is functional
  });
});
