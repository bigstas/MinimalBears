/*
const {
  Link,
  Navigation,
  State,
  RouteHandler
} = ReactRouter;
*/

import React from 'react';
import { Link, Navigation, State, RouteHandler } from 'react-router'; // could probably remove Link; not sure about Navigation and State
import { createContainer } from 'meteor/react-meteor-data';


AppBody = React.createClass({
    render() {
        return (
            <div id="container" >
                <div id="content-container">
                    <Nav />
                    {this.props.children}
            {/* <RouteHandler /> */}
                </div>
            </div>
        );
    }
});

export default createContainer(({params}) => {
    const stas = "dude";
    return {
        stas
    };
}, AppBody);