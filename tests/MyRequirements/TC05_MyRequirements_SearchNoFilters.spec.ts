//Test created by AI

/*
TC-05 — My Requirements: Search with No Filters (Evaluation View)

Preconditions: User is logged in; navigate to My Requirements page

Step 1 | Confirm Requirements View defaults to "Evaluation View" | Dropdown value is "E"
Step 2 | Click Search with no filters changed | Results load; Export button and icon legend are visible; results table is populated or shows "No results returned"
Step 3 | Re-click Search | Results reload and table is populated or shows "No results returned"
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { MyRequirementsPage } from '../../pages/myRequirements/MyRequirementsPage';

test.describe.configure({ mode: 'serial' });

test.describe('TC-05 — My Requirements: Search with No Filters', () => {
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
    await page.goto('/legacy/MyRequirements');
    await page.waitForLoadState('domcontentloaded');
  });

  // Step 1–2: Search with no filters shows results or no-results, export button and legend visible
  test('clicking Search with no filters shows results or no-results message', async () => {
    const myRequirementsPage = new MyRequirementsPage(page);

    // Step 1: Confirm Evaluation View is active
    await myRequirementsPage.expectEvaluationViewSelected();

    // Step 2: Click Search with defaults
    await myRequirementsPage.clickSearch();
    await myRequirementsPage.waitForResultsToLoad();

    // Results header appears
    await myRequirementsPage.expectResultsHeaderVisible();

    // Results table is rendered
    await myRequirementsPage.expectResultsTableVisible();

    // Export To button is visible
    await myRequirementsPage.expectExportToButtonVisible();

    // Icon legend is visible
    await myRequirementsPage.expectIconLegendVisible();

    // Either data rows OR a "No Results" message is shown
    await myRequirementsPage.expectResultsOrNoResults();

    // If data rows exist, check first row has a status icon
    if (await myRequirementsPage.hasDataRows()) {
      await myRequirementsPage.expectFirstRowHasStatusIcon();
    } else {
      await myRequirementsPage.expectNoResultsFound();
    }
  });

  // Step 3: Re-clicking Search reloads results
  test('results table is populated after clicking Search again', async () => {
    const myRequirementsPage = new MyRequirementsPage(page);

    await myRequirementsPage.waitForResultsToLoad();

    await myRequirementsPage.clickSearch();
    await myRequirementsPage.waitForResultsToLoad();

    await myRequirementsPage.expectResultsTableVisible();
    await myRequirementsPage.expectResultsOrNoResults();
  });
});
