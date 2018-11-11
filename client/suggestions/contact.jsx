import React from 'react'
import Translate from 'react-translate-component'

function NullElement(props) {
    // for obfuscating the email address from crawlers
    return <span style={{display: "none"}}>null</span>
}

function Contact(props) {
    return (
        <div className='panel animated fadeIn' id='contact'>
            <Translate component="h1" content="contact.heading" />
            <Translate component="p" content="contact.text" />
            <p><Translate content="contact.programming" /><br/>g.e.t.emerson<NullElement />@googlemail.com, spstrokonski<NullElement />@gmail.com</p>
            <p><Translate content="contact.artwork" /><br/>gergo.halasz<NullElement />@gmail.com</p>
        </div>
    )
}

export default Contact