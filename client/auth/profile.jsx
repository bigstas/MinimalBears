//'Profile' page
// Medal images by Farm-Fresh Web (licence: Creative Commons Attribution Licence)

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
import { Line, Bar, Radar } from 'react-chartjs' // Charts
import { FacebookButton, FacebookCount, TwitterButton, TwitterCount } from "react-social"
    

const AlphaProfile = React.createClass({
    render() {
        return(
            <div className='panel animated fadeIn' id='alphaProfile'>
                <h2>Oops!</h2>
                <p>Personal profiles are not available in Minimal Bears Alpha release.</p>
                <p>See you in Beta!</p>
            </div>
        )
    }
})
    
// when there is no logged in user
const EmptyProfile = React.createClass({
    render() {
        return (
            <div className='panel animated fadeIn' id='emptyProfile'>
                <h2><Link to="/login">Log in</Link> or <Link to="/register">sign up</Link> to see your personal profile!</h2>
                <ul>
                    <li className='bulletpoints'>View your progress</li>
                    <li className='bulletpoints'>Share your successes with friends</li>
                    <li className='bulletpoints'>Contribute to Minimal Bears by recording words in your native language</li>
                </ul>
            </div>
        )
    }
})

// when there is a logged in user
const UserProfile = React.createClass({
    render() {
        const lineChartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [65, 59, 80, 81, 56, 55, 40],
                    spanGaps: false,
                }
            ]
        }
        const barChartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    data: [65, 59, 80, 81, 56, 55, 40],
                }
            ]
        }
        const radarChartData = {
            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: "rgba(179,181,198,0.2)",
                    borderColor: "rgba(179,181,198,1)",
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    pointBackgroundColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(255,99,132,1)",
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        }
        // this object is required, but it can be empty...
        const chartOptions = {}
        // for social media buttons
        const url = "http://www.minimalbears.com/"
        
        return (
            <div className='panel animated fadeIn' id='profile'>
                <div id='topband'>
                    <div className='userpic' id='userpicProfile'>
                        <p style={{color: '#cccccc'}}>Your <br/> picture <br/> here</p>
                    </div>
                    <div id='overview'>
                        <h2 className="animated bounce">{this.props.user}</h2>
                        <p style={{display: 'inline-block'}}>Member since 123 CE</p>
                    </div>
                </div>
                <div id='graphsDiv'>
                    <h4>Your XP points over time</h4>
                    <Line data={lineChartData} options={chartOptions} /*width="400px" height="250"*/ />
                    <h4>Average success over time</h4>
                    <Bar data={barChartData} options={chartOptions} />
                    <h4>Relative ease of contrasts</h4>
                    <Radar data={radarChartData} options={chartOptions} />
                    <TwitterButton className="button" id="twitterButton" element="div" url={url}>
                        {" Share us on Twitter"}
                    </TwitterButton>
                </div>
            </div>
        )
    }
})

const Profile = React.createClass({
    render() {
        return(
            <div>
                {!!this.props.user ?
                    <UserProfile user={this.props.user} /> :
                    <EmptyProfile />
                }
            </div>
        )
    }
})

//export default createContainer(({params}) => {return {}}, Profile)    // do we still need createContainer?
export default Profile