//Test created by AI

/*
TC-09 — Enterprise Associations: Save Success

Preconditions: Navigate to Enterprise Associations page; select a company and wait for both panels to load

Step 1 | Click the first item in Available Companies, then click the → button | Item appears in the Associated Companies panel
Step 2 | Click the Save button | "Please wait…" overlay appears; Save, Cancel, dropdown, move-right, and move-left are all disabled
Step 3 | Wait for save to complete | Overlay disappears
Step 4 | Check toast notification | A success toast appears with message "Associations saved successfully"
Step 5 | Check both panels | Both panels are still visible and populated
Step 6 | Reload the page and reselect the same company | Associated Companies panel still shows the saved data
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { EnterpriseAssociationsPage } from '../../pages/utilities/EnterpriseAssociations';

test.describe.configure({ mode: 'serial' });

test.describe('TC-09 — Enterprise Associations: Save Success', () => {
  let context: BrowserContext;
  let page: Page;

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

  test.beforeEach(async () => {
    await page.goto('/legacy/EnterpriseAssociations');
    await page.waitForLoadState('domcontentloaded');
  });

  // Step 1: Move item to Associated panel
  test('Moving a company to Associated panel updates the panel immediately', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompanyAndWait();
    await enterprisePage.moveFirstItemToAssociated();
    await enterprisePage.expectAssociatedListboxHasItems();
  });

  // Step 2: Click Save → overlay appears and all controls are disabled
  test('Clicking Save shows loading overlay and disables all controls', async () => {
    await page.route('**/api/associated-companies**', async (route) => {
      if (route.request().method() === 'PUT') {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      await route.continue();
    });

    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompanyAndWait();
    await enterprisePage.moveFirstItemToAssociated();
    await enterprisePage.clickSave();
    await enterprisePage.expectLoadingOverlayVisible();
    await enterprisePage.expectAllControlsDisabled();
  });

  // Step 3 + 4: Overlay disappears and success toast appears
  test('Success toast appears with correct message after save completes', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompanyAndWait();
    await enterprisePage.moveFirstItemToAssociated();
    await enterprisePage.clickSave();
    await enterprisePage.expectLoadingOverlayHidden();
    await enterprisePage.expectSuccessToastVisible();
    await enterprisePage.expectSuccessToastText('Associations saved successfully');
  });

  // Step 5: Both panels remain visible and populated after save
  test('Dual list reflects saved state after successful save', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompanyAndWait();
    await enterprisePage.moveFirstItemToAssociated();
    await enterprisePage.clickSave();
    await enterprisePage.expectLoadingOverlayHidden();
    await enterprisePage.expectBothPanelsVisible();
    await enterprisePage.expectAssociatedListboxHasItems();
  });

  // Step 6: Saved associations persist after page reload
  test('Saved associations persist after page reload', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompanyAndWait();
    await enterprisePage.moveFirstItemToAssociated();
    await enterprisePage.clickSave();
    await enterprisePage.expectLoadingOverlayHidden();
    await enterprisePage.expectSuccessToastVisible();

    await page.reload();
    await page.waitForLoadState('networkidle');

    await enterprisePage.selectFirstCompanyAndWait();
    await enterprisePage.expectAssociatedListboxHasItems();
  });
});
