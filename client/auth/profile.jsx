import React from 'react'
import { Link } from 'react-router'
import Translate from 'react-translate-component'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Charts from './charts'
import ContrastDropdown from './contrastdropdown'
import { FacebookButton, FacebookCount, TwitterButton, TwitterCount } from "react-social"


const TopBand = React.createClass({
    /* The title strip at the top of the page, with no graphs in it.
     * This is a static element (no methods).
     */
    render() {
        return (
            <div id='topband'>
                <div className='userpic' id='userpicProfile'>
                    <p style={{color: '#cccccc'}}>Some <br/> picture <br/> here...?</p>
                </div>
                <div id='overview'>
                    <h2 className="animated bounce">{this.props.username}</h2>
                    {/* TODO: "kudos" etc. shuold be populated from database */}
                    <p>Recordings submitted: 19 <br/>Recordings accepted: 12 <br/>Total kudos: 43</p>
                </div>
            </div>
        )
    }
})


const UserProfile = React.createClass({
    getInitialState() {
        return {
            language: 'eng',
            contrast: 'all',
            period: 'week'
        }
    },
    
    handlePeriodChange(event) {
        const period = event.target.value
        this.setState({ period: period })
    },
    
    setLanguage(event) {
        const language = event.target.value
        if (language !== this.state.language) {
            this.setState({ 
                language: language,
                contrast: 'all'
            })
        }
    },
    
    setContrast(event) {
        const contrast = event.target.value
        this.setState({ contrast: contrast})
    },
    
    render() {
        // for social media buttons
        const url = "http://www.minimalbears.com/"
        // loading default language list
        let languageOptions = ["Please wait..."]
        if (!this.props.practiceLanguages.loading) {
            languageOptions = this.props.practiceLanguages.getPracticeLanguages.nodes
        }
        
        return (
            <div className='panel animated fadeIn' id='profile'>
            {/* TOP REGION */}
                <TopBand username={this.props.username} />
                <div id='graphsDiv'>
            {/* DROPDOWNS */}
                    <select onChange={this.setLanguage}>
                        {languageOptions.map(function(c, index) {
                            const content = 'train.language.' + c
                            return <Translate component='option' content={content} key={index} value={c} />
                        })}
                    </select>
                    <ContrastDropdown language={this.state.language} callback={this.setContrast} ref="contrastDropdown" value={this.state.contrast} />
            {/* RADIO BUTTONS */}
                    <label>
                        <input type="radio" value="week" checked={this.state.period === 'week'} onChange={this.handlePeriodChange} />Week view
                    </label>
                    <label>
                        <input type="radio" value="month" checked={this.state.period === 'month'} onChange={this.handlePeriodChange} />Month view
                    </label>
                    <label>
                        <input type="radio" value="year" checked={this.state.period === 'year'} onChange={this.handlePeriodChange} />Year view
                    </label>
            {/* CHARTS */}
                    <Charts language={this.state.language} contrast={this.state.contrast} period={this.state.period} />
                </div>
                <TwitterButton className="button" id="twitterButton" element="div" url={url}>
                        {" Share us on Twitter"}
                </TwitterButton>
            </div>
        )
    }
})

const practiceLanguagesQuery = gql`query ($unit: String, $number: Int) {
  getPracticeLanguages(unit: $unit, number: $number) {
    nodes
  }
}`
const practiceLanguagesQueryConfig = {
    name: 'practiceLanguages',
    options: (ownProps) => ({
        variables: {
            unit: 'day',
            number: 100
        }
    })
}

export default graphql(practiceLanguagesQuery ,practiceLanguagesQueryConfig)(UserProfile)