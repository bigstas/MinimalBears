import React from 'react'
import Translate from 'react-translate-component'

const Contact = React.createClass({
    submit() {
        alert("Something should happen!")
    },
    
    render() {
        return (
            <div className='panel animated fadeIn' id='contact'>
                <h1>Contact Us</h1>
                <p>Let us know if you have any issues, comments, or suggestions.</p>
                <textarea style={{width: "100%"}} name="text" cols="40" rows="8" placeholder="Hi guys!" />
                <div className="authbtn" onClick={this.submit}>Submit</div>
            </div>
        )
    }
})

export default Contact