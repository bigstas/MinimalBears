import React from 'react'
import Joyride from 'react-joyride'
import Translate from 'react-translate-component'
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
        
        return(
            <Joyride
                ref={c => (this.joyride = c)}
                debug={false}  //Set to true for Joyride to print information to console
                autoStart={true} // means that there will be no beacon
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
                        // TODO: this mutation sends, but if you navigate away from the record page and 
                        // come back, the tutorial prop from the query on the Record page still comes
                        // through as "false", you need to refresh the page to get it to be "true".
                        // It should be changed right away instead!
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

const completeTutorialMutation = gql`
mutation ($input: CompleteTutorialInput!) {
    completeTutorial(input: $input) {
        clientMutationId
    }
}`

const completeTutorialMutationConfig = {
    name: 'completeTutorialMutation',
    withRef: true, /* Allows use of React refs */
    options: {
        variables: {
            input: {
                clientMutationId: "0" /* This is not being used, but gql appears to demand it */
            }
        }
    }
}

export default graphql(completeTutorialMutation, completeTutorialMutationConfig)(RecordPageTutorial)