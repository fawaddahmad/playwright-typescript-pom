import { Page } from "@playwright/test";

export default class OrderConfirmation {
  constructor(public page: Page) {}

  public async getOrderNumber() {
    await this.page.waitForLoadState();
    return await this.page
      .locator("//span[@class='summary-details order-number']")
      .textContent();
  }

  public async getSubtotal() {
    return (await this.page.locator(".sub-total").textContent())?.trim();
  }

  public async getMerchFee() {
    return (await this.page.locator(".zip-fee-total")?.textContent())?.trim();
  }

  public async getShipCost() {
    return (
      await this.page.locator(".shipping-total-cost").textContent()
    )?.trim();
  }

  public async getTip() {
    return (
      await this.page.locator(".delivery-tip-amount-total")?.textContent()
    )?.trim();
  }

  public async getTax() {
    return (await this.page.locator(".tax-total").textContent())?.trim();
  }

  public async getEstTotal() {
    return (
      await this.page.locator(".text-right.grand-total-sum").textContent()
    )?.trim();
  }

  public async getOrderSummary() {
    console.log(`Order subtotal: ${await this.getSubtotal()}`);
    console.log(`Merchant Fee: ${await this.getMerchFee()}`);
    console.log(`Shipping Cost: ${await this.getShipCost()}`);
    console.log(`Tip Amount: ${await this.getTip()}`);
    console.log(`Sales Tax: ${await this.getTax()}`);
    console.log(`Estimated Total: ${await this.getEstTotal()}`);
  }
}
