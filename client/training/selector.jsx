import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';


// new gql way of getting data...
import { connect } from 'react-apollo';
import gql from 'graphql-tag';

function mapQueriesToProps({ ownProps, state }) {
    var aNumber = 1;
    var bNumber = 1;
    
    return {
        data: {
            query: gql`{languageNodes {
                nodes {
                    name
                }
            }}`
        },
        info: {
            query: gql`{itemByRowId (rowId: 1) {
                homophones
            }}`
        }
    }
};
//...end


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
                {selectionMessage}
                {!this.props.params.activeLanguageId ? 
                    languagesToBeMapped.map(function(c) {
                        return <div className='chooseLanguage' key={c.id} onClick={()=>callbackLangId(c.id)}>{c.name}</div>
                    }) : contrastsToBeMapped.map(function(c) {
                        return <div className='chooseContrast' key={c.id} onClick={()=>callbackContrastId(c.id)}>{c.name}</div>
                    })
                }
                {!!this.props.params.activeLanguageId ? 
                    <div className='chooseLanguage' id='changeLanguage' onClick={()=>this.props.callbackLangId(0)}>Change language</div> :
                    <div></div> 
                }
                {/* empty div is equivalent to nothing at all - I want to have an "if" statement but must use ternary because we're inside render's return method */}
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
    /*
    const languagesHandle = Meteor.subscribe('langdata');
    const contrastHandle = Meteor.subscribe('contrastdata');
    const loading = !languagesHandle.ready() && !contrastHandle.ready();
    const languages = Languages.fetch();
    const contrasts = Contrasts.where({
        language: activeLanguageId
    }).fetch(); // alternative syntax is }).select("*");
    */
    loading = false;
    languages = [{id: 1, name: 'English'}];
    contrasts = [{id: 1, name: 'ee/i'}];
    
    return {
        //activeLanguageId,
        loading,
        languages,
        contrasts
    };
}, Selector);