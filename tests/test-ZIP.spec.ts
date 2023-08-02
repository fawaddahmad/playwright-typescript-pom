import test, { expect } from "../src/utils/fixtures";
import ENV from "../src/utils/env";
import * as data from "../test-data/test-data.json";
import * as OTPAuth from "otpauth";
import orderType from "../src/utils/orderType";

// test.describe.configure({ mode: "parallel" });

/////////////////////////////////////////////////////////////////////////////////////////
// ZIP Orders
/////////////////////////////////////////////////////////////////////////////////////////

test("Place @BOPIS Order as @Guest User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.BOPIS_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.guestCheckout();
  await checkoutShipping.fillPickupPrsnDetails();
  await checkoutBilling.enterNewBilngAdrs();
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Guest user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @DTC Order as @Guest User using @ZIP Payment", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await productList.addProdToCartFromPDP(orderType.DTC_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.guestCheckout();
  await checkoutShipping.fillGuestUserShipAdrs();
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Guest user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @DTC and BOPIS @mix Cart Order as @Guest User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.DTC_ORDER);
  await productList.addProdToCartFromPDP(orderType.BOPIS_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.guestCheckout();
  await checkoutShipping.fillGuestUserShipAdrs({
    isBopis: true,
  });
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Guest user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @DTC @BOPIS and @SDD @mix Cart Order as @Guest User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.DTC_ORDER);
  await productList.addProdToCartFromPDP(orderType.BOPIS_ORDER);
  await productList.addProdToCartFromPDP(orderType.SDD_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.guestCheckout();
  await checkoutShipping.fillGuestUserShipAdrs({
    isBopis: true,
    isDtcAndSdd: true,
  });
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Guest user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @SDD Order as @Guest User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.SDD_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.guestCheckout();
  await checkoutShipping.fillGuestUserShipAdrs({ isSDD: true });
  // await checkoutBilling.enterNewBilngAdrs();
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Guest user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @BOPIS and @SDD @mix Cart Order as @Guest User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.BOPIS_ORDER);
  await productList.addProdToCartFromPDP(orderType.SDD_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.guestCheckout();
  await checkoutShipping.fillGuestUserShipAdrs({
    isBopis: true,
    isSDD: true,
  });
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Guest user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @DTC and @SDD @mix Cart Order as @Guest User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.DTC_ORDER);
  await productList.addProdToCartFromPDP(orderType.SDD_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.guestCheckout();
  await checkoutShipping.fillGuestUserShipAdrs({
    isDtcAndSdd: true,
  });
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Guest user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @BOPIS Order as @Registered User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.BOPIS_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.regUserCheckout();
  await checkoutShipping.fillPickupPrsnDetails();
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Registered user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @DTC Order as @Registered User using @ZIP Payment", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await productList.addProdToCartFromPDP(orderType.DTC_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.regUserCheckout();
  await checkoutShipping.fillRegUserExistingShipAdrs();
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Registered user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @DTC and @BOPIS @mix Cart Order as @Registered User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.DTC_ORDER);
  await productList.addProdToCartFromPDP(orderType.BOPIS_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.regUserCheckout();
  await checkoutShipping.fillRegUserExistingShipAdrs({
    isBopis: true,
  });
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Registered user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @DTC @BOPIS and @SDD @mix Cart Order as @Registered User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.DTC_ORDER);
  await productList.addProdToCartFromPDP(orderType.BOPIS_ORDER);
  await productList.addProdToCartFromPDP(orderType.SDD_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.regUserCheckout();
  await checkoutShipping.fillRegUserExistingShipAdrs({
    isBopis: true,
    isDtcAndSdd: true,
  });
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Registered user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @SDD Order as @Registered User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.SDD_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.regUserCheckout();
  await checkoutShipping.fillRegUserExistingShipAdrs({ isSDD: true });
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Registered user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @BOPIS and @SDD @mix Cart Order as @Registered User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.BOPIS_ORDER);
  await productList.addProdToCartFromPDP(orderType.SDD_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.regUserCheckout();
  await checkoutShipping.fillRegUserExistingShipAdrs({
    isBopis: true,
    isSDD: true,
  });
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Registered user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});

test("Place @DTC and @SDD @mix Cart Order as @Registered User using @ZIP", async ({
  page,
  headerSection,
  productList,
  checkoutUsers,
  checkoutBilling,
  checkoutShipping,
  checkoutReview,
  orderConfirmation,
}) => {
  await page.goto(ENV.BASE_URL);
  await headerSection.selectStore();
  await productList.addProdToCartFromPDP(orderType.DTC_ORDER);
  await productList.addProdToCartFromPDP(orderType.SDD_ORDER);
  await productList.clickCalloutCheckoutBtn();
  await checkoutUsers.regUserCheckout();
  await checkoutShipping.fillRegUserExistingShipAdrs({
    isDtcAndSdd: true,
  });
  await checkoutBilling.fillZIPPaymentDeails();
  await checkoutReview.clickPlaceOrderBtn();
  console.log(
    `Registered user has placed this order: ${await orderConfirmation.getOrderNumber()}`
  );
  await expect(page, "title is not correct").toHaveTitle(
    "Order Confirm | Pet Supermarket"
  );
  await orderConfirmation.getOrderSummary();
});
