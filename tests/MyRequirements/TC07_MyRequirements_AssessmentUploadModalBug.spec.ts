// spec: TC-07-7696 — Assessment Upload Progress Modal closes after submission
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext, type ConsoleMessage } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { MyRequirementsPage } from '../../pages/myRequirements/MyRequirementsPage';
import { AssessmentPage } from '../../pages/AssessmentPage';

test.describe.configure({ mode: 'serial', timeout: 180_000 });

const EVALUATION_ID = '120453';

test.describe('TC-07-7696 — Assessment Upload Progress Modal closes after submission', () => {
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

  async function navigateToAssessment(myReqPage: MyRequirementsPage): Promise<void> {
    const assessmentPage = new AssessmentPage(page);
    await assessmentPage.injectSEBContext();

    await myReqPage.navigateDirectly();

    await myReqPage.openEvalStatusDropdown();
    await myReqPage.selectAllEvalStatuses();
    await myReqPage.closeEvalStatusDropdown();
    await myReqPage.clickSearch();
    await myReqPage.waitForResultsToLoad();

    await myReqPage.findAndClickLaunchIcon(EVALUATION_ID);

    await myReqPage.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

    if (!myReqPage.page.url().includes('Assessment')) {
      await myReqPage.clickLaunchExamButton();

      const attentionModal = myReqPage.page.locator('.modal').filter({ hasText: /attention/i });
      const modalVisible = await attentionModal.waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true).catch(() => false);

      if (modalVisible) {
        await myReqPage.clickYesInAttentionModal();
        await myReqPage.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
        await myReqPage.clickLaunchExamButton();
      }
    }

    await myReqPage.waitForAssessmentNavigation();
  }

  test('TC07: upload modal closes automatically after Submit Answers and page is interactive', async () => {
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

    // Modal closes automatically once the submit promise resolves (may flash too fast to catch opening)
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
