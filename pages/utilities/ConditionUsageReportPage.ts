import { Page, Locator, expect } from "@playwright/test";

export class ConditionUsageReportPage {
    private readonly page: Page;

    // Locators
    private readonly headerConditionUsageReport: Locator;
    private readonly dropdownAccount: Locator;
    private readonly checkboxIncludeInactive: Locator;
    private readonly runReportButton: Locator;
    private readonly generatingReportText: Locator;

    constructor(page: Page) {
        this.page = page;

        this.headerConditionUsageReport = page.getByRole('heading', { name: 'Condition Usage Report' });
        this.dropdownAccount         = page.locator('#uxDdlCompanies');
        this.checkboxIncludeInactive = page.getByRole('checkbox', { name: 'Include Inactive Users:' });
        this.runReportButton         = page.getByRole('button', { name: 'Run Report' });
        this.generatingReportText       = page.getByText('Generating Report');
    }

    // ── Navigation ──────────────────────────────────────────────────────────

    async navigateTo() {
        await this.page.goto('/legacy/ConditionUsageReport');
        await this.page.waitForLoadState('domcontentloaded');
        await this.headerConditionUsageReport.waitFor({ state: 'visible', timeout: 15000 });
    }

    // ── Actions ──────────────────────────────────────────────────────────────

    async selectCompany(label: string) {
        await expect(this.dropdownAccount).toBeEnabled({ timeout: 15000 });
        await this.dropdownAccount.selectOption({ label });
    }

    async checkIncludeInactive() {
        await expect(this.checkboxIncludeInactive).toBeEnabled();
        await this.checkboxIncludeInactive.check();
    }

    async clickRunReport() {
        await expect(this.runReportButton).toBeVisible();
        await this.runReportButton.click();
    }

    async waitForReportToGenerate() {
        await expect(this.generatingReportText)
            .toBeVisible({ timeout: 5000 })
            .catch(() => {});
        await expect(this.generatingReportText)
            .toBeHidden({ timeout: 90000 })
            .catch(() => {});
    }

    // ── Assertions ───────────────────────────────────────────────────────────

    async expectHeaderVisible() {
        await expect(this.headerConditionUsageReport).toBeVisible();
    }

    async expectRunReportButtonVisible() {
        await expect(this.runReportButton).toBeVisible();
    }

    async expectIncludeInactiveEnabled() {
        await expect(this.checkboxIncludeInactive).toBeEnabled();
    }
}
