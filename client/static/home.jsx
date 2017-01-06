import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
//import { TAPi18n } from 'meteor/tap:i18n'

// function in place of strings
const translations = (key) => TAPi18n.__(`home.${key}`)
    
Home = React.createClass({    
    render() {
        const obj = TAPi18n.getLanguages()
        const lang = TAPi18n.getLanguage()
        console.log(obj)
        console.log(lang)
        
        return (
            <div className='panel animated fadeIn' id='home'>
                <div id='usermessage'>
                    <h2>{translations('welcome')}</h2>
                    <p><strong>Minimal Bears</strong>{translations('intro')}</p>
                    <div className='button homebtn' id='guestbutton'><Link className='btnLink' to="/train">{translations('continue')}</Link></div>
                    <div className='button homebtn' id='signinbutton'><Link className='btnLink' to="/login">{translations('signIn')}</Link></div>
                    <div className='button homebtn' id='registerbutton'><Link className='btnLink' to="/register">{translations('register')}</Link></div>
                </div>
                
            </div>
        )
    }
})

export default Home