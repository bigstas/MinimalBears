// Navigation bar

import React from 'react';
import { Link, IndexLink } from 'react-router';

Dropdown = React.createClass({
    render() {
        return (
            <div className='dropdownDiv'>
                <div className='dropdownElement'>Something</div>
                <div className='dropdownElement'>Something else</div>
                <div className='dropdownElement'>Something more</div>
            </div>
        );
    }
});

Nav = React.createClass({
    getInitialState () {
        return {
            dropdown: false
        }
    },
    
    // This is the most stupid piece of code you may have seen in a long time.
    // Obviously a better way would be for a single method to handle the state change, depending on a bool parameter.
    // When I try to do that, the weirdest thing happens - the method *no longer* binds to the intended element,
    // but now binds to all the other <li>'s in the <ul>! WTF!! I have no idea why, but this is my stupid way around it.
    dropdownTrue () {
        console.log("hello!");
        this.setState({ dropdown: true });
    },
    dropdownFalse () {
        this.setState({ dropdown: false });
    },
    
    render() { 
        return (
            <div className="container">
                <nav>
                    <ul>
                        <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
                        <li><Link to="/about" activeClassName="active">About</Link></li>
                        <li><Link to="/train" activeClassName="active">Train</Link></li>
                        <li><Link to="/profile" activeClassName="active">Profile</Link></li>
                        <li style={{float: 'right', cursor: 'pointer'}} onMouseOver={this.dropdownTrue}><img src="gears-original.png" style={{height: '40px'}} /></li>
                    </ul>
                </nav>
                {this.state.dropdown ? <Dropdown /> : <span />}
            </div>
        );
    }
});