import React from 'react'
import Joyride from 'react-joyride'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
    

const RecordPageTutorial = React.createClass({
    render() {
        const selectors = ['#firstWord',  //0
                           '#startButton',  //1
                           '#stopIc',  //2
                           '#firstPlaybackWord',  //3
                           '#firstReRecordWord',  //4
                           '#playAllButton',  //5
                           '#submitButton',  //6
                           '#tutorialButton']   //7
        
        // TODO add callback for completing the tutorial
        return(
            <Joyride
                ref={c => (this.joyride = c)}
                debug={false}  //Set to true for Joyride to print information to console
                autoStart={this.props.autorun}
                run={this.props.autorun}
                locale={{
                    back: (<span><Translate content="record.tutorial.buttons.back" /></span>),
                    close: (<span><Translate content="record.tutorial.buttons.close" /></span>),
                    last: (<span><Translate content="record.tutorial.buttons.last" /></span>),
                    next: (<span><Translate content="record.tutorial.buttons.next" /></span>),
                }}
                showOverlay={true}
                showStepsProgress={true}
                type='continuous'
                scrollToSteps={false}
                disableOverlay={true}
                callback={(stepdata)=> {
                    console.log(stepdata.type)
                    if (stepdata.type === "finished") {
                        console.log("It is finished.")
                        // now that the tutorial is complete, do the mutation
                        this.props.completeTutorialMutation()
                        .then( (response) => {
                            console.log('Tutorial is complete - mutation sent to database.')
                            console.log(response)
                        }).catch( (error) => {
                            console.log('Tutorial completion mutation error')
                            console.log(error)
                        })
                    }
                }}
                
                steps={selectors.map((selector, i) => ({
                    title: <Translate content={`record.tutorial.step${i}.title`} />,
                    text: <Translate content={`record.tutorial.step${i}.text`} />,
                    selector: selector,
                    position: 'bottom'
                }))} 
            />
        )
    }
})

const completeTutorialMutation = gql`mutation {
    completeTutorial (input: {}) {
        string
    }
}`

const completeTutorialMutationConfig = {
    name: 'completeTutorialMutation'
}

export default graphql(completeTutorialMutation, completeTutorialMutationConfig)(RecordPageTutorial)