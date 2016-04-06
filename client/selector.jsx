import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';


Selector = React.createClass({
    render() {
        // Turn this into a single function to be defined elsewhere, or keep it here as these two?
        var languagesToBeMapped, callback;
        if (this.props.languages === undefined || this.props.callbackTrain === undefined) {
            languagesToBeMapped = ['loading...'];
            callback = function () {console.log('languages are loading...');}
        } else {
            languagesToBeMapped = this.props.languages;
            callback = this.props.callbackTrain;
        }
        var contrastsToBeMapped;
        if (this.props.contrasts === undefined) {
            contrastsToBeMapped = ['loading...'];
        } else {
            contrastsToBeMapped = this.props.contrasts;
        }
        
        
        return (
            <div>
                <p>This is the selector</p>
                {languagesToBeMapped.map(function(c) {
                    return <div className='chooseLanguage' key={c.id} onClick={()=>callback(c.id)}>{c.name}</div>
                })}
            {/* <button type='button' onClick={this.props.callback}>Press me!</button> */}
            </div>
        );
    }
});


// These are props to decide how the selector will render
Selector.propTypes = {
    loading: React.PropTypes.bool,
    languages: React.PropTypes.array,
    contrasts: React.PropTypes.array,
    //activeLanguageId: React.PropTypes.number
    // (above handled elsewhere)
};

export default createContainer(({params}) => {
    //const { activeLanguageId } = params; // we're so ES6! Bring on the future
    // the above means
    // const activeLanguageId = params.activeLanguageId;
    const activeLanguageId = 1; // to be changed!
    const languagesHandle = Meteor.subscribe('langdata');
    const contrastHandle = Meteor.subscribe('contrastdata');
    const loading = !languagesHandle.ready() && !contrastHandle.ready();
    const languages = Languages.fetch();
    const contrasts = Contrasts.where({
        language: activeLanguageId
    }).fetch(); // alternative syntax is }).select("*");
    return {
        activeLanguageId,
        loading,
        languages,
        contrasts
    };
}, Selector);