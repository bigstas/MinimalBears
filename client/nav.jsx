// Navigation bar

import React from 'react';
import { Link, IndexLink } from 'react-router';

/*
Dropdown = React.createClass({
    render() {
        return (
            <div className='dropdownDiv'>
                <ul className='dropdownList'>
                    <li className='horizontalListElement'>stuff</li>
                    <li className='horizontalListElement'>more stuff</li>
                    <li className='horizontalListElement'>even more stuff</li>
                </ul>
            </div>
        );
    }
});
*/

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
    
    toggleDropdown() {
        this.setState({
            dropdown: !this.state.dropdown
        });
    },
    
    removeDropdown() {
        this.setState({
            dropdown: false
        });
    },
    
    render() {
        var dropdownClass = "dropdownDiv";
        if (!this.state.dropdown) {
            dropdownClass += " inactiveDropdown";
        }
        
        return (
            <div className="container">
                <nav>
                    <ul>
                        <li><IndexLink to="/" activeClassName="active" onClick={this.removeDropdown}>Home</IndexLink></li>
                        <li><Link to="/about" activeClassName="active" onClick={this.removeDropdown}>About</Link></li>
                        <li><Link to="/train" activeClassName="active" onClick={this.removeDropdown}>Train</Link></li>
                        <li><Link to="/profile" activeClassName="active" onClick={this.removeDropdown}>Profile</Link></li>
                        <li style={{float: 'right', cursor: 'pointer'}}><img src="gears-original.png" style={{height: '40px'}} onClick={this.toggleDropdown} /></li>
                    </ul>
                </nav>
                {this.state.dropdown ? <Dropdown /> : <span />}
            </div>
        );
    }
});