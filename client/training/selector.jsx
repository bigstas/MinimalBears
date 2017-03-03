import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import LoadingPage from '../loading'
import Translate from 'react-translate-component'

const Selector = React.createClass({
	/* A series of buttons from which the user can choose one
	 * 
	 * Required props:
	 * selectionMessage - text to display at the top
	 * options - list of objects, with 'text' and 'id' properties
	 * callback - function to call when an option is chosen (takes 'id' as argument)
	 * 
	 * Optional props:
	 * extraText - text to show on extra button
	 * extraCallback - function for extra button (takes no arguments)
	 *
	 * Note that selectionMessage, options text, and extraText will be passed
	 * as the content of Translate components 
	 */
	render() {
        return (
            <div className='panel animated fadeIn' id='selector'>
                <Translate content={this.props.selectionMessage} component="p" />
                {this.props.options.map((c, index) =>
                    <div className='button chooseOption' key={c.id} onClick={()=>this.props.callback(c.id)}>
                        <Translate content={c.text} />
                        <a className="selectorExample">{c.example}</a>
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
        
        const exampleArray = [ "mouse/mouth", "aal/all", "ścieka/szczeka" ]	 // To be replaced...?
        const options = this.props.data.allLanguages.nodes.map(c, index => ({text:"train.language."+c.id.toString(), id:c.id, example:exampleArray[index]}))
        
		return (
			<Selector
				selectionMessage="train.chooseLanguage"
				options={options}
				callback={this.props.callback}
                exampleArray={exampleArray /* TODO: in future, will use a db lookup */}
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
	render() {
		if (this.props.data.loading) { return <LoadingPage /> }
        const exampleArray = [ "Will", "be", "ready", "soon" ]
        const options = this.props.data.allContrastNonempties.nodes.map(c, index => ({text:"train.contrast."+c.id.toString(), id:c.id, example:exampleArray[index]}))
        
		return (
			<Selector
				selectionMessage={options.length === 0 ? "train.sorryNoContrasts" : "train.chooseContrast" }
				options={options}
				callback={this.props.callback}
				extraText='train.changeLanguage'
				extraCallback={this.props.extraCallback}
			/>
		)
	}
})

const languageQuery = gql`query {
	allLanguages {
		nodes {
			name
			id
		}
	}
}`


const contrastQuery = gql`query ($language: Int, $orderBy: ContrastNonemptiesOrderBy) {
	allContrastNonempties(condition: {language: $language}, orderBy: $orderBy) {
		nodes {
			name
			id
		}
	}
}`

const contrastQueryConfig = {
    options: (ownProps) => ({
        variables: {
            language: ownProps.activeLanguageId,
            orderBy: 'NAME_ASC'
        }
    })
}

const ConnectedLanguageSelector = graphql(languageQuery)(LanguageSelector)
const ConnectedContrastSelector = graphql(contrastQuery, contrastQueryConfig)(ContrastSelector)

export { Selector, ConnectedLanguageSelector, ConnectedContrastSelector }