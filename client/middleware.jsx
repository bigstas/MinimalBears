// Connect to the database using Apollo
// Add middleware that adds a Json Web Token (JWT) to the request header

import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const authMiddleware = function(request, old_context) {
    // add authorization to the headers
    const token = localStorage.getItem('token')
    if (!!token) {
        const new_context = {
            ...old_context,
            headers: {
                ...old_context.headers,
                authorization: 'Bearer ' + token || null
            }
        }
        console.log('middleware')
        console.log(new_context)
        return new_context
    } else {
        return old_context
    }
}

const client = new ApolloClient({
    link: setContext(authMiddleware).concat(new HttpLink({ uri: '/graphql' })),
    cache: new InMemoryCache()
})

export { authMiddleware, client }