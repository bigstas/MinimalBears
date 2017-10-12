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
	 * options - list of objects, with 'text' and 'id' properties
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
                {this.props.options.map((c, index) =>
                    <div className='button chooseOption' key={c.id} 
                        onMouseEnter={!!this.props.mouseEnter ? this.props.mouseEnter : null} 
                        onMouseLeave={!!this.props.mouseLeave ? this.props.mouseLeave : null} 
                        onClick={()=>this.props.callback(c.id)}>
                        <Translate content={c.text} />
                        <br/>
                        {c.example ? <a className="selectorExample"><Translate content={c.example} /></a> : <span></span>}
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
        
        //const exampleArray = [ "mouse/mouth", "aal/all", "ścieka/szczeka" ]	 // To be replaced...?
        const options = this.props.data.allLanguages.nodes.map((c, index) => ({text:"train.language."+c.id.toString(), id:c.id, example:false}))
        
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
    /*
    componentDidMount() {
        // timed switch of example value
        const startTimer = setInterval(this.switchExample, 2000)
    },*/
    
	render() {
		if (this.props.data.loading) { return <LoadingPage /> }
        //const exampleArray = [ "Will", "be", "ready", "soon" ]
        const options = this.props.data.allContrastNonempties.nodes.map((c, index) => ({text:"train.contrast."+c.id.toString()+".name", id:c.id, example:"train.contrast."+c.id.toString()+".examples."+this.state.exampleCounter}))
        
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