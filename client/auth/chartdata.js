function makeRandomData(points, min, max) {
    const range = max - min
    let randomData = []
    for (let i = 0; i < points; i++ ) {
        const randomDatum = Math.round( min + range*Math.random() )
        randomData.push(randomDatum)
    }
    return randomData
}

function makeChartData(period) {
    const chartdata = {
        pieChartData: [{
            labels: [
                'ee/i',
                's/th',
                'i/e'
            ],
            datasets: [{
                data: [300, 50, 100],
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
            labels: [
                'ś-sz',
                'ć-cz',
                'ą-ę'
            ],
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
            labels: (period === "week" ? ['today', 'yesterday', '2 days ago', '3 days ago', '4 days ago', '5 days ago', '6 days ago', '7 days ago'] : ['January', 'February', 'March', 'April', 'May', 'June']),
            datasets: [{
                type:'line',
                label: 'Performance',
                data: ( period === "week" ? makeRandomData(7, 50, 100) : makeRandomData(6, 50, 100) ),
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
                data: ( period === "week" ? makeRandomData(7, 0, 200) : makeRandomData(6, 0, 200) ),
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
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
        }
    ]}
    return chartdata
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
                suggestedMin: 40,    // minimum will be 0, unless there is a lower value
                suggestedMax: 100
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
                suggestedMin: 40,    // minimum will be 0, unless there is a lower value
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

export { makeChartData, mixOptions, pieOptions }