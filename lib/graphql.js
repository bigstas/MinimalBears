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
        tokenPair {
            jwt
            refresh
        }
    }
}`

export { allLanguages, signup }