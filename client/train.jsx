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
    
    prepareArena() {
        this.setState ({
            languageChosen: true,
            activeContrastId: 1
        });
    },
    
    render() {
        // By default, render the Selector
        var activeComponent = <Selector activeLanguage={this.state.languageChosen} callback={this.prepareArena} />;
        // If language and contrast are both specified, render the Arena
        if (this.state.languageChosen && !!this.state.activeContrastId) {
            activeComponent = <Arena activeLanguage={this.props.activeLanguageId} activeContrast={this.state.activeContrastId} />;
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