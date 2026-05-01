// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC09 — Negative: no company match returns empty or no dropdown', () => {
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

  test('TC09: typing a nonexistent company name yields no dropdown results', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to the ISN Manual Export page
    await report.navigateTo();

    // Step 2: Type a nonsense string into the company search input
    const companyInput = page.locator('#txtCompany');
    await companyInput.waitFor({ state: 'visible', timeout: 10000 });
    await companyInput.click();
    await companyInput.pressSequentially('ZZZNONEXISTENTCOMPANY999', { delay: 50 });

    // Step 3: Wait a moment for any potential dropdown to appear
    await page.waitForTimeout(2000);

    // Step 4: Verify no dropdown options are visible (dropdown absent or empty)
    const dropdown = page.locator('ul.company-dropdown');
    const isDropdownVisible = await dropdown.isVisible();
    if (isDropdownVisible) {
      const options = page.locator('ul.company-dropdown li[role="option"]');
      const count = await options.count();
      expect(count).toBe(0);
    } else {
      expect(isDropdownVisible).toBe(false);
    }

    // Step 5: Verify no JavaScript error or crash occurred — input is still visible
    await expect(companyInput).toBeVisible();
    await report.expectDualListNotVisible();
  });
});
