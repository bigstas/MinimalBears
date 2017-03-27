import React from 'react'
import Translate from 'react-translate-component'
    
const NotFound = React.createClass({
    render() {
        return(
            <div className='panel'>
                <Translate content="notfound.title" component="h2" />
                <Translate content="notfound.text" component="p" />
            </div>
        )
    }
})

export default NotFound