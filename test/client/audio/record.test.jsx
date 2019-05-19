// some record page imports
import React from 'react'
//import LoadingPage from '../../client/auxiliary/loading'
//import Translate from 'react-translate-component'
//import counterpart from 'counterpart'
//import Tutorial from '../../client/auxiliary/tutorials'
import { PreRecord, RecordSelector, NoRecordPage } from '/client/audio/norecord'
// testing imports
import { configure, shallow, mount } from 'enzyme'
import chai from 'chai'
import sinon from 'sinon'
import Adapter from 'enzyme-adapter-react-16'
// the page itself
import { StartButton, StopButton, PlayAllButton, SubmitButton, TutorialButton, TopRow, ReRecord, PlaybackOne, WordRow, RecordPage, WrappedRecordPage, ComposedWrappedRecordPage } from '/client/audio/record'

configure({ adapter: new Adapter() })

function assertFunctionRunsOnClick(componentClass, elementId, props, expectClicked, message) {
    /* Test that a function is called (or not) when clicked.
     * componentClass: React component class (not HTML/CSS class!)
     * elementId: HTML/CSS id
     * props: props to be passed to the class, except for the callback, which is injected here
     * expectClicked: whether the callback should fire or not on click
     * message: optional, gives a custom additional message in the testing browser if the test fails
     */
    const dummyfunc = sinon.fake()
    // makes a copy as props is an object and therefore a reference type
    const fullProps = JSON.parse(JSON.stringify(props))
    fullProps['callback'] = dummyfunc
    // mount: an Enzyme method to "create" an object; the code in the brackets is React without JSX
    const element = mount(React.createElement(componentClass, fullProps, null))
    // assertions
    chai.assert.equal(dummyfunc.called, false)
    element.find('#' + elementId).simulate('click')
    if (!message) message = "[no message supplied in testing code]"
    chai.assert.equal(dummyfunc.called, expectClicked, message)
}

function testModes(componentClass, elementId, props, enabledModes, labels) {
    /* A function to test whether a component is enabled and disabled in the appropriate modes.
     * By "enabled", I mean that its onClick callback fires.
     * Arguments as in assertFunctionRunsOnClick (above), except one:
     * labels: optional, object with names given to the "describe" function, shown as titles in the testing browser
     */
    const allModes = ["wait", "record", "done", "reRecordSingleToWait", "reRecordSingleToDone", "playback", "playbackAll"]
    function run(mode, expectToRun) {
        // form a copy - props is an object and therefore a reference type
        const augmentedProps = JSON.parse(JSON.stringify(props))
        augmentedProps['mode'] = mode
        const message = "fails in " + mode + " mode"
        assertFunctionRunsOnClick(componentClass, elementId, augmentedProps, expectToRun, message)
    }
    labels = labels || { 
        enabled:  'is enabled in the following modes: ' + enabledModes.join(', '),
        disabled: 'is disabled in all other modes'
    }
    if (enabledModes.length > 0) { // you could have no modes enabled, then no need for this block, hence the if statement
        it(labels['enabled'], function () {
            for (let mode of enabledModes) {
                run(mode, true)
            }
        })
    }
    if (enabledModes.length < allModes.length) { // you could have no modes disabled, then no need for this block, hence this if statement
        it(labels['disabled'], function() {
            for (let mode of allModes) {
                if ( !(enabledModes.includes(mode)) ) {
                    run(mode, false)
                }
            }
        })
    }
}

describe('Record page', function() {
    describe('Enabled/disabled status', function() {
        // these elements all have to have their enabled status checked
        const config = [
            { name: 'StartButton',   id: 'startButton',   class: StartButton,   enabledModes: ["wait", "done", "record"], props: { next: 0, max: 10 }, labels: null },
            { name: 'StopButton',    id: 'stopButton',    class: StopButton,    enabledModes: ["record"],                 props: { next: 0, max: 10 }, labels: null },
            { name: 'PlayAllButton', id: 'playAllButton', class: PlayAllButton, enabledModes: ["wait", "done"],           props: { recordedSoFar: 1 }, labels: null },
            { name: 'SubmitButton',  id: 'submitButton',  class: SubmitButton,  enabledModes: ["done"],                   props: {},                   labels: null },
            { name: 'TutorialButton',id: 'tutorialButton',class: TutorialButton,enabledModes: ["wait", "done"],           props: {},                   labels: null },
            { name: 'PlaybackOne - not recorded yet', id: 'firstPlaybackWord', class: PlaybackOne,enabledModes: [], props: { index: 0, srcExists: false },
                labels: {
                    disabled: "is disabled in all modes if this word has not been recorded yet"
                }    
            },
            { name: 'PlaybackOne - already recorded', id: 'firstPlaybackWord', class: PlaybackOne,enabledModes: ["wait", "done"], props: { index: 0, srcExists: true },
                labels: {
                    enabled: "is enabled in wait and done modes if this word has already been recorded",
                    disabled: "is disabled in all other modes if this word has already been recorded"
                }    
            },
            { name: 'ReRecordButton - not recorded yet', id: 'firstReRecordWord', class: ReRecord, enabledModes: [], props: { index: 0, next: 1, srcExists: false, focused: true },
                labels: { 
                    disabled: "is disabled in all modes if this word has not been recorded yet"
                }
            },
            { name: 'ReRecordButton - already recorded', id: 'firstReRecordWord', class: ReRecord,   enabledModes: ["wait", "done", "reRecordSingleToWait", "reRecordSingleToDone"], props: { index: 0, next: 1, srcExists: true, focused: true },
                labels: {
                    enabled: "is enabled in wait, done, reRecordSingleToWait, and reRecordSingleToDone modes if the word has already been recorded",
                    disabled: "is disabled in all other modes if the word has already been recorded"
                }
            }
        ]
        for (let c of config) {
            describe(c.name, ()=> { testModes(c.class, c.id, c.props, c.enabledModes, c.labels) })
        }
    })
    
    describe('Button rows', function() {
        describe('TopRow', function() {
            it('has no tests - no logic, automatically passing', function() {
                chai.assert.isTrue(true)
            })
        })
        describe('WordRow', function() {
            it('has no tests - no logic, automatically passing', function() {
                chai.assert.isTrue(true)
            })
        })
    })
    
    // TODO RecordPage object
    // TODO WrappedRecordPage object
    // leave these for integration testing?
})