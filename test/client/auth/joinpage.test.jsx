import React from 'react'
import { graphql } from 'react-apollo'
import { browserHistory } from 'react-router'
import counterpart from 'counterpart'
import gql from 'graphql-tag'
// testing imports
import { MockedProvider } from 'react-apollo/test-utils'
import { configure, shallow, mount } from 'enzyme'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import Adapter from 'enzyme-adapter-react-16'
// the page itself
import { validateEmail, JoinPageWithData } from '/client/auth/joinpage'
// GraphQL queries
import { allLanguagesQuery, signupMutation } from '/lib/graphql'

configure({ adapter: new Adapter() })
chai.use(chaiAsPromised) // for promises

require('/lib/translations/eng')
counterpart.setLocale('eng')

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
    
    describe('GraphQL queries', function() {
        let joinPage
        
        beforeEach(function() {
            sinon.stub(browserHistory, 'push').callsFake(()=>{})
            
            mocks = [
                {
                    request: {
                        query: allLanguagesQuery},
                    result: {
                        data: {allLanguages: {nodes: [{id:'eng', name:'English'},
                                                      {id:'deu', name:'Deutsch'}]}}}
                },
                {
                    request: {
                        query: signupMutation,
                        variables: {input: {
                            email: 'email@example.com',
                            password: "1234",
                            username: 'user',
                            interface: 'eng',
                            nativeArray: ['eng', 'deu'],
                            customNative: null}}},
                    result: {
                        data: {tokenPair: {jwt: 'myjwt', refresh: 'myrefreshtoken'}}} 
                }
            ]
            
            const wrapper = mount(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <JoinPageWithData />
                </MockedProvider>
            )
            joinPage = wrapper.find('JoinPage').first().instance()
        })
        
        it('signing up with valid values redirects to homepage', function(done) {
            joinPage.setState({
                username: 'user',
                emailValue: 'email@example.com',
                passwordValue: '1234',
                confirmPassword: '1234',
                nativeLanguage: ['eng','deu'],
                customNativeLanguage: null
            }, () => {  // after state has been set
                joinPage.handleSubmit(new Event('')).then(() => {
                    chai.assert.isTrue(browserHistory.push.called)
                    done()
                })
            })
        })
        // TODO need to test invalid values for signup
        // TODO need to test languages in dropdown
        // TODO need to test loading page if no response 
    })
})