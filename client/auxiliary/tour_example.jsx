import React, { Component } from 'react'
import Tour from 'react-tourist'
    

const Demo = React.createClass({
    getInitialState() {
        return {
            completed: false
        }
    },
    
    startTour() {
        this.myTour.reset()
        this.myTour.start({cb: this.setComplete.bind(this, true)})
        this.setComplete(false)
    },
    
    setComplete (complete){
        this.setState({completed: complete})
    },
    
    render() {
        const style = {}
        if (this.state.completed){
            style.background = '#3498db';
        }

        return (
            <div>
                <div className='header' style={style}>
                    <h3>Using React Tourist</h3>
                    <p>This example page contains a simple article to guide you with using the library. The example tour uses elements in the article.</p>
                    <button onClick={this.startTour}>
                        {this.state.completed ? 'Restart Tour' : 'Start Tour'}
                    </button>
                    <p ref='step1'>This is the first step</p>
                </div>
                { this.props.children }
            </div>
        )
    },
    
    componentDidMount() {
        const tourItems = [
            { component: 'ExampleDiv1', ref: 'header', content: 'Hello World!' },
            { component: 'ExampleDiv2', ref: 'footer', content: 'Bye World!' }
        ]
        this.myTour = new Tour(tourItems)
    }
})

export default Demo