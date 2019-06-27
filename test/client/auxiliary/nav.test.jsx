import React from 'react'
import { graphql } from 'react-apollo'
// testing imports
import { MockedProvider } from 'react-apollo/test-utils'
import { configure, shallow, mount } from 'enzyme'
import chai from 'chai'
import sinon from 'sinon'
import Adapter from 'enzyme-adapter-react-16'
// Nav page imports
import { Nav, Dropdown } from '/client/auxiliary/nav'

configure({ adapter: new Adapter() })

describe('Nav', function() {
    describe('Main Nav body', function() {
        it('bla', function() {
            let nav = mount(<Nav />)
        })
    })
    describe('Nav dropdown', function() {
        const logoutFunc = sinon.stub()
        const loggedIn = mount(<Dropdown isLoggedIn={true} callbackLogOut={logoutFunc} className='foo' onMouseDown={sinon.stub()} onMouseUp={sinon.stub()} />)
        it('has logout button and no login or register button when this.props.loggedIn == true', function() {
            chai.assert.isTrue(loggedIn.exists('#dropdown-logout'))
            chai.assert.isFalse(loggedIn.exists('#dropdown-login'))
            chai.assert.isFalse(loggedIn.exists('#dropdown-register'))
        })
        it('calls logOut method when you click the logout button', function() {
            chai.assert.equal(logoutFunc.callCount, 0)
            loggedIn.find('#dropdown-logout').simulate('click')
            chai.assert.equal(logoutFunc.callCount, 1)
        })
        const loggedOut = mount(<Dropdown isLoggedIn={false} className='foo' onMouseDown={sinon.stub()} onMouseUp={sinon.stub()} />)
        it('has login button and no logout or register button when this.props.loggedIn == false', function() {
            chai.assert.isFalse(loggedOut.exists('#dropdown-logout'))
            chai.assert.isTrue(loggedOut.exists('#dropdown-login'))
            chai.assert.isTrue(loggedOut.exists('#dropdown-register'))
        })
        
        
    })
})