// Navigation bar

import React from 'react'
import { Link, IndexLink } from 'react-router'

Dropdown = React.createClass({
    render() {
        return (
            <div className='dropdownDiv' onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp}>
                <div className='dropdownElement'><Link className='dropdownText' to="/profile">Profile</Link></div>
                <div className='dropdownElement'>...</div>
            {/*    <div className='dropdownElement'>Something else</div>
                <div className='dropdownElement'>Something more</div>*/}
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
        return (
            <div className="container">
                <nav>
                    <ul>
                        <li><IndexLink to="/" activeClassName="activeNavbarElement">Home</IndexLink></li>
                        <li><Link to="/about" activeClassName="activeNavbarElement">About</Link></li>
                        <li><Link to="/train" activeClassName="activeNavbarElement">Train</Link></li>
                        <li><Link to="/record" activeClassName="activeNavbarElement">Record</Link></li>
            {/*<li><Link to="/profile" activeClassName="active">Profile</Link></li>*/}
                        <li style={{float: 'right', cursor: 'pointer'}} onClick={this.dropdownTrue}><img src="gears-original.png" style={{height: '40px'}} /></li>
                        <li style={{float: 'right'}}><Link id="loggedInAs" to="/profile" activeClassName="activeNavbarElement">{!!this.props.username ? this.props.username : "Guest"}</Link></li>
                    </ul>
                </nav>
                {this.state.dropdown ? <Dropdown onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} /> : <span />}
            </div>
        )
    }
})