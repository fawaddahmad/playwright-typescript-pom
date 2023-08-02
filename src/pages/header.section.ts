import { Page } from "@playwright/test";
import * as data from "../../test-data/test-data.json";

export default class HeaderSection {
  constructor(public page: Page) {}

  public async hoverMainMenuItem(mainMenuName: string) {
    const menu = this.page.getByRole("button", { name: mainMenuName });
    await Promise.all([this.page.waitForLoadState(), menu.hover()]);
  }

  public async clickDogDryfood() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.locator("#dog_food_dryfood").click(),
    ]);
  }

  public async clickDogWetfood() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.locator("#dog_food_wetfood").click(),
    ]);
  }

  public async clickDogFreezDryfood() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.locator("#dog_food_freeze-driedfood").click(),
    ]);
  }

  public async clickDogFoodToppers() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.locator("#dog_food_foodtoppers").click(),
    ]);
  }

  public async hoverCartLink() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.locator(".minicart-link").click(),
    ]);
  }

  public async clickMiniCartCheckoutBtn() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.getByRole("button", { name: "Checkout" }).click(),
    ]);
  }

  public async clickCalloutPopupViewBagBtn() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.getByRole("button", { name: "View Bag" }).click(),
    ]);
  }

  public async clickCalloutPopupCloseBtn() {
    await Promise.all([
      this.page.waitForLoadState(),
      this.page.getByRole("button").filter({ hasText: "✕" }).click(),
    ]);
  }

  public async selectStore() {
    await this.page
      .getByRole("link", { name: "findStore" })
      .filter({ hasText: "Find A Store" })
      .click();
    await this.page.getByPlaceholder("ZipCode").click();
    await this.page.getByPlaceholder("ZipCode").fill(data.StoreLocator.zip);
    await this.page.getByRole("button", { name: "search-icon" }).click();
    await this.page.locator(`#input-${data.StoreLocator.store}`).click();
    // await this.page.locator("svg").click();
  }
}
