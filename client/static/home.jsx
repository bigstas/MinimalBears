import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import INTERPRETED from '../static/translations'; 

Home = React.createClass({    
    render() {
        console.log(this.props);
        return (
            <div id='home'>
                <div id='usermessage'>
                    <h2>{INTERPRETED.welcome[this.props.interfaceLanguage]}</h2>
                    <p><strong>Minimal Bears</strong>{INTERPRETED.hometext[this.props.interfaceLanguage]}</p>
                    <div className='homebtn' id='guestbutton'><Link to="/train">Continue as Guest</Link></div>
                    <div className='homebtn' id='signinbutton'><Link to="/login" >Sign In</Link></div>
                    <div className='homebtn' id='registerbutton'><Link to="/register">Register</Link></div>
                </div>
                
            </div>
        )
    }
});

export default Home;