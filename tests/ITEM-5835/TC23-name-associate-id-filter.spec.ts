// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts
// XRAY: XRAY-5331 (regression guard: no extra leading/trailing space)

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Advanced Employee Filter', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(90000);
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername1, config.validPassword1);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('TC23 â€” Verify "Name / Associate ID" Accepts Text Entry and Applies It to Search', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, expand Advanced Filter
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.expandAdvancedFilter();

    // Type a partial name fragment in Name / Associate ID field
    const searchName = 'Axe';
    await eCardPage.fillNameAssociateId(searchName);

    // Regression: XRAY-5331 â€” verify no leading/trailing whitespace is added
    const inputValue = await eCardPage.nameAssociateIdInput.inputValue();
    expect(inputValue, 'Input value should match exactly with no extra whitespace').toBe(searchName);
    expect(inputValue.trim(), 'No leading/trailing space should be added to input').toBe(searchName);

    // Click Search
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // expect: Available Associates list contains only rows matching 'Axe'
    await eCardPage.expectAvailableListHasItems();
    const firstRowText = await eCardPage.getFirstAvailableText();
    expect(firstRowText, 'First result should contain the searched name fragment').toContain('Axe');

    // Step 2: Clear the field and type an EWN ID number, then search
    await eCardPage.fillNameAssociateId('');
    const ewnId = '215020';
    await eCardPage.fillNameAssociateId(ewnId);
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // expect: Results are filtered to matching associate(s)
    await eCardPage.expectAvailableListHasItems();
  });
});
