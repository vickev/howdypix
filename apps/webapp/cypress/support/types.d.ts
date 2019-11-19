declare namespace Cypress {
  interface Chainable<Subject> {
    login(userType?: string): Chainable<Subject>;
  }
}
