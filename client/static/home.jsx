import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'

Home = React.createClass({    
    render() {
        return (
            <div id='home'>
                <div id='usermessage'>
                    <h2>Welcome!</h2>
                    <p><strong>Minimal Bears</strong> is an app that will help you learn new sounds in foreign languages.</p>
                    <div className='homebtn' id='guestbutton'><Link to="/train">Continue as Guest</Link></div>
                    <div className='homebtn' id='signinbutton'><Link to="/login" >Sign In</Link></div>
                    <div className='homebtn' id='registerbutton'><Link to="/register">Register</Link></div>
                </div>
                
            </div>
        )
    }
})

export default Home