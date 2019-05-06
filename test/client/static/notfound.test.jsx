import React from 'react'
import { shallow, configure } from 'enzyme'
import chai from 'chai'
import Adapter from 'enzyme-adapter-react-16'
import NotFound from '/client/static/notfound'

configure({ adapter: new Adapter() })

describe('Not Found page', function () {
    it('has text', function () {
        const notfound = shallow(<NotFound />)
        chai.assert.exists(notfound.text())
    })
})