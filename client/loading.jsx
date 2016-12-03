import React from 'react'
    
LoadingPage = React.createClass({                       
    render() {
        return(
            <div className='panel' id='loading'>
                <p style={{textAlign: 'center'}}>&nbsp;&nbsp;Loading...</p>
                <img className='centred' id='loadingWheel' src='loading.png' />
            </div>
        )
    }
})

export default LoadingPage