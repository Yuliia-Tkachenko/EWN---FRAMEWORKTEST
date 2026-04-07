import { Page, expect, Locator } from '@playwright/test';

export class IsnManualExportPage {
    readonly page: Page;

    // locators — TC03
    private readonly companySearchInput: Locator;
    private readonly companyDropdown: Locator;
    private readonly companyDropdownOptions: Locator;
    private readonly selectedCompanyDisplay: Locator;
    private readonly changeLink: Locator;
    private readonly dualList: Locator;
    private readonly exportButton: Locator;

    // locators — TC04
    private readonly companyFormGroup: Locator;
    private readonly companyErrorMessage: Locator;

    // locators — TC06
    private readonly availableItems: Locator;
    private readonly selectedItems: Locator;
    private readonly moveRightButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.companySearchInput     = page.locator('#txtCompany');
        this.companyDropdown        = page.locator('ul.company-dropdown[role="listbox"]');
        this.companyDropdownOptions = page.locator('ul.company-dropdown[role="listbox"] li[role="option"]');
        this.selectedCompanyDisplay = page.locator('.company-input-wrapper .company-display');
        this.changeLink             = page.locator('.company-input-wrapper a.change-link');
        this.dualList               = page.locator('ewn-dual-list');
        this.exportButton           = page.locator('button', { hasText: /export to isn/i });

        // TC04
        this.companyFormGroup       = page.locator('.form-group', { has: page.locator('#txtCompany') });
        this.companyErrorMessage    = page.locator('[data-v-651cb9c2].error-message, .error-message').filter({ hasText: /required/i });

        // TC06 — AngularJS dual list (ewn-dual-list)
        this.availableItems  = page.locator('ewn-dual-list .dual-list-left .list-group-item.vs-repeat-repeated-element');
        this.selectedItems   = page.locator('ewn-dual-list .dual-list-right .list-group-item.vs-repeat-repeated-element');
        this.moveRightButton = page.locator('ewn-dual-list .move-button-group .ri-arrow-right-s-line');
    }

    // ── Navigation ──────────────────────────────────────────────────────────

    async navigateTo() {
        await this.page.goto('/legacy/IsnManualExport');
        await this.page.waitForLoadState('domcontentloaded');
        await this.companySearchInput.waitFor({ state: 'visible', timeout: 15000 });
    }

    // ── Actions ──────────────────────────────────────────────────────────────

    async typeCompanyName(name: string) {
        await this.companySearchInput.click();
        await this.companySearchInput.fill(name);
        await this.page.waitForSelector('ul.company-dropdown[role="listbox"]', {
            state: 'visible',
            timeout: 15000,
        });
    }

    async selectCompanyFromDropdown(name: string) {
        const option = this.companyDropdownOptions.filter({ hasText: new RegExp(name, 'i') }).first();
        await option.waitFor({ state: 'visible' });
        await option.click();
        await this.page.waitForSelector('.company-input-wrapper .company-display', {
            state: 'visible',
        });
    }

    // ── TC03 assertions ──────────────────────────────────────────────────────

    async expectCompanySearchInputVisible() {
        await expect(this.companySearchInput).toBeVisible();
    }

    async expectCompanySearchInputEmpty() {
        await expect(this.companySearchInput).toBeEmpty();
    }

    async expectDropdownVisible() {
        await expect(this.companyDropdown).toBeVisible();
    }

    async expectDropdownHidden() {
        await expect(this.companyDropdown).toBeHidden();
    }

    async expectDropdownHasResults(): Promise<number> {
        const count = await this.companyDropdownOptions.count();
        expect(count).toBeGreaterThan(0);
        return count;
    }

    async expectAllDropdownOptionsContainText(text: string) {
        const count = await this.companyDropdownOptions.count();
        for (let i = 0; i < count; i++) {
            const optionText = await this.companyDropdownOptions.nth(i).textContent();
            expect(optionText?.toLowerCase()).toContain(text.toLowerCase());
        }
    }

    async expectSelectedCompanyDisplayVisible() {
        await expect(this.selectedCompanyDisplay).toBeVisible();
    }

    async expectSelectedCompanyDisplayContains(text: string) {
        await expect(this.selectedCompanyDisplay).toContainText(new RegExp(text, 'i'));
    }

    async expectChangeLinkVisible() {
        await expect(this.changeLink).toBeVisible();
    }

    async expectDualListHidden() {
        await expect(this.dualList).toBeHidden();
    }

    async expectExportButtonHidden() {
        await expect(this.exportButton).toBeHidden();
    }

    async expectDualListVisible() {
        await expect(this.dualList).toBeVisible();
    }

    async expectExportButtonVisible() {
        await expect(this.exportButton).toBeVisible();
    }

    async expectFirstOptionHasActiveClass() {
        const firstOption = this.companyDropdownOptions.first();
        await expect(firstOption).toHaveClass(/active/);
    }

    async pressKeyOnSearchInput(key: string) {
        await this.companySearchInput.press(key);
    }

    // ── TC04 actions ─────────────────────────────────────────────────────────

    async typeAndWaitForApiResponse(searchText: string) {
        await this.companySearchInput.click();
        await this.companySearchInput.fill(searchText);
        // Wait for Vue debounce + DOM update to settle
        await this.page.waitForTimeout(1500);
    }

    async clearCompanyInput() {
        await this.companySearchInput.clear();
    }

    // ── TC04 assertions ──────────────────────────────────────────────────────

    async expectDropdownEmptyOrHidden() {
        const dropdownVisible = await this.companyDropdown.isVisible();
        if (dropdownVisible) {
            const count = await this.companyDropdownOptions.count();
            expect(count).toBe(0);
        } else {
            await expect(this.companyDropdown).toBeHidden();
        }
    }

    async expectCompanySearchInputHasValue(value: string) {
        await expect(this.companySearchInput).toHaveValue(value);
    }

    async expectSelectedCompanyDisplayHidden() {
        await expect(this.selectedCompanyDisplay).toBeHidden();
    }

    async expectChangeLinkHidden() {
        await expect(this.changeLink).toBeHidden();
    }

    async expectCompanyFieldHasError() {
        await expect(this.companyFormGroup).toHaveClass(/has-error/);
    }

    async expectRequiredMessageVisible() {
        await expect(this.companyErrorMessage).toBeVisible();
    }

    // ── TC06 actions ─────────────────────────────────────────────────────────

    async waitForDualListToLoad() {
        await this.dualList.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.locator('ewn-dual-list .dual-list-left .list-group-item.vs-repeat-repeated-element').first()
            .waitFor({ state: 'visible', timeout: 15000 });
    }

    async moveFirstAvailableItemToSelected() {
        const firstItem = this.availableItems.first();
        await firstItem.waitFor({ state: 'visible' });
        // Click the checkbox inside the item to select it
        await firstItem.locator('input[type="checkbox"]').click();
        await this.clickMoveRight();
    }

    async clickMoveRight() {
        await this.moveRightButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.moveRightButton.click();
        await this.selectedItems.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async clickChangeLink() {
        await this.changeLink.waitFor({ state: 'visible' });
        await this.changeLink.click();
        await this.companySearchInput.waitFor({ state: 'visible' });
        await expect(this.companySearchInput).toBeEmpty();
    }

    async getFirstAvailableItemText(): Promise<string> {
        const text = await this.availableItems.first().textContent();
        return text?.trim() ?? '';
    }

    async getAvailableItemsCount(): Promise<number> {
        return await this.availableItems.count();
    }

    async getSelectedItemsCount(): Promise<number> {
        return await this.selectedItems.count();
    }

    // ── TC06 assertions ──────────────────────────────────────────────────────

    async expectSelectedPanelEmpty() {
        await expect(this.selectedItems).toHaveCount(0);
    }

    async expectAvailableItemsCountGreaterThan(n: number) {
        const count = await this.availableItems.count();
        expect(count).toBeGreaterThan(n);
    }

    async expectSelectedItemsCount(n: number) {
        await expect(this.selectedItems).toHaveCount(n);
    }

    // ── TC07 actions ─────────────────────────────────────────────────────────

    async checkFirstAvailableItem() {
        const firstItem = this.availableItems.first();
        await firstItem.waitFor({ state: 'visible' });
        await firstItem.locator('input[type="checkbox"]').click();
    }

    async checkFirstSelectedItem() {
        const firstItem = this.selectedItems.first();
        await firstItem.waitFor({ state: 'visible' });
        await firstItem.locator('input[type="checkbox"]').click();
    }

    async clickMoveLeft() {
        const moveLeftButton = this.page.locator('ewn-dual-list .move-button-group .ri-arrow-left-s-line');
        await moveLeftButton.waitFor({ state: 'visible' });
        await moveLeftButton.click();
    }

    async getFirstAvailableItemLabel(): Promise<string> {
        const text = await this.availableItems.first().locator('span.ng-binding').textContent();
        return text?.trim() ?? '';
    }

    async getFirstSelectedItemLabel(): Promise<string> {
        const text = await this.selectedItems.first().locator('span.ng-binding').textContent();
        return text?.trim() ?? '';
    }

    async getAvailableItemLabels(): Promise<string[]> {
        const texts = await this.availableItems.locator('span.ng-binding').allTextContents();
        return texts.map(t => t.trim());
    }

    async getSelectedItemLabels(): Promise<string[]> {
        const texts = await this.selectedItems.locator('span.ng-binding').allTextContents();
        return texts.map(t => t.trim());
    }

    // ── TC07 assertions ──────────────────────────────────────────────────────

    async expectFirstAvailableItemChecked() {
        const checkbox = this.availableItems.first().locator('input[type="checkbox"]');
        await expect(checkbox).toBeChecked();
    }

    async expectFirstSelectedItemChecked() {
        const checkbox = this.selectedItems.first().locator('input[type="checkbox"]');
        await expect(checkbox).toBeChecked();
    }

    async expectNoDuplicatesAcrossPanels() {
        const availableLabels = await this.getAvailableItemLabels();
        const selectedLabels  = await this.getSelectedItemLabels();
        const inBoth = availableLabels.filter(l => selectedLabels.includes(l));
        expect(inBoth).toHaveLength(0);
    }

    // ── TC11 actions ─────────────────────────────────────────────────────────

    async moveNAvailableUsersToSelected(n: number): Promise<string[]> {
        const movedLabels: string[] = [];
        for (let i = 0; i < n; i++) {
            const firstItem = this.availableItems.first();
            await firstItem.waitFor({ state: 'visible' });
            const label = await firstItem.locator('span.ng-binding').textContent();
            movedLabels.push(label?.trim() ?? '');
            await firstItem.locator('input[type="checkbox"]').click();
            await this.clickMoveRight();
        }
        return movedLabels;
    }

    async clickExportButton() {
        await this.exportButton.waitFor({ state: 'visible' });
        await this.exportButton.click();
    }

    // ── TC11 assertions ──────────────────────────────────────────────────────

    async expectExportButtonEnabled() {
        await expect(this.exportButton).toBeEnabled();
    }

    async expectSuccessToastVisible() {
        const toast = this.page.locator('.toast.text-bg-success');
        await expect(toast).toBeVisible({ timeout: 10000 });
    }

    async expectSelectedPanelHasLabels(labels: string[]) {
        const actual = await this.getSelectedItemLabels();
        for (const label of labels) {
            expect(actual).toContain(label);
        }
    }
}
