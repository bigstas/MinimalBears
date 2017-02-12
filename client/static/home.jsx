import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
    
Home = React.createClass({    
    render() {
        
        return (
            <div className='panel animated fadeIn' id='home'>
                    <h2>Welcome!</h2>
                    <p><strong>Minimal Bears</strong> is an app that will help you learn new sounds in foreign languages.</p>
                    <div className='button homebtn' id='guestbutton'><Link className='btnLink' to="/train">Continue as guest</Link></div>
                    <div className='button homebtn transparent' id='signinbutton'>{/*<Link className='btnLink' to="/login">Sign In</Link>*/}Sign In</div>
                    <div className='button homebtn transparent' id='registerbutton'>{/*<Link className='btnLink' to="/register">Sign Up</Link>*/}Sign Up</div>
                
            </div>
        )
    }
})

export default Home