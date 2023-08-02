import {
  Browser,
  BrowserContext,
  test as baseTest,
  chromium,
  firefox,
  webkit,
} from "@playwright/test";
import LoginPage from "../pages/login.page";
import Wrapper from "../base/Wrapper";
import HeaderSection from "../pages/header.section";
import ProductList from "../pages/productList.page";
import CheckoutUsers from "../pages/checkoutUsers.page";
import CheckoutShipping from "../pages/checkoutShipping.page";
import CheckoutBilling from "../pages/checkoutBilling.page";
import CheckoutReview from "../pages/checkoutReview.page";
import OrderConfirmation from "../pages/orderConfirmation.page";
import * as data from "../../auth.json";

const test = baseTest.extend<{
  loginPage: LoginPage;
  base: Wrapper;
  headerSection: HeaderSection;
  productList: ProductList;
  checkoutUsers: CheckoutUsers;
  checkoutShipping: CheckoutShipping;
  checkoutBilling: CheckoutBilling;
  checkoutReview: CheckoutReview;
  orderConfirmation: OrderConfirmation;
}>({
  // page: async ({}, use, testInfo) => {
  //   // let fileName = testInfo.file.split(path.sep).pop();
  //   // if (testInfo.project.name.match(/lambdatest/)) {
  //   //     modifyCapabilities(
  //   //         testInfo.project.name,
  //   //         `${testInfo.title} - ${fileName}`
  //   //     );
  //   //     const browser = await chromium.connect(`wss://cdp.lambdatest.com/playwright?capabilities=
  //   // ${encodeURIComponent(JSON.stringify(capabilities))}`);
  //   //     const context = await browser.newContext(testInfo.project.use);
  //   //     const ltPage = await context.newPage()
  //   //     await use(ltPage);
  //   //     const testStatus = {
  //   //         action: "setTestStatus",
  //   //         arguments: {
  //   //             status: testInfo.status,
  //   //             remark: getErrorMessage(testInfo, ["error", "message"]),
  //   //         },
  //   //     };
  //   //     await ltPage.evaluate(() => { },
  //   //         `lambdatest_action: ${JSON.stringify(testStatus)}`);
  //   //     await ltPage.close();
  //   //     await context.close();
  //   //     await browser.close();
  //   // } else {

  //   //     const browser = await chromium.launch();
  //   //     const context = await browser.newContext();
  //   //     const page = await context.newPage()
  //   //     await use(page);
  //   // }

  //   if (testInfo.project.name.match("chromium")) {
  //     const browser = await chromium.launch();
  //     let context: BrowserContext;
  //     if (testInfo.title.match(/Registered/)) {
  //       console.log("Registered User");
  //       context = await browser.newContext({
  //         httpCredentials: {
  //           username: "storefront",
  //           password: "Pet2022",
  //         },
  //         // storageState: "./auth.json",
  //       });
  //     } else {
  //       console.log("Guest User");
  //       context = await browser.newContext({
  //         httpCredentials: {
  //           username: "storefront",
  //           password: "Pet2022",
  //         },
  //       });
  //     }

  //     const page = await context.newPage();
  //     await use(page);
  //   } else if (testInfo.project.name.match("firefox")) {
  //     const browser = await firefox.launch();
  //     const context = await browser.newContext({
  //       httpCredentials: {
  //         username: "storefront",
  //         password: "Pet2022",
  //       },
  //     });
  //     const page = await context.newPage();
  //     await use(page);
  //   } else if (testInfo.project.name.match("webkit")) {
  //     const browser = await webkit.launch();
  //     const context = await browser.newContext({
  //       httpCredentials: {
  //         username: "storefront",
  //         password: "Pet2022",
  //       },
  //     });
  //     const page = await context.newPage();
  //     await use(page);
  //   }
  // },

  base: async ({ page }, use) => {
    await use(new Wrapper(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  headerSection: async ({ page }, use) => {
    await use(new HeaderSection(page));
  },
  productList: async ({ page }, use) => {
    await use(new ProductList(page));
  },
  checkoutUsers: async ({ page }, use) => {
    await use(new CheckoutUsers(page));
  },
  checkoutShipping: async ({ page }, use) => {
    await use(new CheckoutShipping(page));
  },
  checkoutBilling: async ({ page }, use) => {
    await use(new CheckoutBilling(page));
  },
  checkoutReview: async ({ page }, use) => {
    await use(new CheckoutReview(page));
  },
  orderConfirmation: async ({ page }, use) => {
    await use(new OrderConfirmation(page));
  },
});

export default test;
export const expect = test.expect;
