import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the application", () => {
  cy.visit("/");
});

When("I see the title {string}", (title) => {
  cy.contains("h1", title).should("be.visible");
});

Then("I know Cypress is set up successfully", () => {
  cy.log("Cypress setup is successful!");
});