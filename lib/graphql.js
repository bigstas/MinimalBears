// GraphQL queries, for use with react-apollo's graphql function

import gql from 'graphql-tag'

// Mutations that return no data include "clientMutationId"
// because GraphQL requires at least one field

export const allLanguagesQuery = gql`
query {
    allLanguages {
        nodes {
            name
            id
        }
    }
}`

export const signupMutation = gql`
mutation ($input: SignupInput!) {
    signup(input:$input) {
        tokenPair {
            jwt
            refresh
        }
    }
}`

export const refreshMutation = gql`
mutation ($input:RefreshInput!) {
    refresh(input:$input) {
        jsonWebToken
    }
}`

export const accountInfoQuery = gql`
query {
    getAccountInfo {
        username
        interface
        native
        customNative
        tutorial
        email
    }
}`

export const trainingLanguageQuery = gql`
query {
    allTrainingLanguages {
        nodes {
            name
            id
        }
    }
}`

export const contrastQuery = gql`
query ($languageId:String!) {
    getContrastsWithExamples(languageId:$languageId) {
        nodes {
            name
            id
            examples {
                first
                second
            }
        }
    }
}`

export const moderationQuery = gql`
query ($languageId: String!, $number: Int!) {
    getAudioSubmissions(languageId: $languageId, number: $number) {
        nodes {
            file
            speaker
            item
            stamp
        }
    }
}`

export const approveAudioMutation = gql`
mutation ($input: ModerateAudioInput!) {
    moderateAudio(input: $input) {
        clientMutationId
    }
}`

export const editAudioMutation = gql`
mutation ($input: EditAudioInput!) {
    editAudio(input: $input) {
        clientMutationId
    }
}`

export const submitAudioMutation = gql`
mutation ($input: SubmitAudioInput!) {
    submitAudio (input: $input) {
        clientMutationId
    }
}`

export const itemQuery = gql`
query ($languageId: String!, $number: Int!) {
    getItemsToRecord(languageId: $languageId, number: $number) {
        nodes {
            id
            language
            homophones
        }
    }
}`

export const practiceLanguageQuery = gql`
query ($unit: String, $number: Int) {
    getPracticeLanguages(unit: $unit, number: $number) {
        nodes
    }
}`

export const loginMutation = gql`
mutation ($input: AuthenticateFromEmailInput!) {
    authenticateFromEmail(input: $input) {
        tokenPair {
            jwt
            refresh
        }
    }
}`

export const statsQuery = gql`
query ($languageId: String, $unit: String, $number: Int) {
    getAllStats(languageId: $languageId, unit: $unit, number: $number) {
        nodes {
            stamp
            contrast
            count
            sum
        }
    }
}`

export const completeTutorialMutation = gql`
mutation {
    completeTutorial(input: {clientMutationId:""}) {
        clientMutationId
    }
}`

export const questionQuery = gql`
query ($contrastId:Int) {
    getQuestions(contrastId:$contrastId, number: 10) {
        nodes {
          pair
          first
          second
          file
          correct
        }
    }
}`

export const answerQuestionMutation = gql`
mutation ($input: AnswerQuestionInput!) {
    answerQuestion (input: $input) {
        clientMutationId
    }
}`

export const audioComplaintMutation = gql`
mutation ($input: SubmitAudioComplaintInput!) {
    submitAudioComplaint (input: $input) {
        clientMutationId
    }
}`

export const pairComplaintMutation = gql`
mutation ($input: SubmitPairComplaintInput!) {
    submitPairComplaint (input: $input) {
        clientMutationId
    }
}`

export const itemComplaintMutation = gql`
mutation ($input: SubmitItemComplaintInput!) {
    submitItemComplaint (input: $input) {
        clientMutationId
    }
}`

export const contrastAverageQuery = gql`
query ($contrastId:Int, $unit: String, $number: Int) {
    getContrastAvg(contrastId: $contrastId, unit: $unit, number: $number)
}`

export const pingQuery = gql`
query {
    ping
}`