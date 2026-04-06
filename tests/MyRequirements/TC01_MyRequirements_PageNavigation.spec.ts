//Test created by AI

/*
TC-01 — My Requirements: Page Navigation

Preconditions: User is logged in

Step 1 | Click "My Requirements" in the left sidebar under MY TOOLBOX | Page loads with the header "My Requirements", Search tab is active by default,
Launch tab is hidden
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { MyRequirementsPage } from '../../pages/myRequirements/MyRequirementsPage';

test.describe.configure({ mode: 'serial' });

test.describe('TC-01 — My Requirements: Page Navigation', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername, config.validPassword);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await context.close();
  });

  // Step 1: Click sidebar link → page loads correctly
  test('clicking "My Requirements" in the sidebar loads the page correctly', async () => {
    const myRequirementsPage = new MyRequirementsPage(page);

    await myRequirementsPage.expectSidebarLinkVisible();
    await myRequirementsPage.navigateTo();

    await myRequirementsPage.expectUrlContainsMyRequirements();
    await myRequirementsPage.expectPageHeaderVisible();
    await myRequirementsPage.expectPageHeaderText();
    await myRequirementsPage.expectSearchTabVisible();
    await myRequirementsPage.expectSearchTabActive();
    await myRequirementsPage.expectLaunchTabHidden();
  });
});
