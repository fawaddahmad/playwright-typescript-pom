import { Locator, Page } from "@playwright/test";
import * as data from "../../test-data/test-data.json";

export default class CheckoutShipping {
  constructor(public page: Page) {}
  SddRootAdrsLocator: string =
    "//*[contains(@class,'shipment-wrapper SDD-shipment')]";
  DtcRootAdrsLocator: string = "[class='shipment-wrapper DTC-shipment']";
  public async enterFirstName(shipAdrsRootLocator: string, value: string) {
    await this.page
      .locator(shipAdrsRootLocator)
      .locator("[placeholder='First Name']")
      .fill(value);
  }
  public async enterLastName(shipAdrsRootLocator: string, value: string) {
    await this.page
      .locator(shipAdrsRootLocator)
      .locator("[placeholder='Last Name']")
      .fill(value);
  }
  public async enterAddress1(shipAdrsRootLocator: string, value: string) {
    await this.page
      .locator(shipAdrsRootLocator)
      .locator("[placeholder='Shipping Address line 1']")
      .fill(value);
  }
  public async selectCountry(shipAdrsRootLocator: string, value: string) {
    await this.page
      .locator(shipAdrsRootLocator)
      .locator("//*[contains(@class,'shippingCountry')]")
      .selectOption({ label: value });
  }
  public async selectState(shipAdrsRootLocator: string, value: string) {
    await this.page
      .locator(shipAdrsRootLocator)
      .locator("//*[contains(@class,'shippingState ')]")
      .selectOption({ label: value });

    try {
      const responsePromise = this.page.waitForResponse(
        (response) =>
          response
            .url()
            .includes("CheckoutShippingServices-UpdateShippingMethodsList") &&
          response.status() == 200
      );
      await responsePromise;
    } catch (error) {}
  }
  public async enterCityName(shipAdrsRootLocator: string, value: string) {
    const city = this.page
      .locator(shipAdrsRootLocator)
      .locator("[placeholder='City']");
    await city.fill(value);
  }
  public async enterZipCode(shipAdrsRootLocator: string, value: string) {
    const zip = this.page
      .locator(shipAdrsRootLocator)
      .locator("[placeholder='Zip']");
    await zip.fill(value);
  }
  public async enterPhoneNumber(shipAdrsRootLocator: string, value: string) {
    let tbxPhone = this.page
      .locator(shipAdrsRootLocator)
      .getByPlaceholder("Phone");
    // await tbxPhone.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await tbxPhone.fill(value);
    // this.page.pause();
  }
  public async clickCheckAdrsBtn() {
    const chekAdrsBtn = this.page.getByRole("button", {
      name: "Check Address",
    });
    await Promise.all([chekAdrsBtn.waitFor(), chekAdrsBtn.click()]);
  }
  public async clickNextPaymentBtn() {
    this.page.waitForLoadState();
    const nxtBtn = this.page.getByRole("button", { name: "Next: Payment" });
    await Promise.all([
      this.page.waitForNavigation({ url: /stage=payment#payment/ }),
      this.page.getByRole("button", { name: "Next: Payment" }).click(),
    ]);
  }
  public async regUserAvailableAdrsCounter(): Promise<number> {
    if (
      await this.page
        .getByRole("combobox", {
          name: "Shipping To",
        })
        .isVisible()
    ) {
      const selectAddress = this.page.getByRole("combobox", {
        name: "Shipping To",
      });
      return (await selectAddress.all()).length;
    }
    return 0;

    // (await selectAddress.allInnerTexts()).forEach((ele) => {
    //   console.log(ele);
    // });
  }
  public async selectAvailableAdress(adr: string) {
    const selectAddress = this.page.getByRole("combobox", {
      name: "Shipping To",
    });

    (await selectAddress.allInnerTexts()).forEach(async (ele) => {
      if (ele === adr) {
        await selectAddress?.selectOption({ label: adr });
      }
    });
  }
  public async enterNewShippingDetails(
    adrsType: string,
    options?: { registerUser?: boolean }
  ) {
    if (options?.registerUser) {
      await this.enterFirstName(adrsType, data.RegisteredUser.firstName);
      await this.enterLastName(adrsType, data.RegisteredUser.lastName);
    } else {
      await this.enterFirstName(adrsType, data.guestUser.firstName);
      await this.enterLastName(adrsType, data.guestUser.lastName);
    }
    await this.enterAddress1(adrsType, data.address1);
    await this.selectCountry(adrsType, "United States");
    await this.selectState(adrsType, data.state);
    await this.enterCityName(adrsType, data.city);
    await this.enterZipCode(adrsType, data.zip);
    await this.enterPhoneNumber(adrsType, data.phone);
  }
  public async fillRegUserExistingShipAdrs(options?: {
    isSDD?: boolean;
    isBopis?: boolean;
    isDtcAndSdd?: boolean;
  }) {
    await this.page.waitForURL(/stage=shipping#shipping/);
    if ((await this.regUserAvailableAdrsCounter()) > 0) {
      if (options?.isDtcAndSdd) {
        await this.selectAvailableAdress(data.existingAddress);
        await this.clickCheckAdrsBtn();
        await this.enterTip(data.Tip);
        if (options?.isBopis) {
          await this.fillPickupPrsnDetails();
        } else {
          await this.clickNextPaymentBtn();
        }
      } else if (options?.isSDD) {
        await this.enterTip(data.Tip);
        await this.selectAvailableAdress(data.existingAddress);
        await this.clickCheckAdrsBtn();
        if (options?.isBopis) {
          await this.fillPickupPrsnDetails();
        } else {
          await this.clickNextPaymentBtn();
        }
      } else if (options?.isBopis) {
        await this.selectAvailableAdress(data.existingAddress);
        await this.clickCheckAdrsBtn();
        await this.fillPickupPrsnDetails();
      } else {
        await this.selectAvailableAdress(data.existingAddress);
        await this.clickCheckAdrsBtn();
        await this.clickNextPaymentBtn();
      }
    } else {
      if (options?.isDtcAndSdd) {
        if (options.isBopis) {
          await this.fillRegUserNewShipAdrs({
            isDtcAndSdd: true,
            isBopis: true,
          });
        } else {
          await this.fillRegUserNewShipAdrs({ isDtcAndSdd: true });
        }
      }
      if (options?.isSDD) {
        if (options.isBopis) {
          await this.fillRegUserNewShipAdrs({ isSDD: true, isBopis: true });
        } else {
          await this.fillRegUserNewShipAdrs({ isSDD: true });
        }
      } else {
        if (options?.isBopis) {
          await this.fillRegUserNewShipAdrs({ isBopis: true });
        } else {
          await this.fillRegUserNewShipAdrs();
        }
      }
    }
  }
  public async fillRegUserNewShipAdrs(options?: {
    isSDD?: boolean;
    isBopis?: boolean;
    isDtcAndSdd?: boolean;
  }) {
    if (options?.isDtcAndSdd) {
      await this.enterNewShippingDetails(this.DtcRootAdrsLocator, {
        registerUser: true,
      });
      await this.clickCheckAdrsBtn();
      await this.enterTip(data.Tip);
    } else if (options?.isSDD) {
      await this.enterTip(data.Tip);
      await this.enterNewShippingDetails(this.SddRootAdrsLocator, {
        registerUser: true,
      });
      await this.clickCheckAdrsBtn();
    } else {
      await this.enterNewShippingDetails(this.DtcRootAdrsLocator, {
        registerUser: true,
      });
      await this.clickCheckAdrsBtn();
    }

    if (options?.isBopis) {
      await this.fillPickupPrsnDetails();
    } else {
      await this.clickNextPaymentBtn();
    }
  }
  public async fillGuestUserShipAdrs(options?: {
    isSDD?: boolean;
    isBopis?: boolean;
    isDtcAndSdd?: boolean;
  }) {
    if (options?.isDtcAndSdd) {
      await this.enterNewShippingDetails(this.DtcRootAdrsLocator);
      await this.clickCheckAdrsBtn();
      await this.enterTip(data.Tip);
      // await this.page.waitForLoadState();
      // await this.enterNewShippingDetails(this.SddRootAdrsLocator);
    } else if (options?.isSDD) {
      await this.enterTip(data.Tip);
      await this.page.waitForLoadState();
      await this.enterNewShippingDetails(this.SddRootAdrsLocator);
      await this.clickCheckAdrsBtn();
    } else {
      await this.enterNewShippingDetails(this.DtcRootAdrsLocator);
      await this.clickCheckAdrsBtn();
    }
    if (options?.isBopis) {
      await this.fillPickupPrsnDetails();
    } else {
      await this.clickNextPaymentBtn();
    }
  }

  // bopis details
  public async enterPickPrsnFname(value: string) {
    await this.page
      .locator(
        'input[name="dwfrm_shipping_shippingAddress_bopisFields_pickupPersonFirstName"]'
      )
      .fill(value);
  }

  public async enterPickPrsnLname(value: string) {
    await this.page
      .locator(
        'input[name="dwfrm_shipping_shippingAddress_bopisFields_pickupPersonLastName"]'
      )
      .fill(value);
  }

  public async enterPickPrsnPhone(value: string) {
    await this.page
      .locator(
        'input[name="dwfrm_shipping_shippingAddress_bopisFields_pickupPersonPhone"]'
      )
      .fill(value);
  }

  public async clickAltrPickPrsnLink() {
    await this.page.getByText("Add an alternate pickup person").click();
  }

  public async enterAltrPickPrsnFname(value: string) {
    await this.page
      .locator(
        'input[name="dwfrm_shipping_shippingAddress_bopisFields_pickupAlternatePersonFirstName"]'
      )
      .type(value);
  }

  public async enterAltrPickPrsnLname(value: string) {
    await this.page
      .locator(
        'input[name="dwfrm_shipping_shippingAddress_bopisFields_pickupAlternatePersonLastName"]'
      )
      .type(value);
  }

  public async enterAltrPickPrsnPhone(value: string) {
    await this.page.getByPlaceholder("Phone Number").type(value);
  }

  public async fillPickupPrsnDetails() {
    await this.enterPickPrsnFname(data.PickupPerson.fName);
    await this.enterPickPrsnLname(data.PickupPerson.lName);
    await this.enterPickPrsnPhone(data.PickupPerson.phone);
    await this.clickAltrPickPrsnLink();
    await this.enterAltrPickPrsnFname(data.AlterPickupPerson.fName);
    await this.enterAltrPickPrsnLname(data.AlterPickupPerson.lName);
    await this.enterAltrPickPrsnPhone(data.AlterPickupPerson.phone);
    await this.clickNextPaymentBtn();
  }

  //SDD Tipping

  public async enterTip(value: string) {
    if (value == "10%") {
      await this.page.locator("[class='calculated-tip ']").nth(0).click();
    } else if (value == "15%") {
      await this.page.locator("[class='calculated-tip ']").nth(1).click();
    } else if (value == "20%") {
      await this.page.locator("[class='calculated-tip ']").nth(2).click();
    } else if (value == "0" || value == "0%") {
      console.log("Tip is not given.");
    } else {
      await this.page.getByText("Custom Tip Amount").click();
      await this.page.getByPlaceholder("0.00").type(value);
    }
    try {
      const responsePromise = this.page.waitForResponse(
        (response) =>
          response.url().includes("Checkout-SetTipping") &&
          response.status() == 200
      );
      await responsePromise;
    } catch (error) {}
  }
}
