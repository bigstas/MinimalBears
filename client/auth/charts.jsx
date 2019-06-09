import React from 'react'
import LoadingPage from '../auxiliary/loading'
import counterpart from 'counterpart'
import Translate from 'react-translate-component'
// other charts available: Doughnut, Line, Radar, Bubble, Polar, Scatter, HorizontalBar
import { Bar, Pie } from 'react-chartjs-2' // Charts
import { graphql } from 'react-apollo'

import { statsQuery } from '/lib/graphql'

// JS doesn't handle modulo of negative integers well, so here's a function to get around that
function mod(n, m) {
    return ((n % m) + m) % m
}
function decomposeTimestamp(stamp) {
    return {
        year:   parseInt(stamp.substring(0,4)),
        month:  parseInt(stamp.substring(5,7)),
        day:    parseInt(stamp.substring(8,10)),
        /* These last three properties are probably unnecessary. Consider deleting. */
        hour:   parseInt(stamp.substring(11,13)),
        minute: parseInt(stamp.substring(14,16)),
        second: parseInt(stamp.substring(17,19))
    }
}
function nDaysAgoAsDateObject(n) {
    // TODO: consider people in other time zones...
    let d = new Date()
    d.setDate(d.getDate()-n)
    return d
}
function sameDay(dts, daysAgo) {
    // dts: decomposed timestamp
    const d = nDaysAgoAsDateObject(daysAgo)
    // note: fullYear and Date as expected, Month is 0-indexed (0-11) so we need to add 1
    if (dts.year === d.getFullYear() && dts.month === d.getMonth()+1 && dts.day === d.getDate()) {
        return true
    } else {
        return false
    }
}
function nMonthsAgoAsDts(n) {
    // This can't return a date object, as there appears to be no nice native way of doing what we need here in JS.
    const now = new Date()
    let year = now.getFullYear()
    // below: If the number of months to subtract would take us into last year, subtract 1 from the year.
    // Since at the moment are data displays only as far as one year back as a maximum, 
    // we don't need to currently consider the cases where you would go back more than 12 months.
    if (n >= now.getMonth()+1) {
        year -= 1
    }
    return {
        year:  year,
        month: mod(now.getMonth()-n, 12) +1,
        day:   1
        /* What day it is is irrelevant for the way this function is used, but need to avoid issues with 31/30/29/28 days in a month */
        /* Hours, minutes, and seconds are not necessary, though can be made available */
    }
}
function sameMonth(dts, monthsAgo) {
    const d = nMonthsAgoAsDts(monthsAgo)
    if (dts.year === d.year && dts.month === d.month) {
        return true
    } else {
        return false
    }
}

function extractContrasts(contrastData) {
    let contrasts = new Set([])
    for (let i=0; i<contrastData.length; i++) {
        contrasts.add(contrastData[i]["contrast"])
    }
    return Array.from(contrasts)
}

function mapNodesToChartData(data, period, contrast) {
    const periodProperties = {
        numberOfBins: {
            week:  7,
            month: 30,
            year:  12
        },
        sameFunction: {
            week:  sameDay,
            month: sameDay,
            year:  sameMonth
        }
    }
    const numberOfBins = periodProperties.numberOfBins[period]
    console.log(numberOfBins)
    const sameFunction = periodProperties.sameFunction[period]
    let bins = []
    // bins collects the data that will be used for the mix chart
    let barData = {}
    /* barData will be an object of the form:
     * { ee/i: [3, 2],
         s/th: [10, 7], ... },
     * where the array goes [count, sum].
     * Accounts for bar chart AND pie chart data.
     */
    // at first, make an array for all the bins (days or months) with [0,0] in each day
    for (let i=0; i<numberOfBins; i++) {
        bins.push([0,0]) 
    }
    console.log(bins)
    // loop over all the data and fit it to the bins
    data.nodes.map(function(c) {
        // add to bar chart data (also used for pie chart)
        if (barData.hasOwnProperty(c.contrast)) {
            barData[c.contrast][0] += parseInt(c.count)
            barData[c.contrast][1] += parseInt(c.sum)
        } else {
            barData[c.contrast] = [parseInt(c.count), parseInt(c.sum)]
        }
        // add to mix chart data
        const stamp = decomposeTimestamp(c.stamp)
        for (let binsAgo=0; binsAgo<numberOfBins; binsAgo++) {
            console.log(sameFunction(stamp,binsAgo))
            if (sameFunction(stamp, binsAgo) && (contrast==="all" || contrast===c.contrast)) {
                bins[binsAgo][0] += parseInt(c.count)
                bins[binsAgo][1] += parseInt(c.sum)
                break
            }
        }
    })
    return {
        yValues: bins,
        barData: barData
    }
}

function mapChartDataToLabelledMixChartData(period, bins) {
    let now = new Date()
    const labelFunctions = {
        week:  (daysAgo) => counterpart.translate([ "home", "profile", "charts", "weekdays", mod(now.getDay()-daysAgo, 7).toString() ]), //dayMapper[mod(now.getDay()-daysAgo, 7)],
        month: (daysAgo) => {
            let date = new Date()
            date.setDate(date.getDate()-daysAgo)
            return ( date.getDate().toString() + " " + counterpart.translate([ "home", "profile", "charts", "months", date.getMonth().toString() ]) )
        },
        year: (monthsAgo) =>  counterpart.translate([ "home", "profile", "charts", "months", mod(now.getMonth()-monthsAgo, 12).toString() ]) // monthMapper[mod(now.getMonth()-monthsAgo, 12)]
    }
    const labelFunction = labelFunctions[period]
    
    let mixLabels =     []
    let mixBarValues =  []
    let mixLineValues = []
    for (let binsAgo=bins.length-1; binsAgo>=0; binsAgo--) {
        const label = labelFunction(binsAgo)
        mixLabels.push(label)
        if (bins[binsAgo][0] === 0) {
            mixLineValues.push(0)
        } else {
            mixLineValues.push(Math.round(100*bins[binsAgo][1]/bins[binsAgo][0]))
        }
        mixBarValues.push(bins[binsAgo][0])
    }
    console.log(bins)
    console.log(mixLabels)
    console.log(mixLineValues)
    console.log(mixBarValues)
    
    return {
        mixLabels: mixLabels,  
        mixBarValues: mixBarValues,
        mixLineValues: mixLineValues
    }
}

function extractChartRawData(period, data, contrast) {
    let unlabelledData = mapNodesToChartData(data, period, contrast)
    let yValues = unlabelledData.yValues
    let barData = unlabelledData.barData
    
    // split object into two arrays, one of keys and one of values
    let barLabels = Object.keys(barData)
    let pieLabels = Object.keys(barData)
    if (barLabels.length === 0) {
        // If the charts are empty, tell the page to render a message that there is no data
        return false 
    }
    let barValues = []
    let pieValues = []
    let fullCount = 0
    let total = 0
    // loop to populate pieValues and barValues
    for (let i=0; i<barLabels.length; i++) {
        pieValues.push(barData[barLabels[i]][0])
        // get array
        const arr = barData[barLabels[i]]
        // calculate percent correct, and push to values
        barValues.push(Math.round(100*arr[1]/arr[0]))
        // add to total count and total sum, to calculate overall performance percentage after loop finishes
        fullCount += arr[0]
        total += arr[1]
    }
    barLabels.push( counterpart.translate([ "home", "profile", "charts", "overall"]) )
    barValues.push(Math.round(100*total/fullCount))
    // debug logs
    console.log(barLabels)
    console.log(barValues)
    console.log(pieValues)
    
    // pie and bar data ready, now prepare mix data
    const mix = mapChartDataToLabelledMixChartData(period, yValues)
    
    return {
        mix: mix,
        pie: {pieLabels: pieLabels, pieValues: pieValues},
        bar: {barLabels: barLabels, barValues: barValues}
    }    
}


function makeChartData(period, data, contrast) {
    // period is "week", "month", or "year"
    // data is the raw data object passed from the database
    console.log(data) 
    const allData = extractChartRawData(period, data, contrast)
    if (allData === false) {
        // if there is no data, then there is nothing to display; send this message up the hierarchy
        return false
    }
    const pieData = allData.pie
    const barData = allData.bar
    const mixData = allData.mix
    
    // Currently presented as a list of two objects, differing only in style (not data).
    // It is possible to have different styles for different languages or contrasts, if preferred.
    // I leave this option open to you, Gergő, our master designer. You might opt for only one consistent styling.
    // TODO: Gergő - make this pretty! :)
    const chartdata = {
        pieChartData: [{
            labels: pieData.pieLabels,
            datasets: [{
                data: pieData.pieValues,
                /* TODO: colours arrays need to be long enough to handle any possible number of contrasts. */
                /* How would this work? How would this be handled programmatically? */
                /* What is the default behaviour? Testing and further development required. */
                backgroundColor: [
                    '#E56207',
                    '#25CF4C',
                    'yellow'
                ],
                hoverBackgroundColor: [
                    '#F56808',
                    '#28D947',
                    '#FFCE56'
                ]
            }]
        },
        {
            labels: pieData.pieLabels,
            datasets: [{
                data: pieData.pieValues,
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
                label: counterpart.translate(["home", "profile", "charts", "performanceLegendLabel"]),
                data: mixData.mixLineValues,
                fill: false,
                borderColor: '#F56808',
                backgroundColor: '#F56808', // only affects the legend's background (for lines)
                pointBorderColor: '#F56808',
                pointBackgroundColor: '#F56808',
                pointHoverBackgroundColor: '#FBA704',
                pointHoverBorderColor: '#FBA704',
                yAxisID: 'y-axis-2'
            },
            {
                type: 'bar',
                /* TODO: counterpart not updating on change of language */
                label: counterpart.translate(["home", "profile", "charts", "practiceLegendLabel"]),
                data: mixData.mixBarValues,
                fill: false,
                backgroundColor: '#25CF4C',
                borderColor: '#29E353',
                hoverBackgroundColor: '#28D947',
                hoverBorderColor: '#25CF4C',
                yAxisID: 'y-axis-1'
            }]
        }, 
        // Colours in the below are currently wild for the second element of the array just for demonstration purposes, not an actually suggested colour scheme. 
        // The idea is that you can see what options affect what.
        {
            labels: mixData.mixLabels,
            datasets: [{
                type:'line',
                label: 'Performance',
                data: mixData.mixLineValues,
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
                data: mixData.mixBarValues,
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
                label: counterpart.translate(["home", "profile", "charts", "performanceLegendLabel"]),
                backgroundColor: 'rgba(245,165,8,0.2)',
                borderColor: 'rgba(245,104,8,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(245,165,8,0.4)',
                hoverBorderColor: 'rgba(245,104,8,1)',
                data: barData.barValues
            }]
        },
        {
            labels: barData.barLabels,
            datasets: [{
                label: counterpart.translate(["home", "profile", "charts", "performanceLegendLabel"]),
                backgroundColor: 'rgba(245,165,8,0.2)',
                borderColor: 'rgba(245,104,8)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(245,165,8,0.4)',
                hoverBorderColor: 'rgba(245,104,8)',
                data: barData.barValues            
            }]
        }]
    }
    return chartdata
}

function generateBarOptions() {
    return {
        maintainAspectRatio: true,
        legend: { display: false },
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: counterpart.translate(["home", "profile", "charts", "performanceLegendLabel"]),
                },
                ticks: {
                    suggestedMin: 40,    // minimum will be 40, unless there is a lower value
                    suggestedMax: 100
                }
            }]
        }
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

// This is a function that returns an object rather than just an object's definition, as if it is the latter
// then it evaluates too early, before counterpart has a chance to set the interface language, and it tries
// to find the translation for language 'en' (and fails - we are using three-letter language codes).
function generateMixOptions() {
    return {
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
                gridLines: { display: true,
                            zeroLineWidth:2,
                            zeroLineColor:'rgba(245,165,8,0.2)',
                            color:'rgba(245,165,8,0.2)'
                           },
                labels: { show: true }
            }],
            yAxes: [{
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-axis-1',
                scaleLabel: {
                    display: true,
                    labelString: counterpart.translate(["home", "profile", "charts", "practiceYaxisLabel"])
                },
                ticks: {
                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value
                    suggestedMax: 10    // maximum will be 10 for now (TODO: handle this programmatically... or at least test it!)
                },
                gridLines: { display: true,
                             zeroLineWidth:2,
                            zeroLineColor:'rgba(245,165,8,0.2)',
                            color:'rgba(245,165,8,0.2)'
                           },
                labels: { show: true }
            },
            {
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-2',
                scaleLabel: {
                    display: true,
                    /* TODO - debug this wierdness */
                    labelString: counterpart.translate(["home", "profile", "charts", "performanceYaxisLabel"])
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
}

class Charts extends React.Component {
    localeChanged(newLocale) {
        this.forceUpdate()
    }
    
    render() {
        if (this.props.stats.loading) {
            return( <LoadingPage /> )
        }
        
        const stats = this.props.stats.getAllStats
        console.log(stats)
        // TODO: this can maybe be refactored, not so nice with the repeated if blocks
        if (stats === undefined) {
            return ( <Translate component="p" content="home.profile.charts.noTrainingOccurred" /> )
        }
        const chartData = makeChartData(this.props.period, stats, this.props.contrast)
        console.log(chartData)
        if (chartData === false) {
            return ( <Translate component="p" content="home.profile.charts.noTrainingOccurred" /> )
        }
                    
        let pieChart, mixChart, barChart, mixChartTitle
        
        const pieChartData = chartData.pieChartData[this.props.themeIndex]
        const mixChartData = chartData.mixChartData[this.props.themeIndex]
        const barChartData = chartData.barChartData[this.props.themeIndex]

        pieChart = <Pie data={pieChartData} options={pieOptions} />
        mixChart = <Bar data={mixChartData} options={generateMixOptions()} />
        barChart = <Bar data={barChartData} options={generateBarOptions()} />

        if ( this.props.contrast === 'all') {
            mixChartTitle = <Translate component="h3" content="home.profile.charts.mixChartTitleAllContrasts" /> //<h3>Practice and success rate for all contrasts</h3>            
        } else {
            //const titleString = "Practice and success rate for contrast " + this.props.contrast
            mixChartTitle = <h3><Translate content="home.profile.charts.mixChartTitleSomeContrast" />{this.props.contrast}</h3>
        }

        return (
            <div>
                {mixChartTitle}
                {mixChart}
                <Translate component="h3" content="home.profile.charts.pieChartTitle" />
                {pieChart}
                <Translate component="h3" content="home.profile.charts.barChartTitle" />
                {barChart}
            </div>
        )
    }
    
    componentDidMount() {
        // event listener: listens to locale changes
        counterpart.onLocaleChange(this.localeChanged)
    }
    componentWillUnmount() {
        // stop listening to locale changes
        counterpart.offLocaleChange(this.localeChanged)
    }
        
}

// TODO: Is this really the best way? Loading times could be shorter / loading could be less frequent
// if we take all the queries we need at the start and calculate based on them, rather than 
// making new queries as the user changes what they want to view on the page.
const periodMapper = {
    /* 1 smaller than the number of days/months involved, as today/this month is 0 days/months ago. */
    week:  ['day', 6],
    month: ['day', 29],
    year:  ['month', 11]
}   
const statsQueryConfig = { 
    name: 'stats',
    options: (ownProps) => ({
        variables: {
            languageId: ownProps.language,
            unit:   periodMapper[ownProps.period][0],
            number: periodMapper[ownProps.period][1]
        }
    })
}

export default graphql(statsQuery, statsQueryConfig)(Charts)