describe('My First Test', function () {
    it('does not do anything', function () {
        expect(true).to.equal(true)
    })
})

describe('A non-trivial test', function () {
    it('does almost nothing', function () {
        // Arrange - set up state
        cy.visit('/record') // uses baseUrl definded in cypress.json
        // Act - do something
        cy.contains('Log') // finds elements that contain this string
        // Assert - make an assertion
        cy.url().should('include', '/record')
        // you can pause!
        //cy.pause()
    })
})