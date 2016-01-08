// Navigation bar

var React = require('react');

var Nav = React.createClass({    
    render: function () {
        var setupArray = [{id: 0, text: 'Logo', float: false, isActive: false},
                          {id: 1, text: 'Train', float: false, isActive: false},
                          {id: 2, text: 'Record', float: false, isActive: false},
                          {id: 3, text: 'About', float: false, isActive: false},
                          {id: 4, text: 'Help', float: false, isActive: false},
                          {id: 5, text: 'Profile', float: true, isActive: false},
                          {id: 6, text: 'Settings', float: true, isActive: false}];
        setupArray[this.props.active].isActive = true;
        
        return (
            <div className="container">
                <nav>
                    <ul>
                        {setupArray.map( function(c) {
                            var style = {};
                            if (c.float) {style.float = 'right';}
                            return <li style={style}>
                                <a href='#' 
                                key={c.id}
                                className={c.isActive ? 'active' : 'inactive'}
                                onClick={this.props.callbackParent.bind(null, c.id)}
                                >{c.text}</a></li>
                                {/* callbackParent is a method of the Arena, and is already byound by React;
                                We need to pass c.id as an argument but onClick does not take arguments;
                                We're using bind to pass an argument, not to bind the context (because it's already bound):
                                null could be anything here;
                                c.id is passed as the first argument to callbackParent;
                                the new function returned by bind does not need any further arguments */}
                        }, this)}
                    </ul>
                </nav>
            </div>
        );
    }
});

module.exports = Nav;