import gql from 'graphql-tag'

const allLanguages = gql`query {
    allLanguages {
        nodes {
            name
            id
        }
    }
}`

const signup = gql`mutation ($input: SignupInput!) {
    signup(input:$input) {
        clientMutationId
    }
}`

export { allLanguages, signup }