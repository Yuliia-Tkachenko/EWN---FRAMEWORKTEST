// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Company Selection', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(60000);
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername1, config.validPassword1);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('TC06 â€” Verify Change Link Triggers Validation UI (Red Label + Border + Required Text)', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select a company, then click the "Change" link
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');

    // Verify change link is present before clicking
    await expect(eCardPage.changeLink, 'Change link should be visible').toBeVisible();

    // Click the Change link
    await eCardPage.changeLink.click();

    // expect: The company input field reappears (input is now shown again)
    await expect(eCardPage.companySearchInput, 'Company input should be visible after Change').toBeVisible();

    // expect: The Select Company label turns red (has-error class on the form-group)
    await expect(eCardPage.highlightErrorDiv, 'Company form group should get has-error class').toHaveClass(/has-error/);

    // expect: A "Required" validation message in red appears below the input
    await expect(eCardPage.companyValidationError, 'Required validation message should be visible').toBeVisible();
    await expect(eCardPage.companyValidationError).toContainText(/required/i);

    // expect: The spinner disappears without a page reload (page URL unchanged)
    await expect(page).toHaveURL(/CardDataExport/);
  });
});
