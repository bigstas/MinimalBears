// Navigation bar

import React from 'react'
import { Link, IndexLink } from 'react-router'

// function in place of strings
const translations = (key) => TAPi18n.__(`navbar.${key}`)
    
Dropdown = React.createClass({
    setLanguage(lang) {
        /* Set the language for the internationalisation library to whatever what chosen.
         */
        TAPi18n.setLanguage(lang)
        
        // debug console log
        const currentLanguage = TAPi18n.getLanguage()
        console.log(currentLanguage)
    },
    
    render() {
        return (
            <div className='dropdownDiv' onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp}>
                <div className='dropdownElement'><em>Settings coming soon in Beta</em></div>
                {/*<div className='dropdownElement'><Link className='dropdownText' to="/profile">Profile</Link></div>
                <hr />
                <div className='dropdownElement' onClick={this.setLanguage.bind(this,'en')}>English</div>
                <div className='dropdownElement' onClick={this.setLanguage.bind(this,'pl')}>Polski</div>
                <div className='dropdownElement' onClick={this.setLanguage.bind(this,'zh')}>中文</div> */}
            </div>
        )
    }
})

Nav = React.createClass({
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
        const guest = translations('guest')
        return (
            <div className="container">
                <nav>
                    <ul>
                        <li><IndexLink to="/" activeClassName="activeNavbarElement">{translations('home')}</IndexLink></li>
                        <li><Link to="/about" activeClassName="activeNavbarElement">{translations('about')}</Link></li>
                        <li><Link to="/train" activeClassName="activeNavbarElement">{translations('train')}</Link></li>
                        <li><Link to="/record" activeClassName="activeNavbarElement">{translations('record')}</Link></li>

                        <li style={{float: 'right', cursor: 'pointer'}} onClick={this.dropdownTrue}><img src="cogwheels.png" style={{height: '40px'}} /></li>
                        <li style={{float: 'right'}}><Link id="loggedInAs" to="/profile" activeClassName="activeNavbarElement">{!!this.props.username ? this.props.username : guest}</Link></li>
                    </ul>
                </nav>
                {this.state.dropdown ? <Dropdown onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} /> : <span />}
            </div>
        )
    }
})