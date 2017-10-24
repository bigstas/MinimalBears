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
                     
                /* BUG REPORT: 
                When you change language on the Record page, the button labels (in locale above) change, but the step text (below, steps) does not. You have to navigate away to another page and come back to get it into the new language.
                
                The reason for this is that the Joyride element is not re-rendering when the locale changes. 
                The buttons change value because <Translate> keeps up to date regardless of re-rendering (or maybe <Translate> is itself re-rendering?), but the text is based on a JavaScript function (counterpart.translate) rather than a JSX element, so it doesn't re-run unless render is called again.
                
                A possible solution would be to use a React element and extract its text, but that seems like a really hacky workaround, and I tried it quickly and it didn't work anyway. Maybe there is some way to make the Joyride component re-render when the locale changes, but this doesn't seem in the spirit of Translate (?). So I can think of solutions, but none of them looks good, so I leave this as an open (though soluble) issue for now.
                 */
                
                steps={steps} 
            />
        )
    }
})

export default RecordPageTutorial