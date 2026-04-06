import { Page, Locator, expect } from "@playwright/test";

export class ConditionUsageReportPage {
    private readonly page: Page;

//Locators
private readonly HeaderConditionUsageReport: Locator;
private readonly dropdownAccount: Locator;
private readonly dropdownTaskList: Locator;
private readonly checkboxIncludeInactive: Locator;
private readonly ConnectedCompanies: Locator;
private readonly RunReport: Locator;


constructor(page: Page) {
    this.page = page;

    this.HeaderConditionUsageReport=page.getByRole('heading', { name: 'Condition Usage Report' });
    this.dropdownAccount=page.locator('#uxDdlCompanies');
    this.dropdownTaskList=page.locator('#uxDdlTaskLists');
    this.checkboxIncludeInactive=page.getByRole('checkbox', { name: 'Include Inactive Users:' });
    this.ConnectedCompanies=page.getByLabel('Connected Companies:');
    this.RunReport=page.getByRole('button', { name: 'Run Report' });

};
}