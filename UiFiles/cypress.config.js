import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
// cd UIFiles
// yarn cypress run --spec "cypress/e2e/**" --headed --browser chrome
