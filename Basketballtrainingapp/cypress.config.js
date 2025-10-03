const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Zoek naar .cy.js/.cy.ts en eenvoudige specs onder cypress/e2e
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
});
