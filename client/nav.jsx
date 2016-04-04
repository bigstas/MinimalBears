// Navigation bar

import React from 'react';
import { Link, IndexLink } from 'react-router';

Nav = React.createClass({
    render() {
        return (
            <div className="container">
                <nav>
                    <ul>
                        <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
                        <li><Link to="/about" activeClassName="active">About</Link></li>
                        <li><Link to="/train" activeClassName="active">Train</Link></li>
                        <li><Link to="/profile" activeClassName="active">Profile</Link></li>
                    </ul>
                </nav>
            </div>
        );
    }
});