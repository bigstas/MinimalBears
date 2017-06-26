import React from 'react'
import Joyride from 'react-joyride'


const steps = [
    {
        title: 'The Record button',
        text: "Press this to record. Then, press it to record the next thing.",
        selector: '#startButton',
        position: 'bottom',
        style: {
            beacon: {
                offsetY: 0
            }
        }
    },
    {
      title: 'The Stop button',
      text: 'Press this to stop recording.',
      selector: '#stopButton',
      position: 'bottom'
    },
    {
      title: 'Play back all',
      text: 'Play back all that you have recorded so far, in sequence.',
      selector: '#playAllButton',
      position: 'bottom'
    },
    {
      title: 'Submit',
      text: "When you're ready, submit the audio you have recorded.",
      selector: '#submitButton',
      position: 'bottom'
    }
]


const RecordPageTutorial = React.createClass({
    render() {
        return(
            <Joyride
                ref={c => (this.joyride = c)}
                debug={true}
                autoStart={true}
                locale={{
                    back: (<span>Back</span>),
                    close: (<span>Close</span>),
                    last: (<span>Last</span>),
                    next: (<span>Next</span>),
                    skip: (<span>Skip</span>),
                }}
                run={true}
                showOverlay={true}
                showSkipButton={true}
                showStepsProgress={true}
                steps={steps}
                type='continuous'
            />
        )
    }
})

export default RecordPageTutorial