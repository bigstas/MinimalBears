import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'

Home = React.createClass({    
    render() {
        return (
            <div className='panel' id='home'>
                <div id='usermessage'>
                    <h2>Welcome!</h2>
                    <p><strong>Minimal Bears</strong> is an app that will help you learn new sounds in foreign languages.</p>
                    <div className='button homebtn' id='guestbutton'><Link className='btnLink' to="/train">Continue as Guest</Link></div>
                    <div className='button homebtn' id='signinbutton'><Link className='btnLink' to="/login" >Sign In</Link></div>
                    <div className='button homebtn' id='registerbutton'><Link className='btnLink' to="/register">Register</Link></div>
                </div>
                
            </div>
        )
    }
})

export default Home