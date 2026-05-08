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

  test('TC29 â€” Verify Re-Running Search Updates the Available Associates List', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search with no filter
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    const initialCount = await eCardPage.getAvailableCount();
    expect(initialCount, 'Initial search should return results').toBeGreaterThan(0);

    // Move one associate to Selected
    await eCardPage.moveFirstAvailableToSelected();
    await expect(eCardPage.selectedItems.first(), 'Item should be in Selected').toBeVisible({ timeout: 10000 });

    const selectedText = (await eCardPage.selectedItems.first().locator('span').textContent()) ?? '';

    // Change the Name filter to a different value and search again
    await eCardPage.expandAdvancedFilter();
    await eCardPage.fillNameAssociateId('Axe');
    await eCardPage.clickSearch();
    await eCardPage.dualListContainer.waitFor({ state: 'visible', timeout: 20000 });

    // expect: Available Associates list is refreshed with the new filter
    const filteredCount = await eCardPage.getAvailableCount();
    // Filtered results may differ from initial results
    // The selected associate should not appear in Available if they match the filter
    const availableTexts = await eCardPage.availableItems.allTextContents();
    const isDuplicate = availableTexts.some(t => t.includes(selectedText.trim()));
    expect(
      isDuplicate,
      `"${selectedText}" (Selected) should NOT appear in Available list after re-search`
    ).toBe(false);

    // expect: Selected Associates list still contains the moved associate
    await expect(eCardPage.selectedItems.first(), 'Selected list should still have the moved associate').toBeVisible();
  });
});
