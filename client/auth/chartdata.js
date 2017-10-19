const chartdata = {
    lineChartData: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
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
                data: [65, 59, 80, 81, 56, 55, 40, 0, 1, 2, 3],
                spanGaps: false,
            }
        ]
    },
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
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            type:'line',
            label: 'Performance',
            data: [51, 65, 55, 58, 60, 75, 89],
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
            data: [200, 185, 590, 621, 250, 400, 95],
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
            data: [48, 54, 55, 58, 52, 67, 70],
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
            data: [200, 185, 590, 621, 250, 400, 95],
            fill: false,
            backgroundColor: 'blue',
            borderColor: '#71B37C',
            hoverBackgroundColor: '#71B37C',
            hoverBorderColor: '#71B37C',
            yAxisID: 'y-axis-1'
        }]
    }
]}

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
            gridLines: {
                display: false
            },
            labels: {
                show: true
            }
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

export { chartdata, mixOptions }