//Test created by AI

/*
TC-07 — My Requirements: Assessment Upload Progress Modal Stuck on Submission

Bug: BTC-01 — Upload Progress Modal does not close after Assessment submission
Root cause: TypeError: n.then is not a function  (assessmentContentController.ts:305)
            ewnModal.upload({ promise, indeterminate: true }) — the resolved object has no .then()

Preconditions: User is logged in

Step 1 | Open Evaluation Status dropdown → select "Select ALL" → click Search
Step 2 | In results find evaluation 120453 "CBT English + Spanish" → click Launch icon (blue square) → lands on Launch detail page
Step 3 | Click "Launch Exam" → confirm Attention modal if shown → click "Launch Exam" again → assessment opens
Step 4 | Select "True" (option a)
Step 5 | Click "Submit Answers"
Step 6 | Verify the "Uploading" progress modal behaviour
*/
/*

After release :

Test 1 will break once the fix is deployed. It explicitly asserts the buggy behaviour:

expectUploadModalRemainsOpen() — waits 10 s then asserts the modal is still visible. After the fix the modal will have closed by then → fails.
thenError console assertion — asserts n.then is not a function is present. After the fix that TypeError won't exist → fails.
expectModalBackdropVisible() / isInteractionBlocked() — both rely on the backdrop being stuck. After the fix the backdrop will be gone → fails.
Test 1 is a pure bug-reproduction test. Its job is to document and prove the bug is there. Once the fix ships it becomes a liability — it will flip from passing to failing.

What to do when the fix is deployed:

Delete Test 1 entirely (Test 2 already covers correct behaviour end-to-end)
Remove test.fail() from Test 2 so it becomes a green regression guard going forward

*/

import { test, expect, type Page, type BrowserContext, type ConsoleMessage } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { MyRequirementsPage } from '../../pages/myRequirements/MyRequirementsPage';
import { AssessmentPage } from '../../pages/AssessmentPage';

test.describe.configure({ mode: 'serial', timeout: 180_000 });

const EVALUATION_ID = '120453';

test.describe('TC-07-7696 — Assessment Upload Progress Modal Stuck on Submission', () => {
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

  // Shared navigation: My Requirements → search → Launch detail → Launch Exam → assessment
  async function navigateToAssessment(myReqPage: MyRequirementsPage): Promise<void> {
    // Inject SEB context before any navigation so it is available when the assessment page loads.
    // Required for Firefox (and as a safety net for Chromium) — the assessment app checks for
    // window.SafeExamBrowser and redirects to login if it is absent.
    const assessmentPage = new AssessmentPage(page);
    await assessmentPage.injectSEBContext();

    // Hard navigate to clear any modal left by a previous test
    await myReqPage.navigateDirectly();

    // Step 1: Search with all evaluation statuses selected
    await myReqPage.openEvalStatusDropdown();
    await myReqPage.selectAllEvalStatuses();
    await myReqPage.closeEvalStatusDropdown();
    await myReqPage.clickSearch();
    await myReqPage.waitForResultsToLoad();

    // Step 2: Click the launch icon — navigates to the Launch detail page
    await myReqPage.findAndClickLaunchIcon(EVALUATION_ID);

    // Wait for the Launch detail page to fully render before we try to click Launch Exam
    await myReqPage.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

    // Step 3: Click Launch Exam (Playwright locator polling triggers AngularJS digest cycles)
    if (!myReqPage.page.url().includes('Assessment')) {
      await myReqPage.clickLaunchExamButton();

      // Wait up to 8 s for the Attention modal via locator (DOM polling keeps AngularJS alive)
      const attentionModal = myReqPage.page.locator('.modal').filter({ hasText: /attention/i });
      const modalVisible = await attentionModal.waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true).catch(() => false);

      if (modalVisible) {
        await myReqPage.clickYesInAttentionModal();
        // Page re-renders after modal closes — wait before the second click
        await myReqPage.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
        await myReqPage.clickLaunchExamButton();
      }
    }

    // Wait for the assessment page URL
    await myReqPage.waitForAssessmentNavigation();
  }

  // ── Test 1: Bug reproduction — modal appears and NEVER closes ──────────────
  test('7696 — modal appears on Submit Answers and NEVER closes — bug reproduced', async () => {
    const consoleErrors: string[] = [];
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const myReqPage = new MyRequirementsPage(page);
    await navigateToAssessment(myReqPage);

    const assessmentPage = new AssessmentPage(page);
    await assessmentPage.expectAssessmentLoaded();

    // Step 4: Select True (option a)
    await assessmentPage.selectTrueAnswer();

    // Step 5: Submit
    await assessmentPage.clickSubmit();

    // Step 6a: Upload modal appears immediately after submit
    await assessmentPage.expectUploadModalVisible();

    // Step 6b (BUG): Modal stays open — does NOT close within 10 s.
    // Flip to expectUploadModalHidden() once the fix is deployed.
    await assessmentPage.expectUploadModalRemainsOpen();

    // Step 6c: A console error is captured after submit.
    // Chromium reports the full "TypeError: n.then is not a function";
    // Firefox surfaces the same failure as a generic "Error".
    // The modal being stuck (proven above) is the primary bug evidence;
    // here we just confirm at least one error was logged.
    const hasConsoleError = consoleErrors.some(e =>
      e.includes('then is not a function') ||
      e.includes('is not a function') ||
      e.trim().toLowerCase() === 'error'
    );
    expect(
      hasConsoleError,
      `Expected a console error after submit.\nAll errors:\n${consoleErrors.join('\n')}`
    ).toBe(true);

    // Step 6d: Backdrop is present — user interaction is blocked
    await assessmentPage.expectModalBackdropVisible();
    expect(await assessmentPage.isInteractionBlocked()).toBe(true);
  });

  // ── Test 2: Regression guard — expected behaviour after the fix ────────────
  test('7696 — modal closes automatically when bug is FIXED', async () => {
    // Defines correct post-fix behaviour.
    // FAILS on the buggy build (test.fail marks this as an intentional/expected failure).

    // Remove test.fail() once the fix is deployed — the test should then pass.
    test.fail();
    const consoleErrors: string[] = [];
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const myReqPage = new MyRequirementsPage(page);
    await navigateToAssessment(myReqPage);

    const assessmentPage = new AssessmentPage(page);
    await assessmentPage.expectAssessmentLoaded();

    await assessmentPage.selectTrueAnswer();
    await assessmentPage.clickSubmit();

    // Modal must open …
    await assessmentPage.expectUploadModalVisible();

    // … then auto-close once the submit promise resolves
    await assessmentPage.expectUploadModalHidden();

    // No TypeError in console
    const thenError = consoleErrors.find(e => e.includes('then is not a function'));
    expect(thenError, `Unexpected TypeError still present: ${thenError}`).toBeUndefined();

    // Backdrop gone — page is interactive
    await assessmentPage.expectModalBackdropHidden();

    // Results section is accessible
    await assessmentPage.expectResultsVisible();
  });
});
