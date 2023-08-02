import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testMatch: [
    "tests/test-CC.spec.ts",
    "tests/test-PayPal.spec.ts",
    "tests/test-ZIP.spec.ts",
  ],
  timeout: 60 * 1000 * 7,
  retries: 1,
  reporter: [
    ["dot"],
    [
      "json",
      {
        outputFile: "jsonReports/jsonReport.json",
      },
    ],
    [
      "html",
      {
        open: "never",
      },
    ],
    ["allure-playwright"],
  ],

  use: {
    headless: true,
    trace: "off",
    actionTimeout: 60 * 1000 * 2,
    permissions: ["geolocation"],
    screenshot: "on",
    video: "retain-on-failure",
    viewport: null,
    // baseURL: "https://www.petsupermarket.com/",
    launchOptions: {
      slowMo: 500,
    },
    httpCredentials: {
      username: "enterusername",
      password: "enterpwd",
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // viewport: { width: 1680, height: 1050 },
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    {
      name: "Google Chrome",
      use: {
        channel: "chrome",
      },
    },
  ],
  globalSetup: "src/utils/globalSetup.ts",
};

export default config;
