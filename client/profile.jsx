//'Profile' page
// Medal images by Farm-Fresh Web (licence: Creative Commons Attribution Licence)

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'

// when there is no logged in user
EmptyProfile = React.createClass({
    render() {
        return (
            <div className='panel animated fadeIn' id='emptyProfile'>
                <h2><Link to="/login">Log in</Link> or <Link to="/register">sign up</Link> to see your personal profile!</h2>
                <ul>
                    <li className='bulletpoints'>View your progress</li>
                    <li className='bulletpoints'>Share your successes with friends</li>
                    <li className='bulletpoints'>Contribute to Minimal Bears by recording words in your native language</li>
                </ul>
            </div>
        )
    }
})

// when there is a logged in user
UserProfile = React.createClass({
    render() {
        return (
            <div className='panel animated fadeIn' id='profile'>
                <div id='topband'>
                    <div id='userpic'>
                        <p style={{color: '#cccccc'}}>Your <br/> picture <br/> here</p>
                    </div>
                    <div id='overview'>
                        <h2 className="animated bounce">{this.props.user}</h2>
                        <p style={{display: 'inline-block'}}>Member since 123 CE</p>
                    {/* <img src={this.data.bronzeMedalImage} alt='bronze' style={{display: 'inline-block'}} /> */}
                    </div>
                </div>
                <div id='graphsDiv'>
                    <h4>Your XP points over time</h4>
                    <div className='graph'>Graph</div>
                    <h4>Average success over time</h4>
                    <div className='graph'>Graph</div>
                    <h4>Relative ease of contrasts</h4>
                    <div className='graph'>Graph</div>
                </div>
            </div>
        )
    }
})

Profile = React.createClass({
    render() {
        return(
            <div>
                {!!this.props.user ?
                    <UserProfile user={this.props.user} /> :
                    <EmptyProfile />
                }
            </div>
        )
    }
})

//export default createContainer(({params}) => {return {}}, Profile)    // do we still need createContainer?
export default Profile