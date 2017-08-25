import React from 'react'
import { Link } from 'react-router'  
import Translate from 'react-translate-component'

const NoRecordPage = React.createClass({
    render() {
        return (
            <div className="panel">
                <h1><Translate content="norecord.title" /></h1>
                <p><Translate content="norecord.onlyLoggedIn" /><Link to="/login"><Translate content="norecord.login" /></Link><Translate content="norecord.loginReason" /></p>
                <p><Translate content="norecord.noAccount" /><Link to="/register"><Translate content="norecord.signup" /></Link>!</p>
            </div>
            
        )
    }
})

export default NoRecordPage