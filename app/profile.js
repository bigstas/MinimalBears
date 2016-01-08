//'Profile' page

var React = require('react');

var Profile = React.createClass({
    render: function() {
        return (
            <div id='profile'>
                <div id='topband'>
                    <div id='userpic'>
                        <p style={{color: '#cccccc'}}>Your <br/> picture <br/> here</p>
                    </div>
                    <div id='overview'>
                        <h2>Your username here</h2>
                        <p>Member since 123 CE</p>
                    </div>
                </div>
                <div id='graphsDiv'>
                    <h4>Your XP points over time</h4>
                    <div className='graph'>Graph</div>
                    <h4>Average success over time</h4>
                    <div className='graph'>Graph</div>
                    <h4>Relative ease of contrasts</h4>
                    <div className='graph'>Graph</div>
                </div>
            </div>
        )
    }
})

module.exports = Profile;