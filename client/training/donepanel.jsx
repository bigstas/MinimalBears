import React from 'react'
import Translate from 'react-translate-component'
import { Link } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

function random(myArray) {
    const rand = myArray[Math.floor(Math.random() * myArray.length)]
    return rand
}

const DonePanel = React.createClass({
    getInitialState() {
        return { clicked: false }
    },
    
    mustBeLoggedIn() {
        alert("You must be logged in to view stats!")
    },
    
    render() {
        const bearPics = ["bear2.png", "bear3.png", "bear4.png", "bear6.png"]
        
        const statsButton = (this.props.loggedIn ? 
            <div className="button endButton"><Link className='plainLink' to="/" style={{color: "lightyellow"}}><Translate content={"train.donePanel.viewStats"} /></Link></div> :
            <div className="button endButton" onClick={this.mustBeLoggedIn}><Translate content={"train.donePanel.viewStats"} /></div>
        )
        
        if (this.props.contrastAverage.loading) { return <span></span> }
        console.log(this.props.contrastAverage)
        const contrastAverage = Math.round(100*this.props.contrastAverage.getContrastAvg)
        // debug logs
        const pic = random(bearPics)
        console.log(pic)
        
        return (
            <div className="panel animated fadeIn">
                <img id="endImage" src={pic} />
                {/*<p className="caption"><em>{pic[1]}</em></p> /* TODO? Do we want captions? */}
                <div>
                    <div className="endDiv" id="resultsDiv">
                        <div className="endDiv">
                            <p className="hugeNumberTitle"><Translate content="train.donePanel.yourScore" /></p>
                            <p className="hugeNumber">{this.props.score}%</p>
                        </div>
                        <div className="endDiv">
                            <p className="hugeNumberTitle"><Translate content="train.donePanel.yourAverage" /></p>
                            <p className="hugeNumber">{contrastAverage}%</p>
                        </div>
                    </div>
                    <div className="endDiv" id="buttonDiv">
                        {/* TODO: these two are styling differently on hover, they should style the same */}
                        <div className="button endButton" onClick={this.props.handleClick}><Translate content="train.donePanel.playAgain" /></div>
                        {statsButton}
                    </div>
                </div>
            </div>
        )
    }
})

const contrastAverageQuery = gql`query($contrastId:Int, $unit: String, $number: Int){
    getContrastAvg(contrastId: $contrastId, unit: $unit, number: $number)
}`

const contrastAverageQueryConfig = {
    name: 'contrastAverage',
    options: (ownProps) => ({
        variables: {
            contrastId: ownProps.activeContrastId,
            unit: 'year',
            number: 1
        }
    })
}

export default graphql(contrastAverageQuery, contrastAverageQueryConfig)(DonePanel)