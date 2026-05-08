// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC23 — Dual list component: style parity check', () => {
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

  test('TC23: dual list renders with two panels, search inputs, and move buttons', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Verify the 'Available Employees' panel (left) is visible
    await report.expectAvailablePanelVisible();

    // Step 3: Verify the 'Selected Employees' panel (right) is visible
    await report.expectSelectedPanelVisible();

    // Step 4: Verify a search input is present inside the Available Employees panel
    await report.expectAvailableSearchInputVisible();

    // Step 5: Verify a search input is present inside the Selected Employees panel
    await report.expectSelectedSearchInputVisible();

    // Step 6: Verify the Move right button is visible
    await report.expectMoveRightButtonVisible();

    // Step 7: Verify the Move left button is visible
    await report.expectMoveLeftButtonVisible();

    // Step 8: Verify the two panels are side by side (roughly same vertical level)
    const atSameLevel = await report.panelsAreAtSameVerticalLevel(50);
    expect(atSameLevel).toBe(true);
  });
});
