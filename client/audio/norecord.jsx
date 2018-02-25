import React from 'react'
import { Link } from 'react-router'  
import Translate from 'react-translate-component'
import { Selector } from '../training/selector'

const PreRecord = React.createClass({
    render() {
        return (
            <div className='panel animated fadeIn' id='preRecord'>
                <Translate component='h1' content='record.preRecord.heading' />
                <Translate component='p'  content='record.preRecord.intro' />
                <Translate component='p'  content='record.preRecord.contributions' />
                <Translate component='p'  content='record.preRecord.tutorial' />
                <div className="button" onClick={this.props.callback}><Translate content='record.preRecord.buttonLabel' /></div>
            </div>
        )
    }
})

const RecordSelector = React.createClass({
    render() {
        const options = [{
            id: 'eng',
            text: <Translate content={"train.language.eng"} />
        },
        {
            id: 'pol',
            text: <Translate content={"train.language.pol"} />
        }]
        
        return (
            <Selector
                selectionMessage="norecord.recordSelector.selectRecordingLanguage"
                options={options}
                callback={this.props.callback}
            />
        )
    }
})

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
                <p><Translate content="norecord.onlyLoggedIn" /><Link to="/login"><Translate content="norecord.login" /></Link><Translate content="norecord.loginReason" /></p>
                <p><Translate content="norecord.noAccount" /><Link to="/register"><Translate content="norecord.signup" /></Link>!</p>
            </div>
        )
    }
}

export { PreRecord, RecordSelector, NoRecordPage }