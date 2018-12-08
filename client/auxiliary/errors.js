decodeError = function(error) {
    if (!error) return null
    let type
    if (error.networkError) type = "network"
    if (error.graphQLErrors) {
        let type
        // there's probably a neater way to handle these errors than the below, as these are human-readable rather than codes
        const err = error.graphQLErrors[0].message
        if (err === `duplicate key value violates unique constraint "account_email_key"`) type = "duplicateEmail"
        else if (err === `duplicate key value violates unique constraint "account_pkey"`) type = "duplicateUsername"
        else if (err === `Password does not match`) type = "passwordNoMatch"
    }
    else type = "general"
    return counterpart.translate(["auth", "errors", type])
}

export default decodeError