import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
// testing imports
import { MockedProvider } from 'react-apollo/test-utils'
import { configure, shallow, mount } from 'enzyme'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import Adapter from 'enzyme-adapter-react-16'
// the page itself
import { validateEmail, signupFunction, allLanguagesFunction, AuthJoinPage } from '/client/auth/joinpage'

configure({ adapter: new Adapter() })
chai.use(chaiAsPromised) // for promises

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

    describe('trivial promise', function() {
        it('2+2==4', function() {
            // "eventually" is the method for handling promises
            chai.assert.eventually.equal(Promise.resolve(2+2), 4, "promise did not resolve")
        })
    })

    describe('signupFunction', function() {
        const ping = gql`query { ping }`
        const pingConfig = { name: 'pingFn' }

        // NOTE: if there will be a bunch of tests here (which there probably will),
        // and each one will need setup/teardown code (e.g. of React elements),
        // then consider using beforeEach() and related functions to avoid code repetition.
        function Elem(props) {
            console.log(this.props)
            return (
                <div>
                    <p>{props.text}</p>
                    <p>{props.pingFn ? props.pingFn.ping : "hello again"}</p>
                </div>
            )
        }
        const PlainElem = mount((React.createElement(() => <Elem text="Hello World" />)))
        const ElemWithPing = graphql(ping, pingConfig)(React.createElement(() => <Elem text="Hello World" />))
        const MountedElemWithPing = mount(<ElemWithPing />)
        it('element has props', function() {
            chai.assert.exists(PlainElem.props) // this passes
        })
        it('element gets data', function() {
            chai.assert.isDefined(MountedElemWithPing.props.pingFn.ping) // this fails, Apollo needs a Client
        })
    })
    
    /*describe('signupFunction', function () {
        it('signs up with new credentials', function() {
            const uniqueUser = new Date().toString().replace(/\s+/g, '').toLowerCase()
            const uniqueEmail = uniqueUser + "@minimalbears.com"
            const uniqueCreds = {
                email: uniqueEmail,
                password: "1234",
                username: uniqueUser,
                interface: 'eng',
                nativeArray: ['eng', 'deu'],
                customNative: null
            }
            const params = {
                variables: {
                    input: uniqueCreds
                }
            }
            chai.assert.isFulfilled(signup(params), "signup promise is not fulfilled")
        })
    })*/
})