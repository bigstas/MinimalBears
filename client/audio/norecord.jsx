import React from 'react'
import { Link } from 'react-router'  
import Translate from 'react-translate-component'

const NoRecordPage = props => {
    if (props.loggedIn) {
        return (
            <div className="panel">
                <Translate component="h1" content="norecord.title" />
                <Translate component="p" content={"norecord."+props.reason} />
            </div>
        )
    } else {
        return (
            <div className="panel animated fadeIn">
                <Translate component="h1" content="norecord.title" />
                {/*TODO tidy Link*/}
                <p><Translate content="norecord.onlyLoggedIn" /><Link to="/login"><Translate content="norecord.login" /></Link><Translate content="norecord.loginReason" /></p>
                <p><Translate content="norecord.noAccount" /><Link to="/register"><Translate content="norecord.signup" /></Link>!</p>
            </div>
        )
    }
}

export default NoRecordPage