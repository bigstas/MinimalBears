import React from 'react'
import Translate from 'react-translate-component'
import { graphql } from 'react-apollo'

import { statsQuery } from '/lib/graphql'

function ContrastDropdown(props) {
    console.log(props.contrasts)
    if (props.contrasts.loading) {
        return (
            <select>
                <Translate component="option" value="all" content="home.profile.allContrasts" />
            </select>
        )
    } else {
        return (
            <select onChange={props.callback} value={props.value}>
                <Translate component="option" value="all" content="home.profile.allContrasts" />
                {props.contrasts.getAllStats.nodes.map(function(c,index) {
                    return <option key={index} value={c.contrast}>{c.contrast}</option>
                })}
            </select>
        )
    }
}

const statsQueryConfig = { 
    name: 'contrasts',
    options: (ownProps) => ({
        variables: {
            languageId: ownProps.language,
            unit: "year",
            number: 1
        }
    })
}

export default graphql(statsQuery, statsQueryConfig)(ContrastDropdown)