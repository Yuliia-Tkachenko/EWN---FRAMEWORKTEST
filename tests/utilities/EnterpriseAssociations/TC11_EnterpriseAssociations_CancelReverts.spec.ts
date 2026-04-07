//Test created by AI

/*
TC-11 — Enterprise Associations: Cancel Reverts to Last Saved State

Preconditions: Navigate to Enterprise Associations page; select a company and wait for both panels to load

Step 1 | Click the first item in Available Companies, then click the → button | Item moves to Associated panel
Step 2 | Click the Cancel button | "Please wait…" overlay appears; Save, Cancel, dropdown, move-right, and move-left are all disabled
Step 3 | Wait for cancel reload to complete | Overlay disappears
Step 4 | Check the Available Companies panel | The previously moved item is back in the Available panel (reverted to server state)
Step 5 | Open DevTools → Network tab, repeat steps 1–2, observe API calls | Both GET available-companies and GET associated-companies requests are fired
*/

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { TestConfig } from '../../../test.config';
import { EnterpriseAssociationsPage } from '../../../pages/utilities/EnterpriseAssociations';

test.describe.configure({ mode: 'serial' });

test.describe('TC-11 — Enterprise Associations: Cancel Reverts to Last Saved State', () => {
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

  // Step 2: Click Cancel → overlay appears and all controls are disabled
  test('"Please wait…" overlay appears and all controls are disabled after clicking Cancel', async () => {
    await page.route('**/api/available-companies**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });
    await page.route('**/api/associated-companies**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });

    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompanyAndWait();
    await enterprisePage.moveFirstItemToAssociatedWithoutWait();
    await enterprisePage.clickCancel();
    await enterprisePage.expectLoadingOverlayVisible();
    await enterprisePage.expectAllControlsDisabled();
  });

  // Step 3: Overlay disappears after cancel reload
  test('Loading overlay disappears after cancel reload completes', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompanyAndWait();
    await enterprisePage.moveFirstItemToAssociatedWithoutWait();
    await enterprisePage.clickCancel();
    await enterprisePage.expectLoadingOverlayHidden();
  });

  // Step 4: Panels restore to server state after cancel
  test('Both panels reload to last saved server state after cancel', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompanyAndWait();

    const movedItemName = await enterprisePage.getFirstAvailableItemName();

    await enterprisePage.moveFirstItemToAssociatedWithoutWait();
    await enterprisePage.clickCancel();
    await enterprisePage.expectLoadingOverlayHidden();

    await enterprisePage.expectAvailableItemVisible(movedItemName);
  });

  // Step 5: Both GET endpoints are called on cancel
  test('Both available-companies and associated-companies are called on cancel', async () => {
    const reloadedEndpoints: string[] = [];

    page.on('request', (request) => {
      const url = request.url();
      if (request.method() === 'GET') {
        if (url.includes('available-companies')) reloadedEndpoints.push('available-companies');
        if (url.includes('associated-companies')) reloadedEndpoints.push('associated-companies');
      }
    });

    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompanyAndWait();
    reloadedEndpoints.length = 0;

    await enterprisePage.moveFirstItemToAssociatedWithoutWait();
    await enterprisePage.clickCancel();
    await enterprisePage.expectLoadingOverlayHidden();

    expect(reloadedEndpoints).toContain('available-companies');
    expect(reloadedEndpoints).toContain('associated-companies');
  });
});
