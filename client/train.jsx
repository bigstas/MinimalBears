import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Arena from '../client/arena';
import Selector from '../client/selector';

// combines Arena (where training happens) with Selector (where you choose language and contrast)
TrainPage = React.createClass({
    getInitialState() {
        return {
            languageChosen: !!this.props.activeLanguageId,
            activeContrastId: 0
        }
    },
    
    setLanguage(langId) {
        this.setState ({
            languageChosen: true
        });
        this.props.callbackApp(langId);
    },
    
    setContrast(contrastId) {
        this.setState({
            activeContrastId: contrastId
        });
    },
    
    render() {
        // By default, render the Selector
        var activeComponent = <Selector activeLanguageId={this.props.activeLanguageId} callbackLangId={this.setLanguage} callbackContrastId={this.setContrast} />;
        // If language and contrast are both specified, render the Arena
        if (this.state.languageChosen && !!this.state.activeContrastId) {
            activeComponent = <Arena activeLanguageId={this.props.activeLanguageId} activeContrastId={this.state.activeContrastId} />;
        }
        
        return (
            <div>
                <h2>'Train' page</h2>
                {activeComponent}
            </div>
        );
    }
});

export default TrainPage;