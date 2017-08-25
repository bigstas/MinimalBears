import React from 'react'
import Joyride from 'react-joyride'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
    

const RecordPageTutorial = React.createClass({
    render() {
        return(
            <Joyride
                ref={c => (this.joyride = c)}
                debug={true}
                autoStart={true}
                locale={{
                    back: (<span><Translate content="record.tutorial.buttons.back" /></span>),
                    close: (<span><Translate content="record.tutorial.buttons.close" /></span>),
                    last: (<span><Translate content="record.tutorial.buttons.last" /></span>),
                    next: (<span><Translate content="record.tutorial.buttons.next" /></span>),
                    skip: (<span><Translate content="record.tutorial.buttons.skip" /></span>),
                }}
                run={true}
                showOverlay={true}
                showSkipButton={true}
                showStepsProgress={true}
                type='continuous'
                                             
                steps={[
                    {
                        title: counterpart.translate(['record', 'tutorial', 'step0', 'title']),
                        text: counterpart.translate(['record', 'tutorial', 'step0', 'text']),
                        selector: '#startButton',
                        position: 'bottom',
                        style: {
                            beacon: {
                                offsetY: 0
                            }
                        }
                    },
                    {
                        title: counterpart.translate(['record', 'tutorial', 'step1', 'title']),
                        text: counterpart.translate(['record', 'tutorial', 'step1', 'text']),
                        selector: '#stopIc',
                        position: 'bottom'
                    },
                    {
                        title: counterpart.translate(['record', 'tutorial', 'step2', 'title']),
                        text: counterpart.translate(['record', 'tutorial', 'step2', 'text']),
                        selector: '#playAllButton',
                        position: 'bottom'
                    },
                    {
                        title: counterpart.translate(['record', 'tutorial', 'step3', 'title']),
                        text: counterpart.translate(['record', 'tutorial', 'step3', 'text']),
                        selector: '#submitButton',
                        position: 'bottom'
                    }
                ]} 
            />
        )
    }
})

export default RecordPageTutorial