import React from 'react'
import Translate from 'react-translate-component'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

function random(myArray) {
    const rand = myArray[Math.floor(Math.random() * myArray.length)]
    return rand
}

const DonePanel = React.createClass({
    mustBeLoggedIn() {
        alert("You must be logged in to view stats!")
    },
    
    render() {
        const bearPics = ["bear2.png", "bear3.png", "bear4.png", "bear6.png"]
        
        const averageDiv = (this.props.loggedIn ? 
            <div className="endDiv">
                <p className="hugeNumberTitle"><Translate content="train.donePanel.yourAverage" /></p>
                <p className="hugeNumber">{contrastAverage}%</p>
            </div> : 
            <span></span>)
        
        const statsButton = (this.props.loggedIn ? 
            <div className="button endButton">
                <Link className='plainLink' to="/" style={{color: "lightyellow"}}><Translate content={"train.donePanel.viewStats"} /></Link>
            </div> :
            <div>
                <div id="statsButton" className="button endButton" data-tip data-for='statsTooltip' data-delay-show='0'>
                    <Translate content={"train.donePanel.viewStats"} />
                </div>
                <ReactTooltip id="statsTooltip" place="left" type="light" effect="solid" multiline={false}>
                    <Translate component="p" content="train.donePanel.statsTooltip" />
                </ReactTooltip>
            </div>
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
                        {averageDiv}
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