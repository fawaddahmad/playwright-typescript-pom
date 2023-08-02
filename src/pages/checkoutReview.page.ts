import { Page } from "@playwright/test";

export default class CheckoutReview {
  constructor(public page: Page) {}

  public async clickPlaceOrderBtn() {
    // this.page.on("response", async (res) => {
    //   if (res.url().includes("CheckoutServices-SubmitPayment")) {
    //     const x = await res.json();
    //     console.log(`Order Subtotal: ${await x.order.totals.subTotal}`);
    //     console.log(
    //       `Order totalShippingCost: ${await x.order.totals.totalShippingCost}`
    //     );
    //     console.log(`Order totalTax: ${await x.order.totals.totalTax}`);
    //     try {
    //       console.log(`Order Tip: ${await x.order.totals.tipAmount.formatted}`);
    //     } catch (error) {}

    //     try {
    //       console.log(
    //         `Order MerchangeFee: ${await x.order.totals.zipMerchantFeeForPayment
    //           .formatted}`
    //       );
    //     } catch (error) {}

    //     console.log(`Order grandTotal: ${await x.order.totals.grandTotal}`);

    //     const itemCount = await x.order.items.items;
    //     await itemCount.forEach(async (item) => {
    //       if (item.id != "ZIPMMP") {
    //         console.log(`Product ID is: ${item.id}`);
    //       }
    //     });
    //   }
    // });
    await this.page.waitForLoadState("domcontentloaded");
    const placOrdrBtn = this.page.getByRole("button", { name: "Place Order" });
    await Promise.all([
      // this.page.waitForNavigation({ url: /stage=placeOrder#placeOrder/ }),
      placOrdrBtn.waitFor(),
      placOrdrBtn.click(),
    ]);
  }
}
