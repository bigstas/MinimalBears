//'Profile' page
// Medal images by Farm-Fresh Web (licence: Creative Commons Attribution Licence)

import React from 'react';

Profile = React.createClass({
    
    render() {
        return (
            <div id='profile'>
                <div id='topband'>
                    <div id='userpic'>
                        <p style={{color: '#cccccc'}}>Your <br/> picture <br/> here</p>
                    </div>
                    <div id='overview'>
                        <h2 className="animated bounce">Your username here</h2>
                        <p style={{display: 'inline-block'}}>Member since 123 CE</p>
                    {/* <img src={this.data.bronzeMedalImage} alt='bronze' style={{display: 'inline-block'}} /> */}
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