import React from 'react'
import LoadingPage from '../auxiliary/loading'
import { Bar, Pie } from 'react-chartjs-2' // Charts
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

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

function makeRandomData(points, min, max) {
    const range = max - min
    let randomData = []
    for (let i = 0; i < points; i++ ) {
        const randomDatum = Math.round( min + range*Math.random() )
        randomData.push(randomDatum)
    }
    return randomData
}

function decomposeTimestamp(stamp) {
    return {
        year:   parseInt(stamp.substring(0,4)),
        month:  parseInt(stamp.substring(5,7)),
        day:    parseInt(stamp.substring(8,10)),
        hour:   parseInt(stamp.substring(11,13)),
        minute: parseInt(stamp.substring(14,16)),
        second: parseInt(stamp.substring(17,19))
    }
}

function nDaysAgo(dts, n) {
    // dts: decomposed timestamp
    // TODO: consider people in other time zones...
    let d = new Date()
    d.setDate(d.getDate()-n)
    return d
}
function sameDay(dts, daysAgo) {
    const d = nDaysAgo(dts, daysAgo)
    // note: fullYear and Date as expected, Month is 0-indexed (0-11) so we need to add 1
    if (dts.year === d.getFullYear() && dts.month === d.getMonth()+1 && dts.day === d.getDate()) {
        return true
    } else {
        return false
    }
}
function sameMonth(dts, daysAgo) {
    const d = nDaysAgo(dts, daysAgo)
    if (dts.year === d.getFullYear() && dts.month === d.getMonth()+1) {
        return true
    } else {
        return false
    }
}

// JS doesn't handle modulo of negative integers well, so here's a function to get around that
function mod(n, m) {
    return ((n % m) + m) % m
}

function makeMixData(data, period) {
    // period: "week", "month", "year", "all time"
    let yValues
    if (period === "week" || period === "month") {
        let days = []
        const numDays = (period === "week" ? 7 : 30)
        // at first, make an array for all the days with [0,0] in each day
        // days = Array(period).fill([0,0]) -- this is weirdly buggy, don't use it! It generates multiple references to a single array (why??)
        for (let i=0; i<numDays; i++) {
            days.push([0,0]) 
        }
        // loop over all the data and fit it to the days
        data.nodes.map(function(c, index) {
            // TODO: How to make this efficient? A lot of looping and checking happening here!
            const stamp = decomposeTimestamp(c.stamp)
            for (let daysAgo=0; daysAgo<numDays; daysAgo++) {
                console.log(sameDay(stamp,daysAgo))
                if (sameDay(stamp, daysAgo)) {
                    days[daysAgo][0] += parseInt(c.count)
                    days[daysAgo][1] += parseInt(c.sum)
                    console.log(days)
                    console.log(days[daysAgo][0])
                    break
                }
            }
        })
        yValues = days
    }
    else if (period === "year") {
        let months = []
        for (let i=0; i<12; i++) {
            months.push([0,0]) 
        }
        data.nodes.map(function(c, index) {
            // TODO: How to make this efficient? A lot of looping and checking happening here!
            const stamp = decomposeTimestamp(c.stamp)
            for (let monthsAgo=0; monthsAgo<12; mothsAgo++) {
                if (sameMonth(stamp, monthsAgo)) {
                    months[monthsAgo][0] += parseInt(c.count)
                    months[monthsAgo][1] += parseInt(c.sum)
                    //console.log(days)
                    //console.log(days[daysAgo][0])
                    break
                }
            }
        })
        yValues = months
    }
    else if (period === "all time") {
        // TODO: loop over everything...
    }
    // JS doesn't have any built-in unzip array method, hence below code
    let mixLabels = []
    let mixLineValues = []
    let mixBarValues = []
    const dayMapper = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }
    const monthMapper = {
        0: 'Jan',
        1: 'Feb',
        2: 'Mar',
        3: 'Apr',
        4: 'May',
        5: 'Jun',
        6: 'Jul',
        7: 'Aug',
        8: 'Sep',
        9: 'Oct',
        10: 'Nov',
        11: 'Dec'
    }
    if (period === "week" || period === "month") {
        // data needs to be in order of x ascending
        const days = yValues
        for (let daysAgo=days.length-1; daysAgo>=0; daysAgo--) {
            let label
            let now = new Date()
            if (period === "week") {
                label = dayMapper[mod(now.getDay()-daysAgo, 7)]
            } else if (period === "month") {
                // getDate() is confusing; it can be used to manipulate the whole date value with + or - (line below),
                // or it can be used to reference just the day of the month (two lines below).
                now.setDate(now.getDate()-daysAgo)
                label = (now.getDate().toString() + " " + monthMapper[now.getMonth()])
            }
            mixLabels.push(label)
            // careful of division by zero!
            if (days[daysAgo][0] === 0) {
                // default to 0% if there is no data for that day
                mixLineValues.push(0)
            } else {
                // calculate percentage
                mixLineValues.push(Math.round(100*days[daysAgo][1]/days[daysAgo][0]))
            }
            mixBarValues.push(days[daysAgo][0])
        }
    } else if (period === "year") {
        const months = yValues
        for (let monthsAgo=months.length-1; monthsAgo>=0; monthsAgo--) {
            let now = new Date()
            const label = monthMapper[mod(now.getMonth()-monthsAgo, 12)]
            mixLabels.push(label)
            if (months[monthsAgo][0] === 0) {
                mixLineValues.push(0)
            } else {
                mixLineValues.push(Math.round(100*months[monthsAgo][1]/months[monthsAgo][0]))
            }
            mixBarValues.push(months[monthsAgo][0])
        }
    } else if (period === "all time") {
        // ... do something!
    }
    console.log(yValues)
    console.log(mixLabels)
    console.log(mixLineValues)
    console.log(mixBarValues)
    return {mixLabels: mixLabels, mixLineValues: mixLineValues, mixBarValues: mixBarValues}
}

function makePieData(data) {
    let pieData = {}
    // group all counts for each label
    data.nodes.map(function(c) {
        if (pieData.hasOwnProperty(c.contrast)) {
            pieData[c.contrast] += parseInt(c.count)
        } else {
            pieData[c.contrast]  = parseInt(c.count)
        }
    })
    console.log(pieData)
    // split object into two arrays, one of keys and one of values
    const pieLabels = Object.keys(pieData)
    const pieValues = []
    for (let i=0; i<pieLabels.length; i++) {
        pieValues.push(pieData[pieLabels[i]])
    }
    // debug logs
    console.log(pieLabels)
    console.log(pieValues)
    return {pieLabels: pieLabels, pieValues: pieValues}
}

// TODO - some of the code in these functions is repeated, code could be made nicer by minimising repetitions
function makeBarData(data) {
    let barData = {}
    /* Object of the form:
     * { ee/i: [3, 2],
         s/th: [10, 7], ... },
     * where the array goes [count, sum].
     */
    data.nodes.map(function(c) {
        if (barData.hasOwnProperty(c.contrast)) {
            barData[c.contrast][0] += parseInt(c.count)
            barData[c.contrast][1] += parseInt(c.sum)
        } else {
            barData[c.contrast] = [parseInt(c.count), parseInt(c.sum)]
        }
    })
    console.log(barData)
    // split object into two arrays, one of keys and one of values
    let barLabels = Object.keys(barData)
    let barValues = []
    let fullCount = 0
    let total = 0
    for (let i=0; i<barLabels.length; i++) {
        // get array
        const arr = barData[barLabels[i]]
        // calculate percent correct, and push to values
        barValues.push(Math.round(100*arr[1]/arr[0]))
        // add to total count and total sum, to calculate overall performance percentage after loop finishes
        fullCount += arr[0]
        total += arr[1]
    }
    // 'overall' bar
    barLabels.push('overall')
    barValues.push(Math.round(100*total/fullCount))
    // debug logs
    console.log(barLabels)
    console.log(barValues)
    return {barLabels: barLabels, barValues: barValues}
}

function makeChartData(period, data) {
    // period is "week", "month", "year", or "all time"
    // data is the raw data object passed from the database
    console.log(data) 
    const pieData = makePieData(data)
    const barData = makeBarData(data)
    const mixData = makeMixData(data, period)
    
    // currently the other language is hard-coded - TODO: this should respond to what the user has been practising
    const chartdata = {
        pieChartData: [{
            labels: pieData.pieLabels,
            datasets: [{
                data: pieData.pieValues,
                backgroundColor: [
                    '#ff0000',
                    '#00ff00',
                    'yellow'
                ],
                hoverBackgroundColor: [
                    '#dd0000',
                    '#00dd00',
                    '#FFCE56'
                ]
            }]
        },
        {
            labels: ['ś/sz', 'ć/cz', 'ą/ę'],
            datasets: [{
                data: [100, 70, 210],
                backgroundColor: [
                    '#2222ff',
                    '#dd8811',
                    '#772222'
                ],
                hoverBackgroundColor: [
                    '#4444ff',
                    '#ff9922',
                    '#884444'
                ]
            }]
        }],
        mixChartData: [{
            labels: mixData.mixLabels,
            datasets: [{
                type:'line',
                label: 'Performance',
                data: mixData.mixLineValues,
                fill: false,
                borderColor: '#EC932F',
                backgroundColor: '#EC932F', // only affects the legend's background (for lines)
                pointBorderColor: '#EC932F',
                pointBackgroundColor: '#EC932F',
                pointHoverBackgroundColor: '#EC932F',
                pointHoverBorderColor: '#EC932F',
                yAxisID: 'y-axis-2'
            },
            {
                type: 'bar',
                label: 'Practice',
                data: mixData.mixBarValues,
                fill: false,
                backgroundColor: '#71B37C',
                borderColor: '#71B37C',
                hoverBackgroundColor: '#71B37C',
                hoverBorderColor: '#71B37C',
                yAxisID: 'y-axis-1'
            }]
        }, 
        // Colours in the below are currently wild for the second element of the array just for demonstration purposes, not an actually suggested colour scheme. 
        // The idea is that you can see what options affect what.
        {
            labels: (period === "week" ? ['today', 'yesterday', '2 days ago', '3 days ago', '4 days ago', '5 days ago', '6 days ago', '7 days ago'] : ['January', 'February', 'March', 'April', 'May', 'June']),
            datasets: [{
                type:'line',
                label: 'Performance',
                data: ( period === "week" ? makeRandomData(7, 50, 100) : makeRandomData(6, 50, 100) ),
                fill: false,
                borderColor: 'red',
                backgroundColor: 'red', // only affects the legend's background (for lines)
                pointBorderColor: 'black',
                pointBackgroundColor: 'grey',
                pointHoverBackgroundColor: '#EC932F',
                pointHoverBorderColor: 'black',
                yAxisID: 'y-axis-2'
            },
            {
                type: 'bar',
                label: 'Practice',
                data: ( period === "week" ? makeRandomData(7, 0, 200) : makeRandomData(6, 0, 200) ),
                fill: false,
                backgroundColor: 'blue',
                borderColor: '#71B37C',
                hoverBackgroundColor: '#71B37C',
                hoverBorderColor: '#71B37C',
                yAxisID: 'y-axis-1'
            }]
        }],
        barChartData: [{
            labels: barData.barLabels,
            datasets: [{
                label: 'Percent correct',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: barData.barValues
            }]
        },
        {
            labels: ['ś/sz', 'ć/cz', 'ą/ę', 'overall'],
            datasets: [{
                label: 'Percent correct',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [52, 58, 76, 63]            
            }]
        }]
    }
    return chartdata
}

const barOptions = {
    maintainAspectRatio: true,
    legend: { display: false },
    scales: {
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Percent correct'
            },
            ticks: {
                suggestedMin: 50,    // minimum will be 50, unless there is a lower value
                suggestedMax: 100
            }
        }]
    }
}

const pieOptions = {
     tooltips: {
         callbacks: {
            label: function(tooltipItem, data) {
                const allData = data.datasets[tooltipItem.datasetIndex].data
                const tooltipLabel = data.labels[tooltipItem.index]
                const tooltipData = allData[tooltipItem.index]
                let total = 0
                for (var i in allData) {
                    total += allData[i]
                }
                const tooltipPercentage = Math.round((tooltipData / total) * 100)
                return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)'
            }
        }
    }
}
    
const mixOptions = {
    responsive: true,
    tooltips: {
        mode: 'label'
    },
    elements: {
        line: {
            fill: false
        }
    },
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Time ago'
            },
            gridLines: { display: false },
            labels: { show: true }
        }],
        yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
            scaleLabel: {
                display: true,
                labelString: 'Practice (reps)'
            },
            ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value
                suggestedMax: 10    // maximum will be 10 for now (TODO: handle this programmatically... or at least test it!)
            },
            gridLines: { display: false },
            labels: { show: true }
        },
        {
            type: 'linear',
            display: true,
            position: 'right',
            id: 'y-axis-2',
            scaleLabel: {
                display: true,
                labelString: 'Success rate (%)'
            },
            ticks: {
                suggestedMin: 50,    // minimum will be 50, unless there is a lower value
                suggestedMax: 100
            },
            gridLines: {
                display: false
            },
            labels: {
                show: true
            }
        }]
    }
}

const Charts = React.createClass({
    render() {
        if (this.props.allStats.loading) {
            return( <LoadingPage /> )
        }
        
        const allStats = this.props.allStats.getAllStats
        console.log(allStats)
        const chartData = makeChartData(this.props.period, allStats)
        
        let pieChart, mixChart, barChart, pieChartTitle, mixChartTitle, barChartTitle
        
        const pieChartData = chartData.pieChartData[this.props.language]
        const mixChartData = chartData.mixChartData[this.props.language]
        const barChartData = chartData.barChartData[this.props.language]

        pieChart = <Pie data={pieChartData} options={pieOptions} />
        mixChart = <Bar data={mixChartData} options={mixOptions} />
        barChart = <Bar data={barChartData} options={barOptions} />

        const language = ["English", "Polish", "German"][this.props.language]
        // The idea is for this to say the contrast's actual name rather than a number (e.g. "for ee/i" rather than "for Contrast 1"), 
        // but for the purposes of demonstration prior to database hookup it just shows a number
        if ( this.props.contrast === '0') {
            mixChartTitle = <h3>Practice rate and success rate over time for all contrasts in {language}</h3> 
        } else {
            mixChartTitle = <h3>Practice rate and success rate over time for Contrast {this.props.contrast} in {language}</h3>
        }

        return (
            <div>
                {mixChartTitle}
                {mixChart}
                <h3>Number of practices by contrast for this period</h3>
                {pieChart}
                <h3>Success rate by contrast</h3>
                {barChart}
            </div>
        )
    }
})

const allStatsQuery = gql`query ($languageId: String, $unit: String, $number: Int) {
  getAllStats(languageId: $languageId, unit: $unit, number: $number) {
    nodes {
      stamp
      contrast
      count
      sum
    }
  }
}`

// TODO - this will actually use props (ownProps) soon
const allStatsQueryConfig = { 
    name: 'allStats',
    options: (ownProps) => ({
        variables: {
            languageId: ownProps.language,
            unit: 'day',
            number: 100
        }
    })
}

export default graphql(allStatsQuery, allStatsQueryConfig)(Charts)
//export { makeChartData, barOptions, mixOptions, pieOptions }