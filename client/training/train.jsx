import React from 'react'
import Arena from './arena'
import { ConnectedLanguageSelector, ConnectedContrastSelector } from './selector'

// combines Arena (where training happens) with Selector (where you choose language and contrast)
class TrainPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			activeContrastId: null
		}
    }
    
    setContrast(contrastId) {
        this.setState({
        	activeContrastId: contrastId
        })
    }
    
    render() {
        let activeComponent
        // If language and contrast are both specified, render the Arena, otherwise render the appropriate Selector
        if (this.state.activeContrastId != null) {
            // Contrast has been chosen
            activeComponent = <Arena activeLanguageId={this.props.activeLanguageId}
                                     activeContrastId={this.state.activeContrastId} 
                                     username={this.props.username}
                                  />
        } else if (this.props.activeLanguageId != null) {
            // Contrast has not been chosen, but language has
            activeComponent = <ConnectedContrastSelector activeLanguageId={this.props.activeLanguageId}
                                                         callback={this.setContrast.bind(this)}
                                                         extraCallback={() => this.props.callbackLanguage(null)} />
        } else {
            // Neither language nor contrast has been chosen 
            activeComponent = <ConnectedLanguageSelector callback={this.props.callbackLanguage} />
        }
        return activeComponent
    }
}

export default TrainPage