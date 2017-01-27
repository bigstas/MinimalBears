import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'    
import Translate from 'react-translate-component'
    
    
Home = React.createClass({    
    render() {
        
        return (
            <div className='panel animated fadeIn' id='home'>
                <div id='usermessage'>
                    <Translate content="home.welcome" component="h2" />
                    <p><strong>Minimal Bears</strong><Translate content="home.intro" /></p>
                    <div className='button homebtn' id='guestbutton'><Link className='btnLink' to="/train"><Translate content="home.continue" /></Link></div>
                    <div className='button homebtn transparent' id='signinbutton'><Link className='btnLink' to="/login"><Translate content="home.signIn" /></Link></div>
                    <div className='button homebtn transparent' id='registerbutton'><Link className='btnLink' to="/register"><Translate content="home.register" /></Link></div>
                </div>
                
            </div>
        )
    }
})

export default Home