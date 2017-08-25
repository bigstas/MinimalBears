import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'    
import Translate from 'react-translate-component'
import UserProfile from '../auth/profile'

    
const GuestHome = React.createClass({    
    render() {
        return (
            <div className='panel animated fadeIn' id='guestHome'>
                <div id='usermessage'>
                    <h2><Translate content="home.welcome" />!</h2>
                    <p><Translate content="general.article" /><strong><Translate content="general.minbears" /></strong><Translate content="home.intro" /></p>
                    <div className='button homebtn' id='guestbutton'><Link className='btnLink' to="/train"><Translate content="home.continue" /></Link></div>
                    <div className='button homebtn' id='signinbutton'><Link className='btnLink' to="/login"><Translate content="home.signIn" /></Link></div>
                    <div className='button homebtn' id='registerbutton'><Link className='btnLink' to="/register"><Translate content="home.register" /></Link></div>
                </div>
            </div>
        )
    }
})

const Home = React.createClass({
    render() {
        const jwt = localStorage.getItem('token')
        /* Below:
        !!jwt is the correct code for deployment. 
        this.props.username is there so that it is easier to switch between coding the guest experience and the logged-in experience. So it is only there for development purposes.
        */
        return ( /*!!jwt*/ this.props.user ? <UserProfile username={this.props.user} /> : <GuestHome /> )
    }
})

export default Home