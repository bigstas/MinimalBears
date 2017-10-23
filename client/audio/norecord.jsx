import React from 'react'
import { Link } from 'react-router'  
import Translate from 'react-translate-component'

const NoRecordPage = React.createClass({
    render() {
        let NoRecord 
        if (this.props.loggedIn) {
            let reason
            if (this.props.noSuchLanguage) {
                reason = <p>We aren't using your language as a training language yet.</p>
            } else {
                reason = <p>We are using your language as a training language, but there is nothing that we need recorded at the moment.</p>
            }
            NoRecord =
                <div className="panel">
                    <h1>Oh no!</h1>
                    {reason}
                </div>
        } else {
            NoRecord =
                <div className="panel animated fadeIn">
                    <h1><Translate content="norecord.title" /></h1>
                    <p><Translate content="norecord.onlyLoggedIn" /><Link to="/login"><Translate content="norecord.login" /></Link><Translate content="norecord.loginReason" /></p>
                    <p><Translate content="norecord.noAccount" /><Link to="/register"><Translate content="norecord.signup" /></Link>!</p>
                </div>
        }
        console.log(NoRecord)
        return NoRecord
    }
})

export default NoRecordPage