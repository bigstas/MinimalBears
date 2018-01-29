import React from 'react'
import Translate from 'react-translate-component'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const ContrastDropdown = React.createClass({
    render() {
        console.log(this.props.contrasts)
        if (this.props.contrasts.loading) {
            return (
                <select>
                    <Translate component="option" value="all" content="home.profile.allContrasts" />
                </select>
            )
        } else {
            return (
                <select onChange={this.props.callback} value={this.props.value}>
                    <Translate component="option" value="all" content="home.profile.allContrasts" />
                    {this.props.contrasts.getAllStats.nodes.map(function(c,index) {
                        return <option key={index} value={c.contrast}>{c.contrast}</option>
                    })}
                </select>
            )
        }
    }
})

const contrastQuery = gql`query ($languageId: String, $unit: String, $number: Int) {
  getAllStats(languageId: $languageId, unit: $unit, number: $number) {
    nodes {
      contrast
    }
  }
}`
const contrastQueryConfig = { 
    name: 'contrasts',
    options: (ownProps) => ({
        variables: {
            languageId: ownProps.language,
            unit:   "year",
            number: 1
        }
    })
}

export default graphql(contrastQuery ,contrastQueryConfig)(ContrastDropdown)