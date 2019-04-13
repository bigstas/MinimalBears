describe('The Record page', function() {
    it('successfully loads', function() {
        cy.visit('/record')
    })
})

describe('The Arena', function() {
    it('successfully loads', function() {
        cy.visit('/train')
    })
    it('displays 3 language options', function() {
        cy.get('.chooseOption').should('have.length', 3)
    })
})

describe('Plain login' , function() {
    it('successfully loads the Login page', function() {
        cy.visit('/login')
    })

    it('logs in', function() {
        cy.get('input[name=email]').type('a@a.com')
        cy.get('input[name=password]').type('aa')
        cy.get('div[id=login-btn]').click()
    })
})

describe('Immediate logout', function() {
    it('successfully logs out', function() {
        //cy.get('li[id=cogs]').click()
        //cy.get('div[id=dropdown-logout]').click()
    })
})