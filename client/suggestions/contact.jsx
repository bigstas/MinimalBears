import React from 'react'
import { Link } from 'react-router'
import Translate from 'react-translate-component'

const Contact = React.createClass({
    submit() {
        alert("Something should happen!")
    },
    
    render() {
        return (
            <div className='panel animated fadeIn' id='contact'>
                <h1>Contact Us</h1>
                <p>Let us know if you have any issues, comments, or suggestions. Remember:</p>
                <ul>
                    <li>If you have any word pairs you would like to suggest for existing contrasts, or any contrasts you would like to suggest for existing languages, this can be done on the <Link to='/suggest'>Suggest Words</Link> page.</li>
                    <li>We are working on expanding into more languages all the time, with a focus on major world languages. Only suggest a new language to us if (a) it is relatively rare or niche, and (b) you are personally able to help with contrasts, word pair examples, and/or recordings for it.</li>
                </ul>
                <p>Thanks for getting in touch!</p>
                <textarea style={{width: "100%"}} name="text" cols="40" rows="8" placeholder="Hi guys!" />
                <div className="authbtn" onClick={this.submit}>Submit</div>
            </div>
        )
    }
})

export default Contact