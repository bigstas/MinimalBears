import { Navigation, Link } from 'react-router';
import React from 'react';
import MenuOpenToggle from './menuopentoggle';

AuthSignInPage = React.createClass({
    // This mixin is needed to get react-router's transitionTo function to work (see below).
    // However, ES6 does not support mixins, so this should be handled differently.
    //mixins: [Navigation],
    
    
    getInitialState() {
        return {
            errors: {}
        };
    },
    
    onSubmit(event) {
        event.preventDefault();

        // email and password are whatever the user said they were
        const email = event.target.email.value;
        const password = event.target.password.value;

        // Define errors. If no email or password have been entered, these are errors.
        const errors = {};
        if (! email) { errors.email = 'Email required'; }
        if (! password) { errors.password = 'Password required'; }

        this.setState({ errors: errors });

        // do not attempt to log in if an email || password have not been provided
        if (! _.isEmpty(errors)) { return; }

        Meteor.loginWithPassword(email, password, (error) => {
            // if there is an error passed to this function ... then set errors.none to error.reason, and return ... wtf? What's "errors.none"?
            if (error) {
                this.setState({
                    errors: { 'none': error.reason }
                });
                
            return;
            }
            // This is a react-router method, which uses the Navigation mixin.
            // It's telling the site to move to the 'root' page, I think.
            this.transitionTo('root');
        });
    },
  
    render() {
        return (
            <div className="page-auth">
        {/* This (below) is the way that react-todos was handling the Nav bar, we don't need it as we're doing it our own way */}
                {/* <nav>
        <MenuOpenToggle />
      </nav> */}

                <div className="content-scrollable">
                    <div className="wrapper-auth">
                        <h1 className="title-auth">Sign In.</h1>
                        <p className="subtitle-auth" >
                            Signing in allows you to view and save your progress.
                        </p>

                        <form onSubmit={ this.onSubmit }>
                            {/* First, it shows what errors there are, if any. Funny choice to put this inside of <form></form>. */}
                            <AuthErrors errors={this.state.errors} />

                            <AuthFormInput
                                hasError={!! this.state.errors.email}
                                type="email"
                                name="email"
                                label="Your Email"
                                iconClass="icon-email" />

                            <AuthFormInput 
                                hasError={!! this.state.errors.password}
                                type="password"
                                name="password"
                                label="Password"
                                iconClass="icon-lock" />

                            <button type="submit" className="btn-primary">
                                Sign in
                            </button>
                        </form>
                    </div>
                    <Link to="register" className="link-auth-alt">
                        Need an account? Join Now.
                    </Link>
                </div>
            </div>
        )
    }
});
          
export default AuthSignInPage;