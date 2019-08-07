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
})