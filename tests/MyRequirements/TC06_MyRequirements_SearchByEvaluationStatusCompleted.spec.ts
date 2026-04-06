//Test created by AI

/*
TC-06 — My Requirements: Search by Evaluation Status — Completed

Preconditions: User is logged in; navigate to My Requirements page

Step 1 | Confirm Requirements View is set to "Evaluation View" | Dropdown value is "E"
Step 2 | Open Evaluation Status multi-select | Dropdown opens
Step 3 | Deselect all current selections | All options unchecked (0 checked icons)
Step 4 | Select only "Completed" | Exactly 1 option checked
Step 5 | Close dropdown and click Search | Results load
Step 6 | Inspect results | Only Completed (green) icons visible; no ExpiringSoon, Expired/NotCompleted, or Suspended icons
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { MyRequirementsPage } from '../../pages/myRequirements/MyRequirementsPage';

test.describe.configure({ mode: 'serial' });

test.describe('TC-06 — My Requirements: Search by Evaluation Status Completed', () => {
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

  test.beforeEach(async () => {
    const myRequirementsPage = new MyRequirementsPage(page);
    await myRequirementsPage.navigateTo();
  });

  // Steps 1–6: Full search flow — only Completed results returned
  test('only Completed evaluations are returned when Completed status is selected', async () => {
    const myRequirementsPage = new MyRequirementsPage(page);

    // Step 1: Confirm Evaluation View is selected
    await myRequirementsPage.expectEvaluationViewSelected();

    // Step 2: Open Evaluation Status multi-select
    await myRequirementsPage.openEvalStatusDropdown();

    // Step 3: Deselect all
    await myRequirementsPage.deselectAllEvalStatuses();
    await myRequirementsPage.expectEvalStatusNoneSelected();

    // Step 4: Select only Completed
    await myRequirementsPage.selectEvalStatusOption('Completed');
    await myRequirementsPage.expectEvalStatusToggleShowsLabel('Completed');

    // Step 5: Close and search
    await myRequirementsPage.closeEvalStatusDropdown();
    await myRequirementsPage.clickSearch();
    await myRequirementsPage.waitForResultsToLoad();

    // Step 6: Assert results
    await myRequirementsPage.expectResultsHeaderVisible();

    const noResults = await myRequirementsPage.expectNoResultsFound();
    if (noResults) {
      await myRequirementsPage.expectNoResultsMessageVisible();
      return;
    }

    await myRequirementsPage.expectCompletedIconsPresent();
    await myRequirementsPage.expectExpiringSoonIconsAbsent();
    await myRequirementsPage.expectExpiredOrNotCompletedIconsAbsent();
    await myRequirementsPage.expectSuspendedIconsAbsent();
  });

  // Completed option becomes checked after selection
  test('Completed option becomes checked in multi-select after selection', async () => {
    const myRequirementsPage = new MyRequirementsPage(page);

    await myRequirementsPage.openEvalStatusDropdown();
    await myRequirementsPage.deselectAllEvalStatuses();
    await myRequirementsPage.selectEvalStatusOption('Completed');

    await myRequirementsPage.expectCompletedOptionChecked();
  });
});
