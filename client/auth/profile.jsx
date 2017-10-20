//'Profile' page
// Medal images by Farm-Fresh Web (licence: Creative Commons Attribution Licence)

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
import { Bar, Pie } from 'react-chartjs-2' // Charts
// other charts available: Doughnut, Line, Radar, Bubble, Polar, Scatter, HorizontalBar
import { makeChartData, barOptions, mixOptions, pieOptions } from './chartdata'
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

const TopBand = React.createClass({
    /* The title strip at the top of the page, with no graphs in it.
     * This is a static element (no methods).
     */
    render() {
        return (
            <div id='topband'>
                <div className='userpic' id='userpicProfile'>
                    <p style={{color: '#cccccc'}}>Your <br/> picture <br/> here</p>
                </div>
                <div id='overview'>
                    <h2 className="animated bounce">{this.props.username}</h2>
                    <p style={{display: 'inline-block'}}>Member since 123 CE</p>
                </div>
            </div>
        )
    }
})

const UserProfile = React.createClass({
    getInitialState() {
        return {
            language: '0',
            contrast: '0',
            period: 'week'
        }
    },
    
    handlePeriodChange(event) {
        const period = event.target.value
        this.setState({ period: period })
    },
    
    setLanguage(event) {
        const language = event.target.value
        this.setState({ language: language })
    },
    
    setContrast(event) {
        const contrast = event.target.value
        this.setState({ contrast: contrast})
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
        
        let pieChart, mixChart, barChart, pieChartTitle, mixChartTitle, barChartTitle
        console.log(this.state.language)
        console.log(chartData.pieChartData.length)
        if (this.state.language < chartData.pieChartData.length) {
            const pieChartData = chartData.pieChartData[this.state.language]
            const mixChartData = chartData.mixChartData[this.state.language]
            const barChartData = chartData.barChartData[this.state.language]
            
            pieChart = <Pie data={pieChartData} options={pieOptions} />
            mixChart = <Bar data={mixChartData} options={mixOptions} />
            barChart = <Bar data={barChartData} options={barOptions} />
            
            const language = ["English", "Polish", "German"][this.state.language]
            // The idea is for this to say the contrast's actual name rather than a number (e.g. "for ee/i" rather than "for Contrast 1"), 
            // but for the purposes of demonstration prior to database hookup it just shows a number
            if ( this.state.contrast === '0') {
                mixChartTitle = <h3>Practice rate and success rate over time for all contrasts in {language}</h3> 
            } else {
                mixChartTitle = <h3>Practice rate and success rate over time for Contrast {this.state.contrast} in {language}</h3>
            }
            pieChartTitle = <h3>Number of practices by contrast for this period</h3>
            barChartTitle = <h3>Success rate by contrast</h3>
        }
        else {
            pieChart = <p>Sorry, we cannot display a chart for this.</p>
            mixChart = <p>You haven't practiced this language, so there is nothing to display.</p>
            barChart = <span />
            mixChartTitle = <span />
            pieChartTitle = <span />
            barChartTitle = <span />
        }
        
        return (
            <div className='panel animated fadeIn' id='profile'>
            {/* TOP REGION */}
                <TopBand username={this.props.username} />
                <div id='graphsDiv'>
                    <p style={{fontSize: "10px"}}>Note to other developers: at the moment, every time you change the input, new random data is generated. This is only for demonstration purposes - of course in the final version using data from the database, then the view will be consistent when you move away from it and come back.</p>
            {/* DROPDOWNS */}
                    <select onChange={this.setLanguage}>
                        <option value="0">English</option>
                        <option value="2">German</option>
                        <option value="1">Polish</option>
                    </select>
                    <select onChange={this.setContrast}>
                        <option value="0">All contrasts</option>
                        <option value="1">Contrast 1</option>
                        <option value="2">Contrast 2</option>
                    </select>
            {/* RADIO BUTTONS */}
                    <label>
                        <input type="radio" value="week" checked={this.state.period === 'week'} onChange={this.handlePeriodChange} />Week view
                    </label>
                    <label>
                        <input type="radio" value="6month" checked={this.state.period === '6month'} onChange={this.handlePeriodChange} />Six month view
                    </label>
            {/* CHARTS */}
                    {mixChartTitle}
                    {mixChart}
                    {pieChartTitle}
                    {pieChart}
                    {barChartTitle}
                    {barChart}
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