import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'    
import Translate from 'react-translate-component'
import Joyride from 'react-joyride'
    
const steps = [
        {
          title: 'Title only steps — As they say: Make the font bigger!',
          text: "text text text",
          selector: '#welcome',
          position: 'right',
          style: {
            beacon: {
              offsetY: 0
            }
          }
        },
        {
          title: 'Our Mission',
          text: 'Can be advanced by clicking an element through the overlay hole.',
          selector: '#userpicHome',
          position: 'bottom',
          style: {
            beacon: {
              offsetY: 30
            },
            button: {
              display: 'none',
            }
          }
        },
        {
          title: 'Unmounted target',
          text: 'This step tests what happens when a target is missing',
          selector: '.homeStats',
        }
]

    
const UserHome = React.createClass({
    render() {
        return (
            <div>
                <Joyride
                    ref={c => (this.joyride = c)}
                    debug={true}
                    autoStart={true}
                    locale={{
                      back: (<span>Back</span>),
                      close: (<span>Close</span>),
                      last: (<span>Last</span>),
                      next: (<span>Next</span>),
                      skip: (<span>Skip</span>),
                    }}
                    run={true}
                    showOverlay={false}
                    showSkipButton={true}
                    showStepsProgress={true}
                    steps={steps}
                    type='continuous'
                />
                <div className='panel animated fadeIn' id='userHome'>
                    <h2 id="welcome"><Translate content="home.welcome" />, {this.props.username}!</h2>
                    <div className='userpic' id='userpicHome'>
                        <p style={{color: '#cccccc'}}>Your <br/> picture <br/> here</p>
                    </div>
                    <p id="homeStats">Last date logged in: December 25th 1950 <br/>
                    Current score: 100 points <br/>
                    Favourite contrast: szcz-ść</p>
                </div>
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
        return ( !!this.props.user ? <UserHome username={this.props.user} /> : <GuestHome /> )
    }
})

export default Home