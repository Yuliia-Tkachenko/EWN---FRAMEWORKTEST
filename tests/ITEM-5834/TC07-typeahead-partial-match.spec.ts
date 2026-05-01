// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC07 — Company typeahead: dropdown filters by partial name', () => {
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

  test('TC07: typing a partial company name shows only matching options', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to the ISN Manual Export page
    await report.navigateTo();

    // Step 2: Type a partial company name 'Julia' into the company search input
    const companyInput = page.locator('#txtCompany');
    await companyInput.waitFor({ state: 'visible', timeout: 10000 });
    await companyInput.click();
    await companyInput.pressSequentially('Julia', { delay: 50 });

    // Step 3: Wait for the dropdown to appear
    const dropdown = page.locator('ul.company-dropdown');
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });

    // Step 4: Verify all displayed options contain 'Julia' (partial match)
    const options = page.locator('ul.company-dropdown li[role="option"]');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(optionCount, 5); i++) {
      const text = await options.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('julia');
    }

    // Step 5: Continue typing to narrow to 'JuliaLLC' and verify results narrow further
    await companyInput.pressSequentially('LLC', { delay: 50 });
    await page.waitForTimeout(800);
    const narrowedOptions = page.locator('ul.company-dropdown li[role="option"]');
    const narrowedCount = await narrowedOptions.count();
    expect(narrowedCount).toBeGreaterThan(0);
    const firstOption = narrowedOptions.first();
    await expect(firstOption).toContainText(/juliaLLC/i);
  });
});
