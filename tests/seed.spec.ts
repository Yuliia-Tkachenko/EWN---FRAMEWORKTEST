import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestConfig } from '../test.config';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    const config = new TestConfig();
    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername1, config.validPassword1);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');
    await page.goto('/legacy/LoginStatistics');
    await page.waitForLoadState('domcontentloaded');

    // Type into company input and select NTC
    const companyInput = page.locator('input[uib-typeahead]');
    await companyInput.click();
    await companyInput.pressSequentially('NTC');
    const dropdown = page.locator('ul[uib-typeahead-popup][role="listbox"]');
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });
    const ntcOption = page.locator('ul[uib-typeahead-popup][role="listbox"] li').filter({ hasText: 'NTC' }).first();
    await ntcOption.click();
    await page.waitForTimeout(2000);

    // Check dual list section HTML
    const dualListHTML = await page.evaluate(() => {
      const dl = document.querySelector('[aria-label="Available Employees"]');
      return dl?.innerHTML?.substring(0, 3000) ?? 'not found';
    });
    console.log('=== Dual list available panel HTML ===');
    console.log(dualListHTML);

    // Check multiselect dropdown HTML when opened
    const facilityBtn = page.locator('button#facilities');
    await facilityBtn.click();
    await page.waitForTimeout(500);

    const multiSelectHTML = await page.evaluate(() => {
      const ms = document.querySelector('.multi-select-dropdown__toggle[aria-expanded="true"]')?.parentElement;
      return ms?.innerHTML?.substring(0, 3000) ?? 'not found';
    });
    console.log('=== Multi-select dropdown open HTML ===');
    console.log(multiSelectHTML);
  });
});
