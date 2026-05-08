// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Search', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(90000);
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

  test('TC30 â€” Verify Selected Associates Are Excluded from Available List (No Duplicates)', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // Get the first available associate's text before moving
    const firstAssociateName = await eCardPage.getFirstAvailableText();
    expect(firstAssociateName, 'First associate text should not be empty').toBeTruthy();

    // Move the first available associate to Selected
    await eCardPage.moveFirstAvailableToSelected();
    await expect(eCardPage.selectedItems.first(), 'Associate should appear in Selected list').toBeVisible({ timeout: 10000 });

    // Verify the moved associate is in the Selected list
    const selectedText = await eCardPage.selectedItems.first().locator('span').textContent();
    expect(selectedText?.trim(), 'Moved associate should be in Selected list').toBe(firstAssociateName.trim());

    // Search again (re-run search)
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // expect: The moved associate does NOT appear in Available Associates after re-search
    const availableTexts = await eCardPage.availableItems.allTextContents();
    const isDuplicate = availableTexts.some(text => text.includes(firstAssociateName.trim()));
    expect(isDuplicate, `"${firstAssociateName}" should NOT appear in Available list after being moved to Selected`).toBe(false);

    // expect: The associate remains in the Selected list
    await expect(eCardPage.selectedItems.first(), 'Associate should remain in Selected list after re-search').toBeVisible();
  });
});
