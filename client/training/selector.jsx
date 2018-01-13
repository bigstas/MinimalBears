import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import LoadingPage from '../auxiliary/loading'
import Translate from 'react-translate-component'

const Selector = React.createClass({
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
    render() {
        return (
            <div className='panel animated fadeIn' id='selector'>
                <Translate content={this.props.selectionMessage} component="p" style={{textAlign:"center"}} />
                {this.props.options.map(option =>
                    <div className='button chooseOption' key={option.id} 
                        onMouseEnter={!!this.props.mouseEnter ? this.props.mouseEnter : null} 
                        onMouseLeave={!!this.props.mouseLeave ? this.props.mouseLeave : null} 
                        onClick={()=>this.props.callback(option.id)}>
                        {option.text}
                        <br/>
                        {!!option.example ? <a className="selectorExample">{option.example}</a> : <span></span>}
                    </div>
                )}

                {!!this.props.extraText ? 
                    <div className='button' id='extraButton' onClick={this.props.extraCallback}>
                        <Translate content={this.props.extraText} />
                    </div> :
                    <div>{/*empty div*/}</div> 
                }
            </div>
        )
    }
})

const LanguageSelector = React.createClass({
    /* Choose a language
     * 
     * Required props:
     * data - result of a query for all languages
     * callback - function based on the language ID
     */
    render() {
        if (this.props.data.loading) { return <LoadingPage /> }
        // TODO: the change from allLanguages to allTrainingLanguages - does this have to change the way the Translate works (it was working differently before - see the translations files for details)?
        const options = this.props.data.allTrainingLanguages.nodes.map(language =>
            ({text: <Translate content={"train.language."+language.id.toString()} />,
              id: language.id,
              example: false})
        )
        
        return (
            <Selector
                selectionMessage="train.chooseLanguage"
                options={options}
                callback={this.props.callback}
            />
        )
    }
})

const ContrastSelector = React.createClass({
    /* Choose a contrast for a language. Only contrasts which have at least one pair are displayed.
     * 
     * Required props:
     * data - result of a query for all contrasts for a language
     * callback - function based on the contrast ID
     * extraCallback - function to return to choosing a language
     */
    getInitialState() {
        return { exampleCounter: 0 }
    },

    switchExample() {
        let newCounter = this.state.exampleCounter+1
        if (newCounter > 2) { newCounter = 0 }
        this.setState({ exampleCounter: newCounter })
    },
        
    handleMouseEnter() {
        this.timerID = setInterval(this.switchExample, 1500)
    },
        
    handleMouseLeave() {
        clearInterval(this.timerID)
    },
    
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
                mouseEnter={this.handleMouseEnter} mouseLeave={this.handleMouseLeave}
            />
        )
    },
    
    componentWillUnmount() {
        clearInterval(this.timerID)
    }
})

const languageQuery = gql`query {
    allTrainingLanguages {
        nodes {
            name
            id
        }
    }
}`

const contrastQuery = gql`query ($languageId:String!) {
    getContrastsWithExamples(languageId:$languageId) {
        nodes {
            name
            id
            examples {
                first
                second
            }
        }
    }
}`

const contrastQueryConfig = {
    options: (ownProps) => ({
        variables: {
            languageId: ownProps.activeLanguageId
        }
    })
}

const ConnectedLanguageSelector = graphql(languageQuery)(LanguageSelector)
const ConnectedContrastSelector = graphql(contrastQuery, contrastQueryConfig)(ContrastSelector)

export { Selector, ConnectedLanguageSelector, ConnectedContrastSelector }