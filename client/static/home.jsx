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
                    <img src="bear7.png" />
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
        return ( this.props.username ? <UserProfile username={this.props.username} user_id={this.props.user_id} /> : <GuestHome /> )
    }
})

export default Home