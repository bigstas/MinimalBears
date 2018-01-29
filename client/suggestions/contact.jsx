import React from 'react'
import Translate from 'react-translate-component'

const NullElement = React.createClass({
    // for obfuscating the email address from crawlers
    render() { return <span style={{display: "none"}}>null</span> }
})

const Contact = React.createClass({
    render() {
        return (
            <div className='panel animated fadeIn' id='contact'>
                <Translate component="h1" content="contact.heading" />
                <Translate component="p" content="contact.text" />
                <p><Translate content="contact.programming" /><br/>g.e.t.emerson<NullElement />@googlemail.com, spstrokonski<NullElement />@gmail.com</p>
                <p><Translate content="contact.artwork" /><br/>gergo.halasz<NullElement />@gmail.com</p>
                {/* TODO: For full release, it might be nice to have some address like contact@minimalbears.com...? */}
            </div>
        )
    }
})

export default Contact