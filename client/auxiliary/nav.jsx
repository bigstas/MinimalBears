// Navigation bar
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import counterpart from 'counterpart'
import Translate from 'react-translate-component'    
    
function BetaSign(props) {
    const styles = {
        color: 'white',
        fontSize: '8px',
        textAlign: 'center',
        backgroundColor: 'black',
        position: 'relative',
        bottom: '10px'
    }
    return (
        <div style={styles}>BETA</div>
    )
}

class Dropdown extends React.Component {
    /**
     * Dropdown in Nav bar. For changing language, login/logout/register.
     * @prop isLoggedIn -- whether the user is logged in or not
     * @prop callbackLogOut -- the logging-out function
     * @prop className
     * @prop onMouseDown
     * @prop onMouseUp
     */
    handleClick (newLocale) {
        // Sets locale for <Translate> components.
        counterpart.setLocale(newLocale)
    }
    
    logOut() {
        this.props.callbackLogOut()
        //alert("You are logging out :)")
    }
    
    render() {
        let authElement, registerElement, contactUs
        if (this.props.isLoggedIn) {
            authElement = <div id="dropdown-logout" className='dropdownElement' onClick={this.logOut.bind(this)}><Translate content="nav.logout" /></div>
            registerElement = <span /> // "empty" element
            contactUs = <div className='dropdownElement'><Link className='plainLink' to="/contact"><Translate content="nav.contactUs" /></Link></div>
        } else {
            authElement =     <div id="dropdown-login" className='dropdownElement'><Link className='plainLink' to="/login"><Translate content="nav.login" /></Link></div>
            registerElement = <div id="dropdown-register" className='dropdownElement'><Link className='plainLink' to="/register"><Translate content="nav.register" /></Link></div>
            contactUs = <span />
        }
            
        let moderationElement
        if (this.props.isLoggedIn && true) { // TODO - should read: if this person has the authority / rights to be a moderator AND if this person is logged in
            moderationElement = <div className='dropdownElement'><Link className='plainLink' to="/edit"><Translate content="nav.moderation" /></Link></div>
        } else {
            moderationElement = <span /> // "empty" element
        }
        
        return (
            <div className={this.props.className} onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp}>
                {authElement}
                {registerElement}
                {moderationElement}
                {contactUs}
                <hr />
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'eng')}>English</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'fra')}>Français</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'esp')}>Español</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'deu')}>Deutsch</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'pol')}>Polski</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'hun')}>Magyar</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'lit')}>Lietuvių</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'bah')}>Bahasa</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'rus')}>Русский</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'chm')}>中文</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'jap')}>日本語</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'far')}>فارسی</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'ara')}>العربی</div>
                <div className='dropdownElement languageSwitch' onClick={this.handleClick.bind(this,'geo')}>ქართული</div>
            </div>
        )
    }
}

class Nav extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            dropdown: false,  // Whether the dropdown is displayed: true, false, or 'destroy'
            mouseIsDownOnDropdown: false  // Whether the dropdown is being clicked on
        }
    }
    
    toggleDropdown() {
        if (this.state.dropdown === true) {
            this.destroyDropdown()
        } else if (this.state.dropdown === false) {
            this.setState({ dropdown: true })
        }
    }
    destroyDropdown() {
        if (this.state.dropdown === true) {
            this.setState({ dropdown: 'destroy' })
            setTimeout(()=>{ // give it time to animate
                this.setState({ dropdown: false, mouseIsDownOnDropdown: false })
            }, 400)
        }
    }
    
    componentDidMount() {
        window.addEventListener('mousedown', this.pageClick.bind(this), false)
    }
    
    componentWillUnmount() {
        window.removeEventListener('mousedown', this.pageClick.bind(this))
    }
    
    pageClick(e) {
        if (this.state.mouseIsDownOnDropdown) { return } 
        else { this.destroyDropdown() }
    }
    
    mouseDownHandler(nextFunction) {
        this.setState({ mouseIsDownOnDropdown: true })
        nextFunction()
    }
    mouseUpHandler() {
        this.setState({ mouseIsDownOnDropdown: false })
    }
    
    render() { 
        return (
            <div className="container">
                <nav>
                    <ul>
                        <li style={{maxHeight:'40px'}}><NavLink to="/" activeClassName="activeNavbarElement" style={{padding: "0", backgroundColor: "#DE8312"}}><img src="favicon.ico" style={{height: "40px"}} /><BetaSign /></NavLink></li>
                        <li><NavLink to="/about" activeClassName="activeNavbarElement"><Translate content="nav.about" /></NavLink></li>
                        <li><NavLink to="/train" activeClassName="activeNavbarElement"><Translate content="nav.train" /></NavLink></li>
                        <li><NavLink to="/record" activeClassName="activeNavbarElement"><Translate content="nav.record" /></NavLink></li>
                        <li id="cogs" style={{float: 'right', cursor: 'pointer'}} 
                            onMouseDown={this.mouseDownHandler.bind(this,this.toggleDropdown.bind(this))} 
                            onMouseUp={this.mouseUpHandler.bind(this)}>
                                <img src="cogwheels.png" style={{height: '40px'}} />
                        </li>
                        <li id="username" style={{float: 'right'}}><p>{this.props.isLoggedIn ? this.props.username : <Translate content="nav.guest" />}</p></li>
                    </ul>
                </nav>
                {!this.state.dropdown ? <span /> :
                this.state.dropdown === 'destroy' ?
                    <Dropdown
                        className={'dropdownDiv animated zoomOut'}
                        onMouseDown={()=>{}} onMouseUp={()=>{}} callbackLogOut={()=>{}}
                        username={this.props.username}
                    /> :
                    <Dropdown
                        className={'dropdownDiv minbears-boing'}
                        onMouseDown={this.mouseDownHandler.bind(this,()=>{})}
                        onMouseUp={this.mouseUpHandler.bind(this)}
                        callbackLogOut={this.props.callbackLogOut}
                        username={this.props.username}
                    />
                }
            </div>
        )
    }
}

export { Nav, Dropdown }