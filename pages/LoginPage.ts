import { Page, expect, Locator } from '@playwright/test';

export class LoginPage {

  private readonly page: Page;

   //locator
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly logoEWN: Locator;
  private readonly UsernameErrorMessage: Locator;
  private readonly PasswordErrorMessage: Locator;
  private readonly ContactUs: Locator;
  private readonly Forgot?: Locator;
  private readonly Tesxt: Locator;

   //constractor
   constructor(page: Page) {
    this.page = page;
    this.usernameInput=page.getByLabel('Username');
    this.passwordInput=page.getByLabel('Password');
    this.loginButton=page.getByRole('button', { name: /Log In/i });
    this.logoEWN=page.getByRole('img', { name: 'EWN Logo' })
    this.UsernameErrorMessage = page.getByText('Username is required.', { exact: true });
    this.PasswordErrorMessage = page.getByText('Password is required.', { exact: true });
    this.ContactUs =page.getByText('Contact Us', { exact: true });
    this.Forgot=page.getByRole('link', { name: 'Forget?' })
    this.Tesxt=page.locator("//p[contains(text(),'Access is restricted to authorized users who have ')]");

  }

   //action method
    async login(username: string, password: string) {  
    await this.page.goto("https://test-auth.ewn.com/static/login")    
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
   }

     //Logo EWN is visible
    async expectLogoVisible() {
    await expect(this.logoEWN).toBeVisible();
   }

    async expectUsernameErrorMessageVisible() {
    await expect(this.UsernameErrorMessage).toBeVisible();
  }

    async expectPasswordErrorMessageVisible() {
    await expect(this.PasswordErrorMessage).toBeVisible();
   }


   //Check if the login page exists
    async isLoginPageExist() {
    const logoExists:boolean=await this.logoEWN.isVisible();
    if(logoExists){
        return true;
    }
         return false;
    }

    //Check if the login button is enabled
    async expectLoginButtonEnabled() {
        await expect(this.loginButton).toBeEnabled();
    }
     //Check if the login button is disabled
    async expectLoginButtonDisabled() {
    await expect(this.loginButton).toBeDisabled();
    }
     
    //Set the User name name UserName field
    async clickUserNameField() {
        await this.usernameInput.click();
    }

    //Set the Password in the Passworf field
    async clickPasswordField() {
        await this.passwordInput.click();
    }

    //click Text
    async clickText() {
        await this.Tesxt.click();
    }

   // Click "Login" button
       async clickLoginButton()
        {
        try{ 
            await this.expectLoginButtonEnabled();
            await this.loginButton.click();
        }catch(error){
            console.error("Error clicking the login button:", error);
            throw error;
        }     


 }
}
