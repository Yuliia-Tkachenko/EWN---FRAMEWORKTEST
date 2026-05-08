// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC24 — Export button: styling matches design spec', () => {
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

  test('TC24: Export to ISN button has correct label and is positioned below the dual list', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Verify the Export button is visible with correct label
    await report.expectExportButtonVisible();
    await report.expectExportButtonHasText(/export to isn/i);

    // Step 3: Verify the button has a distinct background color (not transparent)
    const bgColor = await report.getExportButtonBackgroundColor();
    expect(bgColor).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/i);

    // Step 4: Verify the button is positioned below the dual list panels
    const isBelowDualList = await report.exportButtonIsBelowDualList(10);
    expect(isBelowDualList).toBe(true);
  });
});
