import { Page, expect, Locator } from '@playwright/test';

export class HomePage {
    private readonly page: Page;

    //locators
    private readonly userName: Locator;
    private readonly userName1: Locator;
    //


    constructor(page: Page) {
        this.page = page;
        this.userName = page.getByText('Andry Flitt ADNIM', { exact: true })
        this.userName1 = page.getByText('Julia Tkachenko');


    }
    async expectUserNameVisible() {
        await expect(this.userName).toBeVisible();
    }
    async expectUserNameVisible1(): Promise<boolean> {
        await expect(this.userName1).toBeVisible();
        return true;
    }


};