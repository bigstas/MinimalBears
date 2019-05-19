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
import { StartButton, StopButton, PlayAllButton, TutorialButton, TopRow, ReRecord, PlaybackOne, WordRow, RecordPage, WrappedRecordPage, ComposedWrappedRecordPage } from '/client/audio/record'

configure({ adapter: new Adapter() })

// NOTE: there is a fair bit of code repetition in this file.
// It may be a good idea to try to refactor that.
// The below function is a partial refactor to reduce code repetition.
function assertFunctionRunsOnClick(dummyFunction, element, elementId, expectClicked, message) {
    chai.assert.equal(dummyFunction.called, false)
    element.find('#' + elementId).simulate('click')
    if (!message) message = "[no message supplied in testing code]"
    chai.assert.equal(dummyFunction.called, expectClicked, message)
}

describe('StartButton', function() {
    it('is enabled in done and wait mode', function() {
        for (let mode of ["wait", "done"]) {
            const dummyfunc = sinon.fake()
            const start = mount(<StartButton mode={mode} next={0} max={10} callback={dummyfunc} />)
            const message = "fails in " + mode + " mode"
            assertFunctionRunsOnClick(dummyfunc, start, 'startButton', true, message)
        }
    })
})

describe('StopButton', function() {
    it('is disabled in done and wait mode', function() {
        for (let mode of ["wait", "done"]) {
            const dummyfunc = sinon.fake()
            const stop = mount(<StopButton mode={mode} next={0} max={10} callback={dummyfunc} />)
            const message = "fails in " + mode + " mode"
            assertFunctionRunsOnClick(dummyfunc, stop, 'stopButton', false, message)
        }
    })
})

describe('PlayAllButton', function() {
    it('is enabled in done and wait mode', function() {
        for (let mode of ["wait", "done"]) {
            const dummyfunc = sinon.fake()
            const playall = mount(<PlayAllButton mode={mode} recordedSoFar={2} playAllFunction={dummyfunc} />)
            assertFunctionRunsOnClick(dummyfunc, playall, 'playAllButton', true)
        }
    })
})

// TODO TutorialButton function


describe('ReRecord button', function() {
    it('is disabled in all modes if this word has not been recorded yet, regardless of focus', function() {
        for (let mode of ["wait", "record", "done", "reRecordSingleToWait", "reRecordSingleToDone", "playback", "playbackAll"]) {
            for (let focused of [true, false]) {
                const dummyfunc = sinon.fake()
                const reRecord = mount(<ReRecord index={0} mode={mode} next={1} srcExists={false} callback={dummyfunc} focused={focused} />)
                assertFunctionRunsOnClick(dummyfunc, reRecord, "firstReRecordWord", false)
            }
        }
    })
    it('is enabled in wait mode and done mode if this word has already been recorded, regardless of focus', function() {
        for (let mode of ["wait", "done"]) {
            for (let focused of [true, false]) {
                const dummyfunc = sinon.fake()
                const reRecord = mount(<ReRecord index={0} mode={mode} next={1} srcExists={true} callback={dummyfunc} focused={true} />)
                assertFunctionRunsOnClick(dummyfunc, reRecord, "firstReRecordWord", true)
            }
        }
    })
})

// TODO PlaybackOne function

// TODO WordRow function

// TODO RecordPage object

// TODO WrappedRecordPage object