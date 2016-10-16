import React from 'react';
import { connect } from 'react-apollo';
import gql from 'graphql-tag';

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
	        <div id='selector'>
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
		var options = [], trueOptions = [];
		if (!this.props.data.loading && !this.props.pairs.loading && !this.props.items.loading) {
            // a list of all the contrasts (as objects)
            var potentialOptions = this.props.data.contrastNodes.nodes;
            console.log(potentialOptions);
            // for each contrast, only add it to the "options" list if it contains at least one pair
			for (i=0; i<potentialOptions.length; i++) {
                // use (...).length > 2 as when we have an empty object, it is expressed as "{}" and so its length is 2
                if (this.props.pairs.contrastWithPairsNodes.nodes[potentialOptions[i].rowId-1].pairs.length > 2) {
                    trueOptions.push(potentialOptions[i]);
                }
            }
            options = trueOptions.map(c => ({text:c.name, id:c.rowId}));
            console.log(options);
		}
		console.log(options);
        
		return (
			<Selector
				selectionMessage='Choose which contrast you want to train'
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
			query: gql`query ($language: Int) {
				contrastNodes(language: $language) {
					nodes {
						name
						rowId
					}
				}
			}`,
			variables: {
				language: ownProps.activeLanguageId
			}
        },
        pairs: {
            query: gql`query ($orderBy: ContrastWithPairsOrdering) {
            	contrastWithPairsNodes(orderBy: $orderBy) {
                	nodes {
                    	language
                    	name
                    	pairs
                	}
            	}
        	}`,
            variables: {
                orderBy: 'ROW_ID'
            }
		},
        items: {
            query: gql`query ($orderBy: ItemWithAudioOrdering) {
	            itemWithAudioNodes (orderBy: $orderBy) {
	                nodes {
	                	rowId
	                	language
	                	homophones
	                	audio
	                }
	            }
        	}`,
            variables: {
        	    orderBy: 'ROW_ID'
            }
        }
	}
}

const ConnectedLanguageSelector = connect({mapQueriesToProps: languageQueryToProps})(LanguageSelector)
const ConnectedContrastSelector = connect({mapQueriesToProps: contrastQueryToProps})(ContrastSelector)

export { Selector, ConnectedLanguageSelector, ConnectedContrastSelector }