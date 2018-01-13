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
        const bearPics = [
            ["bear2.png", "There's no greater power than the power of Hi 5."], 
            ["bear3.png", "Give a bear a fish, and it will be your friend for a day."], 
            ["bear4.png", "Remember to share with your friends!"], 
            ["bear6.png", "Bears never forget!"]
        ]
        const pic = random(bearPics)
        console.log(pic)
        // For some reason, this is running twice - it seems that the page is re-rendering twice. TODO - should only re-render once.
        
        const statsButton = (this.props.loggedIn ? 
            <div className="button endButton"><Link className='plainLink' to="/" style={{color: "lightyellow"}}><Translate content={"train.viewStats"} /></Link></div> :
            <div className="button endButton" onClick={this.mustBeLoggedIn}><Translate content={"train.viewStats"} /></div>
        )
        
        console.log(this.props.contrastAverage)
        const contrastAverage = this.props.contrastAverage.getContrastAvg
        
        return (
            <div className="panel animated fadeIn">
                <img id="endImage" src={pic[0]} />
                <p className="caption"><em>{pic[1]}</em></p>
                <div>
                    <div className="endDiv" id="resultsDiv">
                        <div className="endDiv">
                            <p className="hugeNumberTitle">Your score:</p>
                            <p className="hugeNumber">{this.props.score}%</p>
                        </div>
                        <div className="endDiv">
                            <p className="hugeNumberTitle">Your average:</p>
                            <p className="hugeNumber">{contrastAverage}%</p>
                        </div>
                    </div>
                    <div className="endDiv" id="buttonDiv">
                        <div className="button endButton" onClick={this.props.handleClick}>Play again</div>
                        {statsButton}
                    </div>
                </div>
            </div>
        )
    }
})

const contrastAverageQuery = gql`query($contrastId:Int){
getContrastAvg(contrastId: $contrastId)
}`

const contrastAverageQueryConfig = {
    name: 'contrastAverage',
    options: (ownProps) => ({
        variables: {
            contrastId: ownProps.activeContrastId
        }
    })
}

export default graphql(contrastAverageQuery, contrastAverageQueryConfig)(DonePanel)