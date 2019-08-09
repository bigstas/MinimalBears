import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { configure, mount } from 'enzyme'
import { graphql } from 'react-apollo'
import Adapter from 'enzyme-adapter-react-16'
import chai from 'chai'

import { client } from '/client/middleware'
import { pingQuery } from '/lib/graphql'

configure({ adapter: new Adapter() })

describe('Apollo client', function() {
    beforeEach(function(done) {
        localStorage.removeItem('token')
        client.clearStore().then(done)
    })
    afterEach(function() {
        localStorage.removeItem('token')
    })
    
    it('allows React elements to make requests to the server', function(done) {
        // This element will call the server-side ping function
        // If the query succeeds, the test passes
        const PingTestElement = function(props) {
            if (props.data.loading) {
                return 'loading'
            } else if (props.data.error) {
                throw props.data.error
            } else {
                chai.assert.equal(props.data.ping, 'PONG')
                done()
                return props.data.ping
            }
        }
        const PingTestElementWithData = graphql(pingQuery)(PingTestElement)
        const wrapper = mount(
            <ApolloProvider client={client}>
                <PingTestElementWithData/>
            </ApolloProvider>
        )
    })
    
    it('causes a server error if an invalid JWT is in localStorage', function(done) {
        // Put a nonsense JWT in localStorage
        localStorage.setItem('token', 'abc')
        // This element will call the server-side ping function
        // If the query fails, the test passes
        const PingFailTestElement = function(props) {
            if (props.data.loading) {
                return 'loading'
            } else if (props.data.error) {
                console.dir(props.data.error)
                done()
                return 'error!' 
            } else {
                throw new Error('No server error for nonsense JWT!')
            }
        }
        const PingFailTestElementWithData = graphql(pingQuery)(PingFailTestElement)
        const wrapper = mount(
            <ApolloProvider client={client}>
                <PingFailTestElementWithData/>
            </ApolloProvider>
        )
    })
})