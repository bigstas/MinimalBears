// Navigation bar

import React from 'react'
import { Link, IndexLink } from 'react-router'

import counterpart from 'counterpart'
import Translate from 'react-translate-component'    
    
const Dropdown = React.createClass({
    handleClick (newLocale) {
        counterpart.setLocale(newLocale)
    },
    logOut() {
        this.props.callbackLogOut()
        alert("You are logging out :)")
    },
    
    render() {
        let authElement
        if (this.props.username) {
            authElement = <div className='dropdownElement' onClick={this.logOut}>Log out</div>
        } else {
            // TO DO: this link should not be available if you are currently on the login page!
            authElement = <div className='dropdownElement'><Link className='plainLink' to="/login">Log in</Link></div>
        }
        
        return (
            <div className='dropdownDiv' onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp}>
            {/*<div className='dropdownElement'><em>Settings coming soon in Beta</em></div>
                <div className='dropdownElement'><Link className='dropdownText' to="/profile">Profile</Link></div>
                <hr />*/}
                {authElement}
                <hr />
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'eng')}>English</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'esp')}>Español</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'deu')}>Deutsch</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'pol')}>Polski</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'hun')}>Magyar</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'lit')}>Lietuvių</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'chm')}>中文</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'rus')}>Русский</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'far')}>فارسی</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'geo')}>ქართული</div>
            </div>
        )
    }
})

const Nav = React.createClass({
    getInitialState () {
        return {
            dropdown: false
        }
    },
    
    dropdownTrue () {
        this.setState({ dropdown: true })
    },
    
    componentDidMount: function () {
        window.addEventListener('mousedown', this.pageClick, false)
    },
    
    pageClick: function (e) {
        if (this.mouseIsDownOnDropdown) { return } 
        else { this.setState({ dropdown: false }) }
    },

    // it's funny because this.mouseIsDownOnDropdown is never initialised
    mouseDownHandler: function () {
        this.mouseIsDownOnDropdown = true
    },
    mouseUpHandler: function () {
        this.mouseIsDownOnDropdown = false
    },
    
    render() { 
        return (
            <div className="container">
                <nav>
                    <ul>
                        <li><IndexLink to="/" activeClassName="activeNavbarElement"><Translate content="nav.home" /></IndexLink></li>
                        <li><Link to="/about" activeClassName="activeNavbarElement"><Translate content="nav.about" /></Link></li>
                        <li><Link to="/train" activeClassName="activeNavbarElement"><Translate content="nav.train" /></Link></li>
                        <li><Link to="/record" activeClassName="activeNavbarElement"><Translate content="nav.record" /></Link></li>
                        <li style={{float: 'right', cursor: 'pointer'}} onClick={this.dropdownTrue}><img src="cogwheels.png" style={{height: '40px'}} /></li>
                        <li style={{float: 'right'}}><p>{!!this.props.username ? this.props.username : <Translate content="nav.guest" />}</p></li>
                    </ul>
                </nav>
                {this.state.dropdown ?
                    <Dropdown
                        onMouseDown={this.mouseDownHandler}
                        onMouseUp={this.mouseUpHandler}
                        callbackLogOut={this.props.callbackLogOut}
                        username={this.props.username}
                        userId={this.props.userId}
                    /> :
                    <span />
                }
            </div>
        )
    }
})

export default Nav