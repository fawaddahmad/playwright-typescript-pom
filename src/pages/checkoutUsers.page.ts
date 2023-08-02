import { Page } from "@playwright/test";
import * as data from "../../test-data/test-data.json";

export default class CheckoutUsers {
  constructor(public page: Page) {}

  public async enterGuestEmail(email: string) {
    await this.page.waitForLoadState();
    await this.page.locator('input[name="dwfrm_coCustomer_email"]').type(email);
  }

  public async clickContinueAsGuestBtn() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.getByRole("button", { name: "Continue as guest" }).click(),
    ]);
  }

  public async clickSigninLink() {
    await this.page.waitForNavigation();
    const signinLink = this.page
      .locator("#guest-txt-link-wrap")
      .getByText("Sign in");
    await signinLink.waitFor({ state: "visible" });
    await signinLink.click();
  }

  public async enterLoginEmail(email: string) {
    await this.page.waitForSelector(
      'input[name="dwfrm_coRegisteredCustomer_email"]',
      { state: "visible" }
    );
    await this.page
      .locator('input[name="dwfrm_coRegisteredCustomer_email"]')
      .type(email);
  }

  public async enterLoginPassword(pwd: string) {
    const tbxPwd = this.page.getByPlaceholder("Password");
    await tbxPwd.waitFor({ state: "visible" });
    await tbxPwd.type(pwd);
  }

  public async clickSigninBtn() {
    await this.page.waitForLoadState();
    await this.page.getByRole("button", { name: "Sign In" }).click();
  }

  public async clickBtnAddtoCart() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.getByRole("button", { name: "Add to Cart" }).click(),
    ]);
    this.page.getByRole("button", { name: "Continue as guest" });
  }

  public async guestCheckout() {
    console.log(`User email is: ${data.guestUser.email}`);
    await this.enterGuestEmail(data.guestUser.email);
    await this.clickContinueAsGuestBtn();
    await this.page.waitForURL(/stage=shipping#shipping/);
  }

  public async regUserCheckout(options?: { isAutoship: boolean }) {
    if (!options?.isAutoship) {
      await this.clickSigninLink();
    }
    console.log(`User email is: ${data.RegisteredUser.email}`);

    await this.enterLoginEmail(data.RegisteredUser.email);
    await this.enterLoginPassword(data.RegisteredUser.password);
    await this.clickSigninBtn();
    // await this.page
    //   .context()
    //   .storageState()
    //   .then((ctx) => {
    //     console.log(ctx);
    //   });
  }
}
