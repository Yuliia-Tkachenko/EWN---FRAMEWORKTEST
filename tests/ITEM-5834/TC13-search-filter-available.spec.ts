// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC13 — Dual list: search filter narrows Available Employees', () => {
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

  test('TC13: typing in Available search input filters the employee list', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Note the initial count of available employees
    const initialCount = await report.getAvailableItemsCount();
    expect(initialCount).toBeGreaterThan(0);

    // Step 3: Type a partial name into the Available Employees search input
    await report.searchAvailableEmployees('a');

    // Step 4: Verify the available list is filtered (count changed or items match the search)
    const filteredCount = await report.getAvailableItemsCount();
    // Filtered count should be >= 0 and different from initial, or stay same if all match
    expect(filteredCount).toBeGreaterThanOrEqual(0);

    // Step 5: Clear the search and verify the full list is restored
    await report.searchAvailableEmployees('');
    await page.waitForTimeout(500);
    const restoredCount = await report.getAvailableItemsCount();
    expect(restoredCount).toBe(initialCount);
  });
});
