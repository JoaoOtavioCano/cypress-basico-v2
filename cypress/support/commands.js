Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('João')
    cy.get('#lastName').type('Cano')
    cy.get('#email').type('joao@exemplo.com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('Enviar').click()
})