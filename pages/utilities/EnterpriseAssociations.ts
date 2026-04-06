//created by AI

import { Page, expect, Locator } from '@playwright/test';

export class EnterpriseAssociationsPage {
    readonly page: Page;

    // locators — TC01
    private readonly pageHeading: Locator;
    private readonly headerContainer: Locator;
    private readonly companyDropdown: Locator;

    // locators — TC02
    private readonly fieldError: Locator;
    private readonly companyDropdownLabel: Locator;

    // locators — TC05 / TC09 / TC11
    private readonly loadingOverlay: Locator;
    private readonly availablePanel: Locator;
    private readonly associatedPanel: Locator;
    private readonly availableListbox: Locator;
    private readonly associatedListbox: Locator;
    private readonly moveRightButton: Locator;
    private readonly moveLeftButton: Locator;
    private readonly saveButton: Locator;
    private readonly cancelButton: Locator;
    private readonly panelHeaderTitles: Locator;
    private readonly successToast: Locator;

    // constructor
    constructor(page: Page) {
        this.page = page;

        // TC01
        this.pageHeading = page.getByRole('heading', { name: 'Enterprise Associations', level: 1 });
        this.headerContainer = page.locator('.enterprise-associations-page .header h1');
        this.companyDropdown = page.locator('#uxCompanySelect');

        // TC02
        this.fieldError = page.locator('.field-error');
        this.companyDropdownLabel = page.locator('label').filter({ hasText: 'Enterprise Company' });

        // TC05 / TC09 / TC11
        this.loadingOverlay = page.locator('.loading-overlay');
        this.availablePanel = page.getByRole('group', { name: 'Available Companies' });
        this.associatedPanel = page.getByRole('group', { name: 'Associated Companies' });
        this.availableListbox = page.locator('#dl-enterprise-association-dual-list-available-listbox');
        this.associatedListbox = page.locator('#dl-enterprise-association-dual-list-selected-listbox');
        this.moveRightButton = page.getByTestId('move-right');
        this.moveLeftButton = page.getByTestId('move-left');
        this.saveButton = page.getByRole('button', { name: /save/i });
        this.cancelButton = page.getByRole('button', { name: /cancel/i });
        this.panelHeaderTitles = page.locator('.dual-list-header__title');
        this.successToast = page.locator('.toast.text-bg-success');
    }

    // ── Navigation ──────────────────────────────────────────────────────────────

    async navigateTo() {
        await this.page.getByRole('link', { name: 'Utilities' }).click();
        await this.page.getByRole('link', { name: 'Enterprise Associations' }).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ── TC01 — Heading ───────────────────────────────────────────────────────────

    async expectPageHeadingVisible() {
        await expect(this.pageHeading).toBeVisible();
    }

    async expectHeaderContainerVisible() {
        await expect(this.headerContainer).toBeVisible();
    }

    async expectHeaderContainerText(text: string) {
        await expect(this.headerContainer).toHaveText(text);
    }

    async getHeaderColor(): Promise<string> {
        return await this.headerContainer.evaluate((el) => getComputedStyle(el).color);
    }

    async expectCompanyDropdownVisible() {
        await expect(this.companyDropdown).toBeVisible();
    }

    async getPageHeadingBoundingBox() {
        return await this.pageHeading.boundingBox();
    }

    async getCompanyDropdownBoundingBox() {
        return await this.companyDropdown.boundingBox();
    }

    // ── TC02 — Required Validation ───────────────────────────────────────────────

    async expectFieldErrorNotVisible() {
        await expect(this.fieldError).not.toBeVisible();
    }

    async expectFieldErrorVisible() {
        await expect(this.fieldError).toBeVisible();
    }

    async expectFieldErrorText(text: string) {
        await expect(this.fieldError).toHaveText(text);
    }

    async expectLabelHasErrorClass() {
        await expect(this.companyDropdownLabel).toHaveClass(/control-label--error/);
    }

    async expectLabelNotHasErrorClass() {
        await expect(this.companyDropdownLabel).not.toHaveClass(/control-label--error/);
    }

    async expectDropdownHasErrorClass() {
        await expect(this.companyDropdown).toHaveClass(/input-error/);
    }

    async expectDropdownNotHasErrorClass() {
        await expect(this.companyDropdown).not.toHaveClass(/input-error/);
    }

    async selectDefaultOption() {
        await this.companyDropdown.selectOption({ index: 0 });
    }

    // ── TC05 — Select Company ────────────────────────────────────────────────────

    async selectFirstCompany() {
        await this.companyDropdown.selectOption({ index: 1 });
    }

    async expectLoadingOverlayVisible() {
        await expect(this.loadingOverlay).toBeVisible();
    }

    async expectLoadingOverlayHidden() {
        await expect(this.loadingOverlay).toBeHidden();
    }

    async expectMoveRightDisabled() {
        await expect(this.moveRightButton).toBeDisabled();
    }

    async expectMoveLeftDisabled() {
        await expect(this.moveLeftButton).toBeDisabled();
    }

    async expectCompanyDropdownDisabled() {
        await expect(this.companyDropdown).toBeDisabled();
    }

    async expectBothPanelsVisible() {
        await expect(this.availablePanel).toBeVisible();
        await expect(this.associatedPanel).toBeVisible();
    }

    async expectAvailableListboxHasItems() {
        await expect(this.availableListbox.getByRole('option').first()).toBeVisible();
    }

    async expectPanelHeaderTitles() {
        await expect(this.panelHeaderTitles.nth(0)).toHaveText('Available Companies');
        await expect(this.panelHeaderTitles.nth(1)).toHaveText('Associated Companies');
    }

    // ── TC09 — Save Success ──────────────────────────────────────────────────────

    async selectFirstCompanyAndWait() {
        await this.companyDropdown.selectOption({ index: 1 });
        await expect(this.loadingOverlay).toBeHidden();
        await expect(this.availablePanel).toBeVisible();
    }

    async moveFirstItemToAssociated() {
        const firstItem = this.availableListbox.getByRole('option').first();
        await expect(firstItem).toBeVisible();
        await firstItem.click();
        await expect(this.moveRightButton).toBeEnabled();
        await this.moveRightButton.click();
        await expect(this.moveRightButton).toBeDisabled();
    }

    async clickSave() {
        await this.saveButton.click();
    }

    async expectSaveButtonDisabled() {
        await expect(this.saveButton).toBeDisabled();
    }

    async expectCancelButtonDisabled() {
        await expect(this.cancelButton).toBeDisabled();
    }

    async expectAllControlsDisabled() {
        await expect(this.saveButton).toBeDisabled();
        await expect(this.cancelButton).toBeDisabled();
        await expect(this.companyDropdown).toBeDisabled();
        await expect(this.moveRightButton).toBeDisabled();
        await expect(this.moveLeftButton).toBeDisabled();
    }

    async expectSuccessToastVisible() {
        await expect(this.successToast).toBeVisible();
    }

    async expectSuccessToastText(text: string) {
        await expect(this.successToast).toContainText(text);
    }

    async expectAssociatedListboxHasItems() {
        await expect(this.associatedListbox.getByRole('option').first()).toBeVisible();
    }

    // ── TC11 — Cancel ────────────────────────────────────────────────────────────

    async moveFirstItemToAssociatedWithoutWait() {
        const firstItem = this.availableListbox.getByRole('option').first();
        await expect(firstItem).toBeVisible();
        await firstItem.click();
        await expect(this.moveRightButton).toBeEnabled();
        await this.moveRightButton.click();
    }

    async clickCancel() {
        await this.cancelButton.click();
    }

    async getFirstAvailableItemName(): Promise<string> {
        return (await this.availableListbox.getByRole('option').first().textContent()) ?? '';
    }

    async expectAvailableItemVisible(name: string) {
        await expect(this.availableListbox.getByRole('option', { name: name.trim() })).toBeVisible();
    }
}
