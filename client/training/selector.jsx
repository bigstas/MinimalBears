import React from 'react'
import { connect } from 'react-apollo'
import gql from 'graphql-tag'

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
	 */
	render() {
		return (
	        <div className='panel' id='selector'>
		        <p>{this.props.selectionMessage}</p>
		        {this.props.options.map(c =>
		        	<div className='chooseOption' key={c.id} onClick={()=>this.props.callback(c.id)}>
		        		{c.text}
	        		</div>
                )}
		        
		        {!!this.props.extraText ? 
		            <div className='extraButton' id={this.props.extraText} onClick={this.props.extraCallback}>
		        		{this.props.extraText}
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
		let options
		if (this.props.data.loading) {
			options = []
		} else {
			options = this.props.data.languageNodes.nodes.map(c => ({text:c.name, id:c.rowId}))
		}
		
		return (
			<Selector
				selectionMessage='Choose the language you want to train'
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
	render() {
		let options
		if (this.props.data.loading) {
			options = []
		} else {
			options = this.props.data.contrastNonemptyNodes.nodes.map(c => ({text:c.name, id:c.rowId}))
		}
        
		return (
			<Selector
				selectionMessage={options.length === 0 ? "Sorry, we don't have enough audio ready for this language. We're working on it!" : 'Choose which contrast you want to train'}
				options={options}
				callback={this.props.callback}
				extraText='Change language'
				extraCallback={this.props.extraCallback}
			/>
		)
	}
})

function languageQueryToProps() {
	// Fetches all languages
	return {
		data: {
			query: gql`{
				languageNodes {
					nodes {
						name
						rowId
					}
				}
			}`
		}
	}
}

function contrastQueryToProps({ownProps}) {
	// Fetches all contrasts for the language with id given by props.language
	return {
		data: {
			query: gql`query ($language: Int, $orderBy: ContrastNonemptyOrdering) {
				contrastNonemptyNodes(language: $language, orderBy: $orderBy) {
					nodes {
						name
						rowId
					}
				}
			}`,
			variables: {
				language: ownProps.activeLanguageId,
				orderBy: 'NAME'
			}
        }
	}
}

const ConnectedLanguageSelector = connect({mapQueriesToProps: languageQueryToProps})(LanguageSelector)
const ConnectedContrastSelector = connect({mapQueriesToProps: contrastQueryToProps})(ContrastSelector)

export { Selector, ConnectedLanguageSelector, ConnectedContrastSelector }