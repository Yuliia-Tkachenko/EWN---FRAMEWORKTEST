import { Page, expect, Locator } from '@playwright/test';

export class AssessmentPage {
    readonly page: Page;

    // locators — question answering
    private readonly trueFalsePanels: Locator;
    private readonly multipleChoicePanels: Locator;
    private readonly multipleAnswerCheckbox: Locator;

    // locators — submission & modal
    private readonly submitButton: Locator;
    private readonly uploadModal: Locator;
    private readonly modalBackdrop: Locator;

    // locators — results
    private readonly resultSection: Locator;

    // locators — page load
    private readonly assessmentController: Locator;

    // locators — answer selection (TC07: True/False question, option a = True)
    private readonly trueOption: Locator;

    constructor(page: Page) {
        this.page = page;

        // question panels
        this.trueFalsePanels        = page.locator('.true-false .panel');
        this.multipleChoicePanels   = page.locator('.multiple-choice .panel');
        this.multipleAnswerCheckbox = page.locator('.multiple-answer input[type="checkbox"]').first();

        // submission
        this.submitButton   = page.getByRole('button', { name: /submit answers/i });
        this.uploadModal    = page.locator('.upload-progress-modal, .modal:has-text("Uploading")');
        this.modalBackdrop  = page.locator('.modal-backdrop');

        // results
        this.resultSection = page.locator('.results, [ng-bind*="result"]');

        // page load
        this.assessmentController = page.locator('[ng-controller*="AssessmentController"]');

        // answer selection — True is option a (first radio on the page)
        this.trueOption = page.locator('input[type="radio"]').first();
    }

    // ── Navigation ───────────────────────────────────────────────────────────

    async goto(url: string) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    async expectAssessmentLoaded() {
        await expect(this.assessmentController).toBeVisible({ timeout: 30_000 });
    }

    // ── SEB setup (call before goto) ─────────────────────────────────────────

    async injectSEBContext() {
        await this.page.addInitScript(() => {
            (window as Window & { SafeExamBrowser?: unknown }).SafeExamBrowser = {
                security: { configKeyHash: 'mock-seb-hash' },
            };
        });
    }

    // ── Question answering ───────────────────────────────────────────────────

    async selectTrueAnswer() {
        // Select option a (True) — the first radio button on the assessment
        await this.trueOption.click();
    }

    async answerAllQuestions() {
        // True / False — click the first panel in each group
        const tfCount = await this.trueFalsePanels.count();
        for (let i = 0; i < tfCount; i++) {
            await this.trueFalsePanels.nth(i).click();
        }

        // Multiple Choice — pick the first radio in each question group
        const mcCount = await this.multipleChoicePanels.count();
        for (let i = 0; i < mcCount; i++) {
            const firstRadio = this.multipleChoicePanels.nth(i).locator('input[type="radio"]').first();
            if (await firstRadio.count() > 0) {
                await firstRadio.click();
            }
        }

        // Multiple Answer — check the first available checkbox
        if (await this.multipleAnswerCheckbox.count() > 0) {
            await this.multipleAnswerCheckbox.click();
        }
    }

    // ── Submission ───────────────────────────────────────────────────────────

    async clickSubmit() {
        await this.submitButton.click();
    }

    // ── Modal assertions ─────────────────────────────────────────────────────

    async expectUploadModalVisible() {
        await expect(this.uploadModal).toBeVisible({ timeout: 5_000 });
    }

    async expectUploadModalRemainsOpen() {
        // Bug behaviour: modal stays open indefinitely.
        // Wait 10 s, then assert still visible.
        // On the fixed build this assertion will FAIL (modal will have closed).
        await this.page.waitForTimeout(10_000);
        await expect(this.uploadModal).toBeVisible();
    }

    async expectUploadModalHidden() {
        await expect(this.uploadModal).toBeHidden({ timeout: 15_000 });
    }

    async expectModalBackdropVisible() {
        await expect(this.modalBackdrop).toBeVisible();
    }

    async expectModalBackdropHidden() {
        await expect(this.modalBackdrop).toBeHidden();
    }

    async isInteractionBlocked(): Promise<boolean> {
        return this.page.evaluate(() => document.querySelector('.modal-backdrop') !== null);
    }

    // ── Results ──────────────────────────────────────────────────────────────

    async expectResultsVisible() {
        await expect(this.resultSection.first()).toBeVisible({ timeout: 5_000 });
    }

    // ── Utility ──────────────────────────────────────────────────────────────

    async waitMs(ms: number) {
        await this.page.waitForTimeout(ms);
    }
}
