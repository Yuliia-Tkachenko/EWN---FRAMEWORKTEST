import { Page, expect, Locator } from '@playwright/test';

export class IsnManualExportPage {
    private readonly page: Page;

    // ── Company selection ────────────────────────────────────────────────────
    private readonly companySearchInput: Locator;
    private readonly companyDropdownOptions: Locator;
    private readonly changeLink: Locator;

    // ── Dual list component ──────────────────────────────────────────────────
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

        // Company combobox — accessible label "Select Company:"
        this.companySearchInput     = page.getByRole('combobox', { name: 'Select Company:' });
        this.companyDropdownOptions = page.locator('ul.company-dropdown li[role="option"]');

        // Change link resets the company selection; its visibility indicates a company is selected
        this.changeLink = page.getByRole('link', { name: 'Change' });

        // Left (Available) and right (Selected) panels — ARIA groups
        this.availablePanel = page.getByRole('group', { name: 'Available Employees' });
        this.selectedPanel  = page.getByRole('group', { name: 'Selected Employees' });

        // Items inside each panel — listbox options
        this.availableItems = page.getByRole('listbox', { name: 'Available Employees' }).getByRole('option');
        this.selectedItems  = page.getByRole('listbox', { name: 'Selected Employees' }).getByRole('option');

        // Move buttons — identified by accessible name
        this.moveRightButton = page.getByRole('button', { name: 'Move to Selected Employees' });
        this.moveLeftButton  = page.getByRole('button', { name: 'Move to Available Employees' });

        // Export to ISN submit button
        this.exportButton = page.getByRole('button', { name: 'Export to ISN' });

        // Toast notification — ARIA alert role
        this.toastAlert        = page.locator('[role="alert"].toast, div.toast[role="alert"]');
        this.toastDismissButton = page.locator('div.toast button.btn-close, [role="alert"] button.btn-close');
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
        // Wait for the company to be shown and the dual list to appear
        await this.changeLink.waitFor({ state: 'visible', timeout: 10000 });
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
        // After selection, a paragraph with the company name and Change link is shown
        await expect(this.changeLink).toBeVisible();
    }

    async expectSelectedCompanyIs(name: string) {
        // The company name appears as text in the paragraph next to the Change link
        const companyNameText = this.page.locator('p, paragraph').filter({ hasText: name });
        await expect(companyNameText.first()).toContainText(new RegExp(name, 'i'));
    }

    async expectChangeLinkVisible() {
        await expect(this.changeLink).toBeVisible();
    }

    async expectChangeLinkNotVisible() {
        await expect(this.changeLink).toBeHidden();
    }

    // ── Dual list ────────────────────────────────────────────────────────────

    async waitForDualListToLoad() {
        await this.availablePanel.waitFor({ state: 'visible', timeout: 15000 });
        // Wait for at least one item to be rendered in the Available listbox
        await this.availableItems.first().waitFor({ state: 'visible', timeout: 30000 });
    }

    async expectDualListVisible() {
        await expect(this.availablePanel).toBeVisible();
        await expect(this.selectedPanel).toBeVisible();
    }

    async expectDualListNotVisible() {
        await expect(this.availablePanel).toBeHidden();
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
        // Each option has an inner checkbox
        await first.getByRole('checkbox').click();
        await this.moveRightButton.click();
        // Wait for the item to appear in the selected panel
        await this.selectedItems.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async moveFirstSelectedItemToAvailable() {
        const first = this.selectedItems.first();
        await first.waitFor({ state: 'visible', timeout: 10000 });
        await first.getByRole('checkbox').click();
        await this.moveLeftButton.click();
    }

    async expectNoAvailableResults() {
        await this.availablePanel.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.availableItems).toHaveCount(0, { timeout: 10000 });
    }

    // ── Search filters ───────────────────────────────────────────────────────

    async searchAvailableEmployees(text: string) {
        const input = this.page.getByRole('searchbox', { name: 'Search Available Employees' });
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.fill(text);
    }

    async searchSelectedEmployees(text: string) {
        const input = this.page.getByRole('searchbox', { name: 'Search Selected Employees' });
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.fill(text);
    }

    // ── Dual list style / structure helpers ──────────────────────────────────

    async expectAvailablePanelVisible() {
        await expect(this.availablePanel).toBeVisible();
    }

    async expectSelectedPanelVisible() {
        await expect(this.selectedPanel).toBeVisible();
    }

    async expectAvailableSearchInputVisible() {
        const input = this.page.getByRole('searchbox', { name: 'Search Available Employees' });
        await expect(input).toBeVisible();
    }

    async expectSelectedSearchInputVisible() {
        const input = this.page.getByRole('searchbox', { name: 'Search Selected Employees' });
        await expect(input).toBeVisible();
    }

    async expectMoveRightButtonVisible() {
        await expect(this.moveRightButton).toBeVisible();
    }

    async expectMoveLeftButtonVisible() {
        await expect(this.moveLeftButton).toBeVisible();
    }

    /** Returns true if the available and selected panels are at roughly the same vertical position. */
    async panelsAreAtSameVerticalLevel(tolerancePx = 50): Promise<boolean> {
        const availableBox = await this.availablePanel.boundingBox();
        const selectedBox  = await this.selectedPanel.boundingBox();
        return Math.abs((availableBox?.y ?? 0) - (selectedBox?.y ?? 0)) < tolerancePx;
    }

    /**
     * Returns the bottom Y-coordinate of the dual-list area, computed as the maximum
     * bottom edge of the Available and Selected panels.
     */
    async getDualListBottomY(): Promise<number> {
        const availableBox = await this.availablePanel.boundingBox();
        const selectedBox  = await this.selectedPanel.boundingBox();
        const availableBottom = (availableBox?.y ?? 0) + (availableBox?.height ?? 0);
        const selectedBottom  = (selectedBox?.y ?? 0)  + (selectedBox?.height ?? 0);
        return Math.max(availableBottom, selectedBottom);
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

    async expectExportButtonHasText(text: string | RegExp) {
        await expect(this.exportButton).toContainText(text);
    }

    async getExportButtonBackgroundColor(): Promise<string> {
        return await this.exportButton.evaluate(
            (el: HTMLElement) => window.getComputedStyle(el).backgroundColor
        );
    }

    async exportButtonIsBelow(otherLocator: import('@playwright/test').Locator, tolerancePx = 10): Promise<boolean> {
        const otherBox  = await otherLocator.boundingBox();
        const btnBox    = await this.exportButton.boundingBox();
        const otherBottom = (otherBox?.y ?? 0) + (otherBox?.height ?? 0);
        return (btnBox?.y ?? 0) >= otherBottom - tolerancePx;
    }

    /** Returns true when the Export button is positioned below the dual list panels. */
    async exportButtonIsBelowDualList(tolerancePx = 10): Promise<boolean> {
        const dualListBottom = await this.getDualListBottomY();
        const btnBox = await this.exportButton.boundingBox();
        return (btnBox?.y ?? 0) >= dualListBottom - tolerancePx;
    }

    async focusExportButton() {
        await this.exportButton.focus();
    }

    async exportButtonHasFocus(): Promise<boolean> {
        return await this.exportButton.evaluate(el => el === document.activeElement);
    }

    // ── Toast alert ──────────────────────────────────────────────────────────

    async expectSuccessAlertVisible() {
        // Wait for a success alert to appear — either a toast or any alert element
        const successAlert = this.page.locator(
            'div.toast.text-bg-success[role="alert"], [role="alert"].text-bg-success'
        );
        await expect(successAlert).toBeVisible({ timeout: 15000 });
    }

    async expectErrorAlertVisible() {
        // Wait for an error/warning alert to appear.
        // The app renders error feedback as [role="alert"] but not necessarily using text-bg-danger;
        // accept any visible alert element that is not the success variant.
        const errorAlert = this.page.locator(
            '[role="alert"]:not(.text-bg-success)'
        );
        await expect(errorAlert).toBeVisible({ timeout: 15000 });
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
