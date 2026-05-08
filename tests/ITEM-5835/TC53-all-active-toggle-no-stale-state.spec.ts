// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Edge Cases & Negative Scenarios', () => {
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

  test('TC53 â€” Verify Checking "All Active Employees" Then Unchecking Does Not Show Stale Selected Associates', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search, move 3 associates to Selected
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    // Move up to 3 associates to Selected
    const availableCount = await eCardPage.getAvailableCount();
    const itemsToMove = Math.min(3, availableCount);

    for (let i = 0; i < itemsToMove; i++) {
      await eCardPage.moveFirstAvailableToSelected();
      await expect(eCardPage.selectedItems, 'Selected list count should increase').toHaveCount(i + 1, { timeout: 10000 });
    }

    const selectedItemsText: string[] = [];
    const selectedCount = await eCardPage.getSelectedCount();
    for (let i = 0; i < selectedCount; i++) {
      const text = (await eCardPage.selectedItems.nth(i).locator('span').textContent()) ?? '';
      selectedItemsText.push(text.trim());
    }

    // Check "All Active Employees" â€” dual list hides
    await eCardPage.checkAllActiveEmployees();
    await expect(eCardPage.dualListContainer, 'Dual list should be hidden when All Active is checked').toBeHidden();

    // Uncheck "All Active Employees"
    await eCardPage.uncheckAllActiveEmployees();

    // expect: The dual list reappears
    await expect(eCardPage.dualListContainer, 'Dual list should reappear after unchecking All Active').toBeVisible();

    // expect: The previously selected associates are still in the Selected Associates list
    await expect(
      eCardPage.selectedItems,
      `Selected Associates should still have ${selectedCount} item(s) after toggle`
    ).toHaveCount(selectedCount, { timeout: 10000 });

    // Verify specific items are still in Selected
    for (const text of selectedItemsText) {
      const selectedTexts = await eCardPage.selectedItems.allTextContents();
      expect(
        selectedTexts.some(t => t.includes(text)),
        `"${text}" should still be in Selected Associates after toggle`
      ).toBe(true);
    }

    // expect: No duplicates appear in Available that are already in Selected
    const availableTexts = await eCardPage.availableItems.allTextContents();
    for (const text of selectedItemsText) {
      const isDuplicate = availableTexts.some(t => t.includes(text));
      expect(
        isDuplicate,
        `"${text}" should NOT appear in Available Associates (it is already in Selected)`
      ).toBe(false);
    }
  });
});
