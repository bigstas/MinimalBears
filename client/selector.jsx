import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';


Selector = React.createClass({
    render() {
        // A lot of repeating code here, could be optimised in future
        var selectionMessage;
        // If there is no active language...
        if (!this.props.params.activeLanguageId) {
            selectionMessage = <p>Choose the language you want to train</p>;
            // ...set up the language buttons...
            var languagesToBeMapped, callbackLangId;
            // ...but you may have to wait while the props load...
            if (this.props.languages === undefined || this.props.callbackLangId === undefined) {
                languagesToBeMapped = ['loading...'];
                callbackLangId = function () {console.log('languages are loading...');}
            // ...otherwise, go ahead and set them up
            } else {
                languagesToBeMapped = this.props.languages;
                callbackLangId = this.props.callbackLangId;
            }
        // On the other hand, if there is an active language...
        } else {
            selectionMessage = <p>Choose which contrast you want to train</p>;
            // ...set up the contrast buttons...
            var contrastsToBeMapped, callbackContrastId;
            // ...but you may have to wait for props to load...
            if (this.props.contrasts === undefined || this.props.callbackContrastId === undefined) {
                contrastsToBeMapped = ['loading...'];
                callbackContrastId = function () {console.log('contrasts are loading...');}
            // ...otherwise, go ahead and set them up
            } else {
                contrastsToBeMapped = this.props.contrasts;
                callbackContrastId = this.props.callbackContrastId;
            }
        }
            
        return (
            <div id='selector'>
                <p>This is the selector</p>
                {selectionMessage}
                {!this.props.params.activeLanguageId ? 
                    languagesToBeMapped.map(function(c) {
                        return <div className='chooseLanguage' key={c.id} onClick={()=>callbackLangId(c.id)}>{c.name}</div>
                    }) : contrastsToBeMapped.map(function(c) {
                        return <div className='chooseContrast' key={c.id} onClick={()=>callbackContrastId(c.id)}>{c.name}</div>
                    })
                }
            </div>
        );
    }
});


// These are props to decide how the selector will render
Selector.propTypes = {
    loading: React.PropTypes.bool, // how do we use this?
    languages: React.PropTypes.array,
    contrasts: React.PropTypes.array,
    //activeLanguageId: React.PropTypes.number
    // (above handled elsewhere)
};

export default createContainer(({params}) => {
    const { activeLanguageId } = params; // we're so ES6! Bring on the future
    // the above means
    // const activeLanguageId = params.activeLanguageId;
    const languagesHandle = Meteor.subscribe('langdata');
    const contrastHandle = Meteor.subscribe('contrastdata');
    const loading = !languagesHandle.ready() && !contrastHandle.ready();
    const languages = Languages.fetch();
    const contrasts = Contrasts.where({
        language: activeLanguageId
    }).fetch(); // alternative syntax is }).select("*");
    
    return {
        //activeLanguageId,
        loading,
        languages,
        contrasts
    };
}, Selector);