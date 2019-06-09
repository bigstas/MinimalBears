import React from 'react'
import { graphql } from 'react-apollo'
import Translate from 'react-translate-component'

import LoadingPage from '../auxiliary/loading'
import { trainingLanguageQuery, contrastQuery } from '/lib/graphql'

function Selector(props) {
    /* A series of buttons from which the user can choose one
     * 
     * Required props:
     * selectionMessage - text to display at the top
     * options - list of objects, with 'text' and 'id' properties (and an optional 'example' property)
     * callback - function to call when an option is chosen (takes 'id' as argument)
     * 
     * Optional props:
     * extraText - text to show on extra button
     * extraCallback - function for extra button (takes no arguments)
     * mouseEnter - function when user rolls over buttons (starts timer for changing examples)
     * mouseLeave - function when user moves mouse out of buttons (stops timer)
     *
     * Note that selectionMessage, options text, and extraText will be passed
     * as the content of Translate components 
     */
    return (
        <div className='panel animated fadeIn' id='selector'>
            <Translate content={props.selectionMessage} component="p" style={{textAlign:"center"}} />
            {props.options.map(option =>
                <div className='button chooseOption' key={option.id} 
                    onMouseEnter={!!props.mouseEnter ? props.mouseEnter : null} 
                    onMouseLeave={!!props.mouseLeave ? props.mouseLeave : null} 
                    onClick={()=>props.callback(option.id)}>
                    {option.text}
                    <br/>
                    {!!option.example ? <a className="selectorExample">{option.example}</a> : <span></span>}
                </div>
            )}

            {!!props.extraText ? 
                <div className='button' id='extraButton' onClick={props.extraCallback}>
                    <Translate content={props.extraText} />
                </div> :
                <div>{/*empty div*/}</div> 
            }
        </div>
    )
}

function LanguageSelector(props) {
    /* Choose a language
     * 
     * Required props:
     * data - result of a query for all languages
     * callback - function based on the language ID
     */
    if (props.data.loading) { return <LoadingPage /> }
    const options = props.data.allTrainingLanguages.nodes.map(language =>
        ({text: <Translate content={"train.language."+language.id.toString()} />,
          id: language.id,
          example: false})
    )
    
    return (
        <Selector
            selectionMessage="train.chooseLanguage"
            options={options}
            callback={props.callback}
        />
    )
}

class ContrastSelector extends React.Component {
    /* Choose a contrast for a language. Only contrasts which have at least one pair are displayed.
     * 
     * Required props:
     * data - result of a query for all contrasts for a language
     * callback - function based on the contrast ID
     * extraCallback - function to return to choosing a language
     */
	constructor(props) {
		super(props)
		this.state = {
			exampleCounter: 0
		}
    }

    switchExample() {
        let newCounter = this.state.exampleCounter+1
        if (newCounter > 2) { newCounter = 0 }
        this.setState({ exampleCounter: newCounter })
    }
        
    handleMouseEnter() {
        this.timerID = setInterval(this.switchExample.bind(this), 1500)
    }
        
    handleMouseLeave() {
        clearInterval(this.timerID)
    }
    
    render() {
        if (this.props.data.loading) { return <LoadingPage /> }
        
        const options = this.props.data.getContrastsWithExamples.nodes.map(contrast => {
            const pair = contrast.examples[this.state.exampleCounter]
            const pairString = pair.first + "/" + pair.second
            return {text: contrast.name,
                    id: contrast.id,
                    example: pairString}
        })
        
        return (
            <Selector
                selectionMessage={options.length === 0 ? "train.sorryNoContrasts" : "train.chooseContrast" }
                options={options}
                callback={this.props.callback}
                extraText='train.changeLanguage'
                extraCallback={this.props.extraCallback}
                mouseEnter={this.handleMouseEnter.bind(this)} mouseLeave={this.handleMouseLeave.bind(this)}
            />
        )
    }
    
    componentWillUnmount() {
        clearInterval(this.timerID)
    }
}

const contrastQueryConfig = {
    options: (ownProps) => ({
        variables: {
            languageId: ownProps.activeLanguageId
        }
    })
}

const ConnectedLanguageSelector = graphql(trainingLanguageQuery)(LanguageSelector)
const ConnectedContrastSelector = graphql(contrastQuery, contrastQueryConfig)(ContrastSelector)

export { Selector, ConnectedLanguageSelector, ConnectedContrastSelector }