import React from 'react'
import Translate from 'react-translate-component'
    
function NotFound(props) {
    return(
        <div className='panel'>
            <Translate content="notfound.title" component="h2" />
            <Translate content="notfound.text" component="p" />
        </div>
    )
}

export default NotFound