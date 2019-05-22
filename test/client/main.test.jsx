import { authMiddleware, client } from '/client/main'
import { setContext } from 'apollo-link-context'

import chai from 'chai'

describe('JWT middleware', function() {
    it('adds a JWT when in localStorage', function() {
        localStorage.setItem('token', 'abc')
        const old_context = {foo: 'bar'}
        const new_context = authMiddleware({}, old_context)
        console.dir(new_context)
        chai.assert.equal(new_context.headers.authorization, 'Bearer abc')
    })
})