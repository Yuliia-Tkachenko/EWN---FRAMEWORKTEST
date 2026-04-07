//Test created by AI

/*
TC-05 — Enterprise Associations: Selecting a Company Loads Both Panels

Preconditions: Navigate to Enterprise Associations page

Step 1 | Select any company from the dropdown | "Please wait…" loading overlay appears
Step 2 | While overlay is visible, check transfer buttons | Move-right and Move-left buttons are disabled
Step 3 | While overlay is visible, check the dropdown | Company dropdown is disabled
Step 4 | Wait for loading to finish | Overlay disappears; Available Companies and Associated Companies panels are both visible and populated
Step 5 | Check panel headers | Left panel reads "Available Companies"; right panel reads "Associated Companies"
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { TestConfig } from '../../../test.config';
import { EnterpriseAssociationsPage } from '../../../pages/utilities/EnterpriseAssociations';

test.describe.configure({ mode: 'serial' });

test.describe('TC-05 — Enterprise Associations: Selecting a Company Loads Both Panels', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();

    // Delay both panel API calls so the loading overlay is reliably visible
    await page.route('**/api/available-companies**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });
    await page.route('**/api/associated-companies**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });

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

  // Step 1: Select any company → loading overlay appears
  test('"Please wait…" loading overlay appears after selecting a company', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.expectCompanyDropdownVisible();
    await enterprisePage.selectFirstCompany();
    await enterprisePage.expectLoadingOverlayVisible();
  });

  // Step 2: While overlay is visible, transfer buttons are disabled
  test('Transfer buttons are disabled while loading', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompany();
    await enterprisePage.expectLoadingOverlayVisible();
    await enterprisePage.expectMoveRightDisabled();
    await enterprisePage.expectMoveLeftDisabled();
  });

  // Step 3: While overlay is visible, dropdown is disabled
  test('Dropdown is disabled while loading', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompany();
    await enterprisePage.expectLoadingOverlayVisible();
    await enterprisePage.expectCompanyDropdownDisabled();
  });

  // Step 4: After load completes, overlay disappears and both panels have data
  test('Loading overlay disappears and both panels populate after load', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompany();
    await enterprisePage.expectLoadingOverlayHidden();
    await enterprisePage.expectBothPanelsVisible();
    await enterprisePage.expectAvailableListboxHasItems();
  });

  // Step 5: Panel headers read "Available Companies" and "Associated Companies"
  test('Panel headers display "Available Companies" and "Associated Companies"', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompany();
    await enterprisePage.expectLoadingOverlayHidden();
    await enterprisePage.expectPanelHeaderTitles();
  });
});
