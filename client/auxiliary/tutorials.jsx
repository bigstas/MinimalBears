import React from 'react'
import Joyride from 'react-joyride'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
    

const RecordPageTutorial = React.createClass({
    render() {
        // set debug to true below if required - it is annoying / clunky if you're not currently specifically debugging Joyride
        console.log(counterpart.getLocale())
        const steps = [
            {
                title: counterpart.translate(['record', 'tutorial', 'step0', 'title']),
                text: counterpart.translate(['record', 'tutorial', 'step0', 'text']),
                selector: '#firstWord',
                position: 'bottom'
            },
            {
                title: counterpart.translate(['record', 'tutorial', 'step1', 'title']),
                text: counterpart.translate(['record', 'tutorial', 'step1', 'text']),
                selector: '#startButton',
                position: 'bottom',
                style: {
                    beacon: {
                        offsetY: 0
                    }
                }
            },
            {
                title: counterpart.translate(['record', 'tutorial', 'step2', 'title']),
                text: counterpart.translate(['record', 'tutorial', 'step2', 'text']),
                selector: '#stopIc',
                position: 'bottom'
            },
            {
                title: counterpart.translate(['record', 'tutorial', 'step3', 'title']),
                text: counterpart.translate(['record', 'tutorial', 'step3', 'text']),
                selector: '#firstPlaybackWord',
                position: 'bottom'
            },
            {
                title: counterpart.translate(['record', 'tutorial', 'step4', 'title']),
                text: counterpart.translate(['record', 'tutorial', 'step4', 'text']),
                selector: '#firstReRecordWord',
                position: 'bottom'
            },
            {
                title: counterpart.translate(['record', 'tutorial', 'step5', 'title']),
                text: counterpart.translate(['record', 'tutorial', 'step5', 'text']),
                selector: '#playAllButton',
                position: 'bottom'
            },
            {
                title: counterpart.translate(['record', 'tutorial', 'step6', 'title']),
                text: counterpart.translate(['record', 'tutorial', 'step6', 'text']),
                selector: '#submitButton',
                position: 'bottom'
            },
            {
                title: counterpart.translate(['record', 'tutorial', 'step7', 'title']),
                text: counterpart.translate(['record', 'tutorial', 'step7', 'text']),
                selector: '#tutorialButton',
                position: 'bottom'
            }
        ]
        
        return(
            <Joyride
                className={this.props.interfaceLanguage} // this just needs to appear as some sort of prop, never mind what prop, so long as it makes Joyride update when the prop changes
                ref={c => (this.joyride = c)}
                debug={false}
                autoStart={this.props.autorun}
                run={this.props.autorun}
                locale={{
                    back: (<span><Translate content="record.tutorial.buttons.back" /></span>),
                    close: (<span><Translate content="record.tutorial.buttons.close" /></span>),
                    last: (<span><Translate content="record.tutorial.buttons.last" /></span>),
                    next: (<span><Translate content="record.tutorial.buttons.next" /></span>),
                    skip: (<span><Translate content="record.tutorial.buttons.skip" /></span>),
                }}
                showOverlay={true}
                showSkipButton={true}
                showStepsProgress={true}
                type='continuous'
                
                steps={steps} 
            />
        )
    }
})

export default RecordPageTutorial