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
        var activeComponent;
        // If language and contrast are both specified, render the Arena, otherwise render the Selector
        if (this.state.languageChosen && !!this.state.activeContrastId) {
            activeComponent = <Arena activeLanguageId={this.props.activeLanguageId} activeContrastId={this.state.activeContrastId} />;
        } else {
            activeComponent = <Selector params={{activeLanguageId: this.props.activeLanguageId}} callbackLangId={this.setLanguage} callbackContrastId={this.setContrast} />;
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