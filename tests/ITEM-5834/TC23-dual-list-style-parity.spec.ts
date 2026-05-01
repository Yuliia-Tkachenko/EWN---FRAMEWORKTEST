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
    const availablePanel = page.locator('.dual-list-left');
    await expect(availablePanel).toBeVisible();

    // Step 3: Verify the 'Selected Employees' panel (right) is visible
    const selectedPanel = page.locator('.dual-list-right');
    await expect(selectedPanel).toBeVisible();

    // Step 4: Verify a search input is present inside the Available Employees panel
    const availableSearch = page.locator('.dual-list-left input[placeholder="Search"]');
    await expect(availableSearch).toBeVisible();

    // Step 5: Verify a search input is present inside the Selected Employees panel
    const selectedSearch = page.locator('.dual-list-right input[placeholder="Search"]');
    await expect(selectedSearch).toBeVisible();

    // Step 6: Verify the Move right (→) button is visible
    const moveRight = page.locator('.move-button-group .ri-arrow-right-s-line');
    await expect(moveRight).toBeVisible();

    // Step 7: Verify the Move left (←) button is visible
    const moveLeft = page.locator('.move-button-group .ri-arrow-left-s-line');
    await expect(moveLeft).toBeVisible();

    // Step 8: Verify the two panels are side by side (roughly same vertical level)
    const availableBox = await availablePanel.boundingBox();
    const selectedBox  = await selectedPanel.boundingBox();
    expect(Math.abs((availableBox?.y ?? 0) - (selectedBox?.y ?? 0))).toBeLessThan(50);
  });
});
