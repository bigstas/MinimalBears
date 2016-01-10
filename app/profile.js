//'Profile' page
// Medal images by Farm-Fresh Web (licence: Creative Commons Attribution Licence)

var React = require('react');
var ParseCCMixin = require('react-cloud-code-mixin');


var Profile = React.createClass({
    
    // Enable cloud code subscriptions
    mixins: [ParseCCMixin],
    
    // Cloud code subscriptions
    loadData: function(props, state) {
        var subs = {
            bronzeMedalImage: {
                name: "fetchMedia",
                params: {mediaType: 'Image', Name: 'bronze medal'},
                propDeps: [],
                stateDeps: [],
                defaultValue: []
            },
            silverMedalImage: {
                name: "fetchMedia",
                params: {mediaType: 'Image', Name: 'silver medal'},
                propDeps: [],
                stateDeps: [],
                defaultValue: []
            },
            goldMedalImage: {
                name: "fetchMedia",
                params: {mediaType: 'Image', Name: 'gold medal'},
                propDeps: [],
                stateDeps: [],
                defaultValue: []
            }
        }
        return subs
    },
    
    render: function() {
        return (
            <div id='profile'>
                <div id='topband'>
                    <div id='userpic'>
                        <p style={{color: '#cccccc'}}>Your <br/> picture <br/> here</p>
                    </div>
                    <div id='overview'>
                        <h2 className="animated bounce">Your username here</h2>
                        <p style={{display: 'inline-block'}}>Member since 123 CE</p>
                        <img src={this.data.bronzeMedalImage} alt='bronze' style={{display: 'inline-block'}} />
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