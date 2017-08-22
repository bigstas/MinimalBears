import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'    
import Translate from 'react-translate-component'

    
const UserHome = React.createClass({
    render() {
        return (
            <div className='panel animated fadeIn' id='userHome'>
                <h2 id="welcome"><Translate content="home.welcome" />, {this.props.username}!</h2>
                <div className='userpic' id='userpicHome'>
                    <p style={{color: '#cccccc'}}>Your <br/> picture <br/> here</p>
                </div>
                <p id="homeStats">Last date logged in: December 25th 1950 <br/>
                Current score: 100 points <br/>
                Favourite contrast: szcz-ść</p>
                <img src={'bear.png'} />
                <img src={'bear2.png'} />
                <img src={'bear3.png'} />
                <img src={'bear4.png'} />
                <img src={'bear6.png'} />
                <img src={'bear7.png'} />
            </div>
        )
    }
})
    
const GuestHome = React.createClass({    
    render() {
        return (
            <div className='panel animated fadeIn' id='guestHome'>
                <div id='usermessage'>
                    <h2><Translate content="home.welcome" />!</h2>
                    <p><strong>Minimal Bears</strong><Translate content="home.intro" /></p>
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
        return ( !!jwt ? <UserHome username={this.props.user} /> : <GuestHome /> )
    }
})

export default Home