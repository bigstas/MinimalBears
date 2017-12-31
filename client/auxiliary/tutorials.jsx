import React from 'react'
import Joyride from 'react-joyride'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
    

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

export default RecordPageTutorial