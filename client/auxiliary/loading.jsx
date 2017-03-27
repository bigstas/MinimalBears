import React from 'react'
import Translate from 'react-translate-component'  
    
const LoadingPage = React.createClass({                       
    render() {
        return(
            <div className='panel' id='loading'>
                <p style={{textAlign: 'center'}}>&nbsp;&nbsp;<Translate content="loading.loading" /></p>
                <img className='centred' id='loadingWheel' src='loading.png' />
            </div>
        )
    }
})

export default LoadingPage