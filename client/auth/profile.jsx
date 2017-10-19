//'Profile' page
// Medal images by Farm-Fresh Web (licence: Creative Commons Attribution Licence)

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
import { Line, Bar, Radar, Pie } from 'react-chartjs-2' // Charts
// other charts available: Doughnut, ...
import { makeChartData, mixOptions } from './chartdata'
import { FacebookButton, FacebookCount, TwitterButton, TwitterCount } from "react-social"
    
// Stand-in data, to be done in/from the database in whatever way is best and most efficient
/* GRAPH TYPES
All graphs should be available for one or all languages (or contrasts), and for different time periods (month, year, life).
By language:
- Pie chart showing relative popularity of contrasts (how much you have trained each one in the stated period)
By language, by contrast:
- How much you have studied when in attempts/day (or /month)
- Success rate over time
- Problem words...(?)
- Problem speakers...(?) (& then they can listen to a sample of their recordings?)
- Words (& speakers) which you don't have a problem with?
User inputs:
- Recorded audio (maybe one day this will yield some sort of points system?)
- Moderated audio (for moderators) ...?
*/
/*const data = {
    english: {
        contrastsPopularity: [("ee-i", 0.3), ("s-th", 0.4), ("l-r", 0.3)],
        contrastSuccess: [],
        trainingTimes: {
            
        }
    },
    german: {
        contrasts: {
            
        }
    },
    polish: {
        
    },
    all: {
        
    }
}*/


// when there is a logged in user
const UserProfile = React.createClass({
    getInitialState() {
        return {
            language: '0',
            period: 'week'
        }
    },
    
    handleOptionChange(event) {
        const period = event.target.value
        this.setState({ period: period })
    },
    
    getDropdownValue(event) {
        const language = event.target.value
        this.setState({ language: language })
    },
    
    render() {
        // for social media buttons
        const url = "http://www.minimalbears.com/"
        
        // this object is required, but it can be empty...
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: true
        }
        
        const chartData = makeChartData(this.state.period)
        
        let pieChart, mixChart
        //const newData = JSON.parse(JSON.stringify(chartdata))
        console.log(this.state.language)
        console.log(chartData.pieChartData.length)
        if (this.state.language < chartData.pieChartData.length) {
            const pieChartData = chartData.pieChartData[this.state.language]       //newData.pieChartData[this.state.language]
            const mixChartData = chartData.mixChartData[this.state.language]       //newData.mixChartData[this.state.language]
            
            pieChart = <Pie data={pieChartData} />
            mixChart = <Bar data={mixChartData} options={mixOptions} />
        }
        else {
            pieChart = <p>Sorry, we cannot display a chart for this.</p>
            mixChart = <p>You haven't practiced this language, so there is nothing to display.</p>
        }
        
        
        return (
            <div className='panel animated fadeIn' id='profile'>
            {/* TOP REGION */}
                <div id='topband'>
                    <div className='userpic' id='userpicProfile'>
                        <p style={{color: '#cccccc'}}>Your <br/> picture <br/> here</p>
                    </div>
                    <div id='overview'>
                        <h2 className="animated bounce">{this.props.username}</h2>
                        <p style={{display: 'inline-block'}}>Member since 123 CE</p>
                    </div>
                </div>
                <div id='graphsDiv'>
            {/* DROPDOWN */}
                    <select onChange={this.getDropdownValue}>
                        <option value="0">English</option>
                        <option value="2">German</option>
                        <option value="1">Polish</option>
                    </select>
            {/* RADIO BUTTONS */}
                    <label>
                        <input type="radio" value="week" checked={this.state.period === 'week'} onChange={this.handleOptionChange} />Week view
                    </label>
                    <label>
                        <input type="radio" value="6month" checked={this.state.period === '6month'} onChange={this.handleOptionChange} />Six month view
                    </label>
            {/* CHARTS */}
                    {pieChart}
                    {mixChart}
                    {/*<h4>Your XP points over time</h4>
                    <Line data={lineChartData} options={chartOptions} />
                    <h4>Average success over time</h4>
                    <Bar data={barChartData} options={chartOptions} />
                    <h4>Relative ease of contrasts</h4>
                    <Radar data={radarChartData} options={chartOptions} />*/}
                </div>
                <TwitterButton className="button" id="twitterButton" element="div" url={url}>
                        {" Share us on Twitter"}
                </TwitterButton>
            </div>
        )
    }
})

//export default createContainer(({params}) => {return {}}, Profile)    // do we still need createContainer?
export default UserProfile