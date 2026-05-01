// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC05 — Company typeahead: dropdown appears after typing', () => {
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

  test('TC05: typing a company name triggers the company dropdown', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to the ISN Manual Export page
    await report.navigateTo();

    // Step 2: Click the company search input and type 'JuliaLLC'
    const companyInput = page.locator('#txtCompany');
    await companyInput.waitFor({ state: 'visible', timeout: 10000 });
    await companyInput.click();
    await companyInput.pressSequentially('JuliaLLC', { delay: 50 });

    // Step 3: Wait for the company dropdown to appear
    const dropdown = page.locator('ul.company-dropdown');
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });

    // Step 4: Verify the dropdown contains at least one option
    const options = page.locator('ul.company-dropdown li[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);

    // Step 5: Verify at least one option contains the text 'JuliaLLC'
    const matchingOption = options.filter({ hasText: /juliaLLC/i }).first();
    await expect(matchingOption).toBeVisible();
  });
});
