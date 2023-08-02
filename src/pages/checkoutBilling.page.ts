import { Locator, Page, request } from "@playwright/test";
import * as data from "../../test-data/test-data.json";

export default class CheckoutBilling {
  constructor(public page: Page) {}

  public async enterCardNumber(value: string) {
    await this.page.waitForLoadState();
    await this.page.getByPlaceholder("Card Number").scrollIntoViewIfNeeded();
    await this.page.getByPlaceholder("Card Number").type(value);
  }
  public async selectExpiryMonth(value: string) {
    await this.page.waitForLoadState();
    await this.page
      .getByRole("combobox", { name: "Expiration Month *" })
      .selectOption({ label: value });
  }

  public async selecExpiryYear(value: string) {
    await this.page.waitForLoadState();
    await this.page
      .getByRole("combobox", { name: "Expiration Year *" })
      .selectOption({ label: value });
  }

  public async enterSecurityCode(value: string) {
    await this.page.waitForLoadState();
    await this.page.locator("#securityCode").type(value);
  }

  public async clickBtnReviewOrder() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.getByRole("button", { name: "Review Order" }).click(),
    ]);
  }

  public async enterSavedCardCVV(value: string) {
    await this.page.waitForLoadState();
    await this.page.getByLabel("CVV").type(value);
  }

  public async clickAddNewPaymentBtn() {
    await this.page.waitForLoadState();
    if (
      await this.page
        .getByRole("button", { name: "Add New Payment" })
        .isVisible()
    ) {
      await this.page.getByRole("button", { name: "Add New Payment" }).click();
    }
  }

  public async countSavedCards(): Promise<number> {
    // try {
    //   await this.page.waitForNavigation({ url: /stage=payment#payment/ });
    // } catch (e) {
    //   console.log(e);
    // }

    if (await this.page.locator(".stored-payments").isVisible()) {
      const storedCards = this.page
        .locator(".stored-payments")
        .locator("input")
        .all();
      return (await storedCards).length;
    }
    return 0;
  }

  public async fillNewCCDetails() {
    await this.enterCardNumber(data.cardNumber);
    await this.selectExpiryMonth(data.expiryMonth);
    await this.selecExpiryYear(data.expiryYear);
    await this.enterSecurityCode(data.scurityCode);
    await this.clickBtnReviewOrder();
  }

  public async fillSavedCardDetails(options?: { forceNewCard: boolean }) {
    const savedCardsCount = await this.countSavedCards();
    // console.log(`Number of Saved Cards are: ${savedCardsCount}`);
    if (savedCardsCount > 0) {
      if (options?.forceNewCard) {
        await this.clickAddNewPaymentBtn();
        await this.fillNewCCDetails();
      } else {
        await this.enterSavedCardCVV(data.RegisteredUser.CVV);
        await this.clickBtnReviewOrder();
      }
    } else {
      await this.fillNewCCDetails();
    }
  }

  // ZIP Payment

  public async clickZIPPaymentTab() {
    await this.page.waitForLoadState();
    await this.page.getByRole("tab", { name: "Zip" }).click();
  }

  public async clickChkoutWithZIPBtn() {
    await this.page.waitForLoadState();
    await this.page.getByRole("button", { name: "Check out with" }).click();
  }

  public async enterZIPMobNum(value: string) {
    await this.page.waitForLoadState();
    await this.page.locator('[data-test="phone-number"]').fill(value);
  }

  public async clickZIPNextBtn() {
    await this.page.waitForLoadState();
    await this.page.getByRole("button", { name: "Next" }).click();
  }
  public async enterZIPOtp(value: string) {
    await this.page.waitForLoadState();
    await this.page
      .getByRole("textbox", { name: "Input code one" })
      .fill(value);
  }
  public async clickZIPVerifyBtn() {
    await this.page.getByRole("button", { name: "Verify" }).click();
  }

  public async clickZIPCnfrmBtn() {
    await this.page.getByRole("button", { name: "Confirm Payment" }).click();
  }

  public async fillZIPPaymentDeails() {
    await this.clickZIPPaymentTab();
    [this.page] = await Promise.all([
      this.page.waitForEvent("popup"),
      await this.clickChkoutWithZIPBtn(),
    ]);

    let oldOTP = await this.getZipOtp();
    await this.enterZIPMobNum(data.ZIPMobileNumber);
    await this.clickZIPNextBtn();
    await this.page.waitForTimeout(10000);
    let newOTP = await this.getZipOtp();
    while (oldOTP === newOTP) {
      await this.page.waitForTimeout(10000);
      newOTP = await this.getZipOtp();
    }
    // console.log(`this is new OTP: ${newOTP}`);
    await this.enterZIPOtp(newOTP);
    // await this.clickZIPVerifyBtn();
    await this.clickZIPCnfrmBtn();
  }

  public async getZipOtp(): Promise<string> {
    const req = await request.newContext();
    let optNum: string = "";
    await req
      .get(data.ZIPMsgSrvc, {
        ignoreHTTPSErrors: true,
        headers: {},
      })
      .then(async (html) => {
        const line = await html.text();
        const line2 = line.match(/.*Zip.*/);
        if (line2) {
          const boldNum = line2[0].match(/<b>\d+/);

          if (boldNum) {
            const opt = boldNum[0].match(/\d+/);
            if (opt) {
              // console.log(`opt is : ${opt[0]}`);
              optNum = opt[0];
            }
          }
        }
        // console.log(html.status());
      });
    return optNum;
  }

  //PayPal Payment////////////////////////////////////////////////////////////////////////
  public async isLargeTotal(): Promise<boolean> {
    const estTotl = (
      await this.page.locator(".text-right.grand-total-sum").textContent()
    )
      ?.trim()
      .substring(1);
    if (estTotl) {
      if (parseInt(estTotl) >= 150) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public async clickPayPalPaymentTab() {
    await this.page.waitForLoadState();
    await this.page.getByRole("tab", { name: "PayPal" }).click();
  }

  public async clickPayPalBtn() {
    await this.page.waitForLoadState();
    await this.page
      .frameLocator("iframe[title='PayPal']")
      .getByRole("button", { name: "PayPal" })
      .click();
  }

  public async enterPayPalEmail(value: string) {
    await this.page.waitForLoadState();
    await this.page.getByPlaceholder("Email or mobile number").type(value);
  }

  public async clickPayPalNextBtn() {
    await this.page.waitForLoadState();
    await this.page.getByRole("button", { name: "Next" }).click();
  }

  public async enterPayPalPassword(value: string) {
    // const responsePromise = this.page.waitForResponse(
    //   (response) =>
    //     response
    //       .url()
    //       .includes("https://www.sandbox.paypal.com/signin?intent=checkou") &&
    //     response.status() == 200
    // );
    // await responsePromise;

    const tbxPwd = this.page.getByPlaceholder("Password");
    await tbxPwd.waitFor();
    await tbxPwd.type(value);
  }

  public async clickPayPalLoginBtn() {
    await this.page.waitForLoadState();
    await this.page.getByRole("button", { name: "Log In" }).click();
  }

  public async clickPayPalCompltPurchsBtn() {
    await this.page.waitForLoadState();
    await this.page.getByTestId("submit-button-initial").click();
  }

  public async clickPayPalAcptCookie() {
    await this.page.waitForLoadState();
    await this.page.getByRole("button", { name: "Accept" }).click();
  }

  public async clickPayNowBtn() {
    await this.page.waitForLoadState();
    await this.page.locator('[data-test-id="continueButton"]').click();
  }

  public async fillPayPalPaymentDeails() {
    const oldPage: Page = this.page.context().pages()[0];
    // console.log(oldPage.url());
    const isLargeAmnt = await this.isLargeTotal();
    await this.clickPayPalPaymentTab();
    [this.page] = await Promise.all([
      this.page.waitForEvent("popup"),
      await this.clickPayPalBtn(),
    ]);
    // await this.clickPayPalBtn();
    await this.enterPayPalEmail(data.PayPal.email);
    await this.clickPayPalNextBtn();
    await this.enterPayPalPassword(data.PayPal.password);
    await this.clickPayPalLoginBtn();
    if (isLargeAmnt) {
      await this.clickPayNowBtn();
    } else {
      await this.clickPayPalCompltPurchsBtn();
    }
    await this.page.waitForEvent("close");
    await oldPage.waitForURL(/stage=placeOrder#placeOrder/);
  }

  //Billing Address Details
  public async enterFirstName(value: string) {
    await this.page.getByRole("textbox", { name: "First Name *" }).type(value);
  }
  public async enterLastName(value: string) {
    await this.page.getByRole("textbox", { name: "Last Name *" }).type(value);
  }
  public async enterAddress1(value: string) {
    await this.page.getByRole("textbox", { name: "Address 1 *" }).type(value);
  }
  public async selectState(value: string) {
    await this.page
      .getByRole("combobox", { name: "State *" })
      .selectOption({ label: value });
  }
  public async enterCityName(value: string) {
    const city = this.page.getByRole("textbox", { name: "City *" });
    await city.focus();
    await city.fill(value);
  }
  public async enterZipCode(value: string) {
    const zip = this.page.getByRole("textbox", { name: "ZIP Code *" });
    await zip.focus();
    await zip.fill(value);
  }

  public async enterNewBilngAdrs() {
    await this.enterFirstName(data.guestUser.firstName);
    await this.enterLastName(data.guestUser.lastName);
    await this.enterAddress1(data.address1);
    await this.selectState(data.state);
    await this.enterCityName(data.city);
    await this.enterZipCode(data.zip);
  }

  public async selectExistingBillingAdrs() {
    const billAdrsCombo = this.page.getByRole("combobox", {
      name: "Select Address",
    });
    if (await billAdrsCombo.isVisible()) {
      await billAdrsCombo.selectOption({ index: 2 });
    }
  }
}
