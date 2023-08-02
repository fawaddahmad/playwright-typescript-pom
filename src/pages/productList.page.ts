import { Page } from "@playwright/test";
import * as data from "../../test-data/test-data.json";
import ENV from "../utils/env";

export default class ProductList {
  constructor(public page: Page) {}

  public async ClickquickView(prodName: string) {
    await this.page.waitForLoadState();
    let qvBtn = this.page.getByRole("link", {
      name: `Quick View for ${prodName}`,
    });
    const viewPort = this.page.viewportSize();
    while ((await qvBtn.isVisible()) == false) {
      if (viewPort) {
        await this.page.mouse.wheel(0, viewPort.height);
      }

      qvBtn = this.page.getByRole("link", {
        name: `Quick View for ${prodName}`,
      });
      //   //   await qvBtn.scrollIntoViewIfNeeded();
    }

    await Promise.all([this.page.waitForLoadState(), qvBtn.click()]);
  }

  public async clickShiptoHome() {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes("hash-check") && response.status() == 200
    );
    await responsePromise;
    let btnShiptoHome = this.page.getByRole("button", {
      name: "ship-to-home Ship to my Home",
    });
    await btnShiptoHome.click();
  }

  public async clickFreeInStorePickup() {
    // const responsePromise = this.page.waitForResponse(
    //   (response) =>
    //     response.url().includes("hash-check") && response.status() == 200
    // );
    // await responsePromise;
    await this.page
      .getByRole("button", { name: "Free In-Store Pickup" })
      .click();
  }

  public async clickSameDayDelivery() {
    // const responsePromise = this.page.waitForResponse(
    //   (response) =>
    //     response.url().includes("hash-check") && response.status() == 200
    // );
    // await responsePromise;
    await this.page.getByRole("button", { name: "Same Day Delivery" }).click();
  }

  public async clickOneTimeDelivery() {
    await this.page.waitForLoadState();
    await this.page
      .locator("span")
      .filter({ hasText: "Deliver one-time only" })
      .click();
  }

  public async clickAutoship() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page
        .locator("#og-offer-container")
        .getByText("AutoShip & Save")
        .click(),
    ]);
  }

  public async clickBtnAddtoCart() {
    await this.page.getByRole("button", { name: "Add to Cart" }).click();
  }

  public async clickCalloutCheckoutBtn() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.getByRole("button", { name: "Checkout" }).click(),
    ]);
  }

  public async closeCheckoutFlyout() {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes("?sw=500&sh=500") && response.status() == 200
    );
    await responsePromise;
    if (
      await this.page.getByRole("button").filter({ hasText: "✕" }).isVisible()
    ) {
      await this.page.getByRole("button").filter({ hasText: "✕" }).click();
    }
  }

  public async addDTCProdToCartQV(products: string[]) {
    for (let index = 0; index < products.length; index++) {
      await this.ClickquickView(products[index]);
      await this.clickShiptoHome();
      await this.clickOneTimeDelivery();
      await this.clickBtnAddtoCart();
      if (products.length > 1 && index < products.length - 1) {
        await this.closeCheckoutFlyout();
      }
    }
    await this.clickCalloutCheckoutBtn();
  }

  public async addProdToCartFromPDP(orderType: string) {
    let products: string[];
    if (orderType == "DTC") {
      products = data.productSKU.DTC;
      for (let index = 0; index < products.length; index++) {
        console.log(`${index + 1} DTC Product: ${products[index]}`);

        await this.page.goto(`${ENV.BASE_URL}/${products[index]}.html`);
        await this.page
          .getByRole("button", {
            name: "ship-to-home Ship to my Home",
          })
          .click();
        await this.clickOneTimeDelivery();
        await this.clickBtnAddtoCart();
      }
    }

    if (orderType == "AUTOSHIP") {
      products = data.productSKU.DTC;
      for (let index = 0; index < products.length; index++) {
        console.log(`${index + 1} Autohip Product: ${products[index]}`);
        await this.page.goto(`${ENV.BASE_URL}/${products[index]}.html`);
        await this.page
          .getByRole("button", {
            name: "ship-to-home Ship to my Home",
          })
          .click();
        await this.clickAutoship();
        await this.clickBtnAddtoCart();
      }
    }

    if (orderType == "BOPIS") {
      products = data.productSKU.BOPIS;
      for (let index = 0; index < products.length; index++) {
        console.log(`${index + 1} BOPIS Product: ${products[index]}`);
        await this.page.goto(`${ENV.BASE_URL}/${products[index]}.html`);
        await this.clickFreeInStorePickup();
        await this.clickBtnAddtoCart();
      }
    }

    if (orderType == "SDD") {
      products = data.productSKU.SDD;
      for (let index = 0; index < products.length; index++) {
        console.log(`${index + 1} SDD Product: ${products[index]}`);
        await this.page.goto(`${ENV.BASE_URL}/${products[index]}.html`);
        await this.clickSameDayDelivery();
        await this.clickBtnAddtoCart();
      }
    }

    // await this.clickCalloutCheckoutBtn();
  }

  public async addAutoshipProdToCartQV(products: string[]) {
    for (let index = 0; index < products.length; index++) {
      await this.ClickquickView(products[index]);
      await this.clickShiptoHome();
      await this.clickAutoship();
      await this.clickBtnAddtoCart();
      if (products.length > 1 && index < products.length - 1) {
        await this.closeCheckoutFlyout();
      }
    }
    await this.clickCalloutCheckoutBtn();
  }

  public async addBOPISProdToCartQV(products: string[]) {
    for (let index = 0; index < products.length; index++) {
      await this.ClickquickView(products[index]);
      await this.clickFreeInStorePickup();
      await this.clickBtnAddtoCart();
      if (products.length > 1 && index < products.length - 1) {
        await this.closeCheckoutFlyout();
      }
    }
    await this.clickCalloutCheckoutBtn();
  }

  public async addSDDProdToCartQV(products: string[]) {
    for (let index = 0; index < products.length; index++) {
      await this.ClickquickView(products[index]);
      await this.clickSameDayDelivery();
      await this.clickBtnAddtoCart();
      if (products.length > 1 && index < products.length - 1) {
        await this.closeCheckoutFlyout();
      }
    }
    await this.clickCalloutCheckoutBtn();
  }

  public async addDTCandBopisToCartQV(
    dtcProducts: string[],
    bopisProduct: string[]
  ) {
    for (let index = 0; index < dtcProducts.length; index++) {
      await this.ClickquickView(dtcProducts[index]);
      await this.clickShiptoHome();
      await this.clickOneTimeDelivery();
      await this.clickBtnAddtoCart();
      await this.closeCheckoutFlyout();
    }
    await this.addBOPISProdToCartQV(bopisProduct);
  }

  public async addDTCandSDDToCartQV(
    dtcProducts: string[],
    sddProduct: string[]
  ) {
    for (let index = 0; index < dtcProducts.length; index++) {
      await this.ClickquickView(dtcProducts[index]);
      await this.clickShiptoHome();
      await this.clickOneTimeDelivery();
      await this.clickBtnAddtoCart();
      await this.closeCheckoutFlyout();
    }
    await this.addSDDProdToCartQV(sddProduct);
  }

  public async addBopisandSDDToCartQV(
    bopisProduct: string[],
    sddProduct: string[]
  ) {
    for (let index = 0; index < bopisProduct.length; index++) {
      await this.ClickquickView(bopisProduct[index]);
      await this.clickFreeInStorePickup();
      await this.clickBtnAddtoCart();
      await this.closeCheckoutFlyout();
    }
    await this.addSDDProdToCartQV(sddProduct);
  }

  public async addDtcBopSddToCartQV(
    dtcProducts: string[],
    bopisProduct: string[],
    sddProduct: string[]
  ) {
    for (let index = 0; index < dtcProducts.length; index++) {
      await this.ClickquickView(dtcProducts[index]);
      await this.clickShiptoHome();
      await this.clickOneTimeDelivery();
      await this.clickBtnAddtoCart();
      await this.closeCheckoutFlyout();
    }
    for (let index = 0; index < bopisProduct.length; index++) {
      await this.ClickquickView(bopisProduct[index]);
      await this.clickFreeInStorePickup();
      await this.clickBtnAddtoCart();
      await this.closeCheckoutFlyout();
    }
    await this.addSDDProdToCartQV(sddProduct);
  }
}
