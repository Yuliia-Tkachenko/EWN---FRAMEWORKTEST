// Seed/setup file for ITEM-5835 eCard Data Export tests
// Verifies login and correct URL for the eCard Data Export page

import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';

test('seed ecard page', async ({ page }) => {
  const config = new TestConfig();
  const loginPage = new LoginPage(page);
  await loginPage.login(config.validUsername1, config.validPassword1);
  await page.waitForURL('**/legacy/**', { timeout: 15000 });
  // The actual URL is /legacy/CardDataExport (not ECardDataExport)
  await page.goto(ECardDataExportPage.URL);
});
