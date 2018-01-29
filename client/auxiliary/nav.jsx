// Navigation bar
import React from 'react'
import { Link, IndexLink } from 'react-router'
import counterpart from 'counterpart'
import Translate from 'react-translate-component'    
    
const BetaSign = React.createClass({
    render() {
        const styles = {
            color: 'white',
            fontSize: '8px',
            textAlign: 'center',
            backgroundColor: 'black',
            position: 'relative',
            bottom: '10px'
        }
        return (
            <div style={styles}>BETA</div>
        )
    }
})

const Dropdown = React.createClass({
    handleClick (newLocale) {
        // Sets locale for <Translate> components.
        counterpart.setLocale(newLocale)
    },
    
    logOut() {
        this.props.callbackLogOut()
        alert("You are logging out :)")
    },
    
    render() {
        let authElement, registerElement, contactUs
        if (this.props.username) {
            authElement = <div className='dropdownElement' onClick={this.logOut}><Translate content="nav.logout" /></div>
            registerElement = <span /> // "empty" element
            contactUs = <div className='dropdownElement'><Link className='plainLink' to="/contact"><Translate content="nav.contactUs" /></Link></div>
        } else {
            authElement =     <div className='dropdownElement'><Link className='plainLink' to="/login"><Translate content="nav.login" /></Link></div>
            registerElement = <div className='dropdownElement'><Link className='plainLink' to="/register"><Translate content="nav.register" /></Link></div>
            contactUs = <span />
        }
            
        let moderationElement
        if (this.props.username && true) { // TODO - should read: if this person has the authority / rights to be a moderator AND if this person is logged in
            moderationElement = <div className='dropdownElement'><Link className='plainLink' to="/edit"><Translate content="nav.moderation" /></Link></div>
        } else {
            moderationElement = <span /> // "empty" element
        }
        
        return (
            <div className='dropdownDiv' onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp}>
                {authElement}
                {registerElement}
                {moderationElement}
                {contactUs}
                <hr />
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'eng')}>English</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'fra')}>Français</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'esp')}>Español</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'deu')}>Deutsch</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'pol')}>Polski</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'hun')}>Magyar</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'lit')}>Lietuvių</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'bah')}>Bahasa</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'rus')}>Русский</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'chm')}>中文</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'jap')}>日本語</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'far')}>فارسی</div>
                <div className='dropdownElement' onClick={this.handleClick.bind(this,'ara')}>العربی</div>
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
                        <li style={{maxHeight:'40px'}}><IndexLink to="/" activeClassName="activeNavbarElement" style={{padding: "0", backgroundColor: "#DE8312"}}><img src="favicon.ico" style={{height: "40px"}} /><BetaSign /></IndexLink></li>
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