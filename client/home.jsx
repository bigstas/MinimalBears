import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';


Profile = React.createClass({
    render() {
        return (
            <div id='home'>
                <div id='usermessage'>
                    <h2>Welcome!</h2>
                    <p><strong>Minimal Bears</strong> is an app that will help you learn new sounds in foreign languages.</p>
                    <div className='homebtn' id='guestbutton'>Continue as Guest</div>
                    <div className='homebtn' id='signinbutton'>Sign In</div>
                    <div className='homebtn' id='registerbutton'>Register</div>
                </div>
                
            </div>
        )
    }
});

export default createContainer(({params}) => {return {};}, Profile);