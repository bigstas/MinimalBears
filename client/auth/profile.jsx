import React from 'react'
import { Link } from 'react-router-dom'
import Translate from 'react-translate-component'
import { graphql } from 'react-apollo'
import { FacebookButton, FacebookCount, TwitterButton, TwitterCount } from "react-social"

import Charts from './charts'
import ContrastDropdown from './contrastdropdown'
import { practiceLanguageQuery } from '/lib/graphql'

function TopBand(props) {
    /* The title strip at the top of the page, with no graphs in it.
     * This is a static element (no methods).
     */
    return (
        <div id='topProfile'>
            <h2 id='name' className="animated bounce">Welcome {props.username}!</h2>
            <div className='userpic' id='userpicProfile'>
                </div>
            <div id='overview'>
                {/* TODO: "kudos" etc. shuold be populated from database */}
                <p><Translate content="home.profile.recordingsSubmitted" />19 <br/><Translate content="home.profile.recordingsAccepted" />12 <br/><Translate content="home.profile.recordingsPending" />4 <br/><Translate content="home.profile.totalKudos" />43</p> <br/>
            </div> 
        </div> 
    )
}


class UserProfile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            language: 'eng',
            contrast: 'all',
            period: 'week',
            themeIndex: 0
		}
	}
    
    handlePeriodChange(event) {
        const period = event.target.value
        this.setState({ period: period })
    }
    
    setLanguage(event) {
        const language = event.target.value
        if (language !== this.state.language) {
            this.setState({ 
                language: language,
                contrast: 'all'
            })
        }
    }
    
    setContrast(event) {
        const contrast = event.target.value
        this.setState({ contrast: contrast})
    }
    
    toggleTheme(event) {
        // only for development purposes...
        if (this.state.themeIndex === 0) {
            this.setState({ themeIndex: 1 })
        } else {
            this.setState({ themeIndex: 0 })
        }
    }
    
    render() {
        // for social media buttons
        const url = "http://www.minimalbears.com/"
        // loading default language list
        let languageOptions = ["Please wait..."]
        if (!this.props.practiceLanguages.loading) {
            languageOptions = this.props.practiceLanguages.getPracticeLanguages.nodes
            console.log(languageOptions)
        }
        
        return (
            <div className='panel animated fadeIn' id='profile'>
            {/* TOP REGION */}
                <TopBand username={this.props.username} /> <br/>
                <div id='graphsDiv'>
            {/* DROPDOWNS */}
                    <select id='dropDownC' onChange={this.setLanguage}>
                        {languageOptions.map(function(c, index) {
                            const content = 'train.language.' + c
                            return <Translate component='option' content={content} key={index} value={c} />
                        })}
                    </select>
                    <ContrastDropdown  language={this.state.language} callback={this.setContrast} ref="contrastDropdown" value={this.state.contrast} />
                    <br/>
            {/* RADIO BUTTONS */}
                    <label className='chartTitle'>
                        <input type="radio" value="week" checked={this.state.period === 'week'} onChange={this.handlePeriodChange} /><Translate content="home.profile.weekView" />
                    </label>
                    <label className='chartTitle'>
                        <input type="radio" value="month" checked={this.state.period === 'month'} onChange={this.handlePeriodChange} /><Translate content="home.profile.monthView" />
                    </label>
                    <label className='chartTitle'>
                        <input type="radio" value="year" checked={this.state.period === 'year'} onChange={this.handlePeriodChange} /><Translate content="home.profile.yearView" />
                    </label>
                    <br/>
                   { /* <input
                        id="toggleTheme"
                        type="checkbox"
                        onChange={this.toggleTheme}
                        style={{width: "15px", verticalAlign: "middle"}}
                    />
                   <label
                        htmlFor="toggleTheme"
                        style={{verticalAlign: "middle", fontSize: "10px"}}>
                        Change theme! (This checkbox is for development purposes only)
                    </label> */ }
            {/* CHARTS */}
                    <Charts language={this.state.language} contrast={this.state.contrast} period={this.state.period} themeIndex={this.state.themeIndex} />
                </div>
            </div>
        )
    }
}

const practiceLanguageQueryConfig = {
    name: 'practiceLanguages',
    options: (ownProps) => ({
        variables: {
            unit: 'day',
            number: 364
        }
    })
}

export default graphql(practiceLanguageQuery, practiceLanguageQueryConfig)(UserProfile)