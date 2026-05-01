import { Page, expect, Locator } from '@playwright/test';

export class IsnManualExportPage {
    private readonly page: Page;

    // ── Company selection (Vue company-input component) ──────────────────────
    private readonly companySearchInput: Locator;
    private readonly companyDropdownOptions: Locator;
    private readonly selectedCompanyDisplay: Locator;
    private readonly changeLink: Locator;

    // ── AngularJS ewn-dual-list component ────────────────────────────────────
    private readonly dualListContainer: Locator;
    private readonly availablePanel: Locator;
    private readonly selectedPanel: Locator;
    private readonly availableItems: Locator;
    private readonly selectedItems: Locator;
    private readonly moveRightButton: Locator;
    private readonly moveLeftButton: Locator;

    // ── Export button ─────────────────────────────────────────────────────────
    private readonly exportButton: Locator;

    // ── Toast alert (success / error) ────────────────────────────────────────
    private readonly toastAlert: Locator;
    private readonly toastDismissButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Vue company-input — input has id="txtCompany" and role="combobox"
        this.companySearchInput     = page.locator('#txtCompany');
        this.companyDropdownOptions = page.locator('ul.company-dropdown li[role="option"]');
        // After selection, company name shown in p.form-control-static.selected-display
        this.selectedCompanyDisplay = page.locator('p.form-control-static.selected-display');
        // Change link resets the selection
        this.changeLink             = page.locator('a.change-link');

        // AngularJS ewn-dual-list root element
        this.dualListContainer = page.locator('ewn-dual-list');

        // Left (Available) and right (Selected) panels
        this.availablePanel = page.locator('.dual-list-left');
        this.selectedPanel  = page.locator('.dual-list-right');

        // Virtual-scroll items inside each panel (ng-repeat rows)
        this.availableItems = page.locator(
            '.dual-list-left .list-group-item.vs-repeat-repeated-element'
        );
        this.selectedItems = page.locator(
            '.dual-list-right .list-group-item.vs-repeat-repeated-element'
        );

        // Move buttons — rendered as <div> with icon class, inside .move-button-group
        this.moveRightButton = page.locator('.move-button-group .ri-arrow-right-s-line');
        this.moveLeftButton  = page.locator('.move-button-group .ri-arrow-left-s-line');

        // Export to ISN submit button
        this.exportButton = page.locator('button.button-primary');

        // Toast notification (success or error) — appears after export action
        this.toastAlert        = page.locator('div.toast[role="alert"]');
        this.toastDismissButton = page.locator('div.toast button.btn-close');
    }

    // ── Navigation ───────────────────────────────────────────────────────────

    async navigateTo() {
        await this.page.goto('/legacy/IsnManualExport');
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ── Company selection ────────────────────────────────────────────────────

    async selectCompany(name: string) {
        await this.companySearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.companySearchInput.click();
        // pressSequentially triggers the Vue combobox $watch reliably
        await this.companySearchInput.pressSequentially(name, { delay: 50 });
        const dropdown = this.page.locator('ul.company-dropdown');
        await dropdown.waitFor({ state: 'visible', timeout: 15000 });
        const option = this.companyDropdownOptions.filter({ hasText: name }).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        await this.selectedCompanyDisplay.waitFor({ state: 'visible', timeout: 10000 });
    }

    async clickChangeCompany() {
        await this.changeLink.click();
        await this.companySearchInput.waitFor({ state: 'visible', timeout: 10000 });
    }

    async expectCompanySearchInputVisible() {
        await expect(this.companySearchInput).toBeVisible();
    }

    async expectCompanySearchInputNotVisible() {
        await expect(this.companySearchInput).toBeHidden();
    }

    async expectSelectedCompanyDisplayVisible() {
        await expect(this.selectedCompanyDisplay).toBeVisible();
    }

    async expectSelectedCompanyIs(name: string) {
        await expect(this.selectedCompanyDisplay).toContainText(new RegExp(name, 'i'));
    }

    async expectChangeLinkVisible() {
        await expect(this.changeLink).toBeVisible();
    }

    async expectChangeLinkNotVisible() {
        await expect(this.changeLink).toBeHidden();
    }

    // ── Dual list ────────────────────────────────────────────────────────────

    async waitForDualListToLoad() {
        await this.dualListContainer.waitFor({ state: 'visible', timeout: 15000 });
        // The vs-repeat virtual scroll needs the container to have a computed height
        // before it renders items. Scroll the panel to trigger the first render.
        await this.availablePanel.scrollIntoViewIfNeeded();
        await this.availableItems.first().waitFor({ state: 'visible', timeout: 30000 });
    }

    async expectDualListVisible() {
        await expect(this.availablePanel).toBeVisible();
        await expect(this.selectedPanel).toBeVisible();
    }

    async expectDualListNotVisible() {
        await expect(this.dualListContainer).toBeHidden();
    }

    async getAvailableItemsCount(): Promise<number> {
        return await this.availableItems.count();
    }

    async getSelectedItemsCount(): Promise<number> {
        return await this.selectedItems.count();
    }

    async expectAvailableItemsCountGreaterThan(n: number) {
        const count = await this.availableItems.count();
        expect(count).toBeGreaterThan(n);
    }

    async expectSelectedItemsCount(n: number) {
        await expect(this.selectedItems).toHaveCount(n);
    }

    async moveFirstAvailableItemToSelected() {
        const first = this.availableItems.first();
        await first.waitFor({ state: 'visible', timeout: 10000 });
        await first.locator('input[type="checkbox"]').click();
        await this.moveRightButton.click();
        // Wait for the item to appear in the selected panel
        await this.selectedItems.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async moveFirstSelectedItemToAvailable() {
        const first = this.selectedItems.first();
        await first.waitFor({ state: 'visible', timeout: 10000 });
        await first.locator('input[type="checkbox"]').click();
        await this.moveLeftButton.click();
    }

    async expectNoAvailableResults() {
        await this.availablePanel.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.availableItems).toHaveCount(0, { timeout: 10000 });
    }

    // ── Search filters ───────────────────────────────────────────────────────

    async searchAvailableEmployees(text: string) {
        const input = this.page.locator('.dual-list-left input[placeholder="Search"]');
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.fill(text);
    }

    async searchSelectedEmployees(text: string) {
        const input = this.page.locator('.dual-list-right input[placeholder="Search"]');
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.fill(text);
    }

    // ── Export button ─────────────────────────────────────────────────────────

    async clickExportButton() {
        await this.exportButton.click();
    }

    async expectExportButtonVisible() {
        await expect(this.exportButton).toBeVisible();
    }

    async expectExportButtonNotVisible() {
        await expect(this.exportButton).toBeHidden();
    }

    async expectExportButtonEnabled() {
        await expect(this.exportButton).toBeEnabled();
    }

    async expectExportButtonDisabled() {
        await expect(this.exportButton).toBeDisabled();
    }

    // ── Toast alert ──────────────────────────────────────────────────────────

    async expectSuccessAlertVisible() {
        // Wait for the success toast to appear
        const successToast = this.page.locator('div.toast.text-bg-success[role="alert"]');
        await expect(successToast).toBeVisible({ timeout: 15000 });
        await expect(successToast).toContainText(/success|export/i);
    }

    async expectErrorAlertVisible() {
        // Wait for an error toast to appear
        const errorToast = this.page.locator('div.toast.text-bg-danger[role="alert"], div.toast.text-bg-warning[role="alert"]');
        await expect(errorToast).toBeVisible({ timeout: 15000 });
    }

    async expectAlertVisible() {
        await expect(this.toastAlert).toBeVisible({ timeout: 15000 });
    }

    async expectAlertNotVisible() {
        await expect(this.toastAlert).toBeHidden({ timeout: 5000 });
    }

    async dismissAlert() {
        await this.toastDismissButton.click();
        await expect(this.toastAlert).toBeHidden({ timeout: 5000 });
    }
}
