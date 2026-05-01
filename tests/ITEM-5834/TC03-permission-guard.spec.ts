// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC03 — Permission guard: user without IsnManualUpload.View is denied', () => {
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

  test.fixme(
    'TC03: user without IsnManualUpload.View sees access denied — needs a restricted test account in TestConfig',
    async () => {
      // TODO: Add a user account without IsnManualUpload.View permission to TestConfig,
      // then implement the login + navigation + access-denied assertion here.
      //
      // Expected:
      //   - User is redirected away from /legacy/IsnManualExport
      //   - OR an access-denied / 403 message is displayed
      //   - The ISN Manual Export form is NOT rendered
    }
  );
});
