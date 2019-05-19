import React from 'react'
// testing imports
import { configure, shallow, mount } from 'enzyme'
import chai from 'chai'
import sinon from 'sinon'
import Adapter from 'enzyme-adapter-react-16'
// the page itself
import { validateEmail, AuthJoinPage } from '/client/auth/joinpage'

configure({ adapter: new Adapter() })

describe('Join page', function() {
    describe('validateEmail function', function() {
        // Should it have some policy on capital letters as well?
        // There are still a lot of really weird email adresses that would pass these tests.
        const config = [
            { description: "doesn't allow emails with no @ sign", positive: false, cases: ["iamamailaddress.com","stas$gmail.com"] },
            { description: "doesn't allow emails with nothing before or after the @ sign", positive: false, cases: ["@gmail.com","@mail.ru", "@hotmail.co.uk", "myemail@"] },
            // this rule is not quite correct - it would be good (but low priority) to get the full rules and use them here
            //{ description: "doesn't allow emails which end in a non-alphabetic character", positive: false, cases: ["stas@gmail.co.4","guy@yahoo.com$","gergo@protonmail.hu."] },
            { description: "allows a bunch of email addresses that don't breach the above rules", positive: true, cases: ["stas@gmail.com", "guy123@cam.ac.uk", "$$$MrMoNeYbAgS$$$@monopoly.YO"] }
        ]
        for (let c of config) {
            const testFunc = c.positive ? chai.assert.isTrue : chai.assert.isFalse
            it(c.description, function() {
                for (let testcase of c.cases) {
                    testFunc(validateEmail(testcase), "failed on " + testcase)
                }
            })
        }
    })
})