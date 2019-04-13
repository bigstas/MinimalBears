describe('The Record page', function() {
    it('successfully loads the Record page', function() {
        cy.visit('/record')
    })
})

describe('The Arena', function() {
    it('successfully loads the Arena page', function() {
        cy.visit('/train')
    })
    it('displays 3 language options', function() {
        cy.get('.chooseOption').should('have.length', 3)
    })
})

let LAST_JWT = ''
let LAST_REFRESH = ''

const login = function() {
    it('successfully navigates to the Login page', function() {
        //cy.visit('/login')
        cy.get('li[id=cogs]').click()
        cy.get('div[id=dropdown-login]').click()
    })

    it('logs in, with tokens in localStorage', function() {
        cy.get('input[name=email]').type('a@a.com')
        cy.get('input[name=password]').type('aa')
        cy.get('div[id=login-btn]').click()
        // TODO this is considered bad practice (https://docs.cypress.io/guides/references/best-practices.html#Unnecessary-Waiting)
        // maybe we can do this better in future...!
        cy.wait(500)
        cy.clearLocalStorage('non-token').should((ls) => {
            expect(ls.getItem('token')).to.be.a('string')
            expect(ls.getItem('refreshToken')).to.be.a('string')
            expect(ls.getItem('token').split('.')).to.have.length(3) // as there are two "." in a JWT
            expect(ls.getItem('refreshToken')).to.not.contain('.') // TODO: are refresh tokens really not supposed to contain "."?
            expect(ls.getItem('token')).to.be.not.equal(LAST_JWT) // you should get a fresh one with a new login
            expect(ls.getItem('refreshToken')).to.be.not.equal(LAST_REFRESH) // ditto
            LAST_JWT = ls.getItem('token')
            LAST_REFRESH = ls.getItem('refreshToken')
        })
    })
    it('has a username in the navbar (not "guest")', function() {
        cy.get('li[id=username]').should('have.text','aa')
    })
}

const logout = function() {
    it('successfully logs out', function() {
        cy.get('li[id=cogs]').click()
        cy.get('div[id=dropdown-logout]').click()
        cy.clearLocalStorage('non-token').should((ls) => {
            expect(ls.getItem('token')).to.be.null
            expect(ls.getItem('refreshToken')).to.be.null
        })
        cy.wait(2000) // wait for some more errors...!
    })
}

describe('First login' , login)
describe('First logout', logout)
describe('Second login', login)
describe('Second logout', logout)