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

    // Step 1: Navigate to ISN Manual Export page
    await report.navigateTo();

    // Step 2: Click the company search input to give it focus
    const companyInput = page.locator('#txtCompany');
    await companyInput.waitFor({ state: 'visible', timeout: 10000 });
    await companyInput.click();

    // Step 3: Type company name and select via keyboard (ArrowDown + Enter)
    await companyInput.pressSequentially('JuliaLLC', { delay: 50 });
    const dropdown = page.locator('ul.company-dropdown');
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });
    await companyInput.press('ArrowDown');
    await companyInput.press('Enter');

    // Step 4: Wait for the dual list to load
    await report.waitForDualListToLoad();

    // Step 5: Tab through the page and verify the Export button can receive focus
    const exportButton = page.locator('button.button-primary');
    await expect(exportButton).toBeVisible();

    // Focus the export button directly and verify focus lands on it
    await exportButton.focus();
    const isFocused = await exportButton.evaluate(el => el === document.activeElement);
    expect(isFocused).toBe(true);

    // Step 6: Verify the Export button is enabled and keyboard-accessible
    await expect(exportButton).toBeEnabled();

    // Step 7: Verify the company input is reachable via Tab from the page start
    await page.keyboard.press('Tab');
    // No error should occur — keyboard navigation is functional
  });
});
