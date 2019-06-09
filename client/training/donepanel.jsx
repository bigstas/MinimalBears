import React from 'react'
import Translate from 'react-translate-component'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router'
import { graphql } from 'react-apollo'

import { contrastAverageQuery } from '/lib/graphql'

function random(myArray) {
    const rand = myArray[Math.floor(Math.random() * myArray.length)]
    return rand
}

function DonePanel(props) {
    const bearPics = ["bear2.png", "bear3.png", "bear4.png", "bear6.png"]
    
    const averageDiv = (props.loggedIn ? 
        <div className="endDiv">
            <p className="hugeNumberTitle"><Translate content="train.donePanel.yourAverage" /></p>
            <p className="hugeNumber">{contrastAverage}%</p>
        </div> : 
        <span></span>)
    
    const statsButton = (props.loggedIn ? 
        <div id="statsButton" className="button endButton">
            <Link id="statsButtonLink" to="/"><Translate content={"train.donePanel.viewStats"} /></Link>
        </div> :
        <div>
            <div id="statsButtonDisabled" className="button endButton" data-tip data-for='statsTooltip' data-delay-show='0'>
                <Translate content={"train.donePanel.viewStats"} />
            </div>
            <ReactTooltip id="statsTooltip" place="left" type="light" effect="solid" multiline={false}>
                <Translate component="p" content="train.donePanel.statsTooltip" />
            </ReactTooltip>
        </div>
    )
    
    if (props.contrastAverage.loading) { return <span></span> }
    console.log(props.contrastAverage)
    const contrastAverage = Math.round(100*props.contrastAverage.getContrastAvg)
    // debug logs
    const pic = random(bearPics)
    console.log(pic)
    
    return (
        <div id='endPanel' className="panel animated fadeIn">
            <img id="endImage" src={pic} />
            <div>
                <div className="endDiv" id="resultsDiv">
                    <div className="endDiv">
                        <p className="hugeNumberTitle"><Translate content="train.donePanel.yourScore" /></p>
                        <p className="hugeNumber">{props.score}%</p>
                    </div>
                    {averageDiv}
                </div>
                <div className="endDiv" id="buttonDiv">
                    <div className="button endButton" onClick={props.handleClick}><Translate content="train.donePanel.playAgain" /></div>
                    {statsButton}
                </div>
            </div>
        </div>
    )
}

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