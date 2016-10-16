import { Navigation, Link } from 'react-router';
import React from 'react';

AuthJoinPage = React.createClass({
    //mixins: [Navigation],     // is this still a thing in Meteor 1.3? See comment on loginpage
    getInitialState() {
        return {
            errors: {}
        };
    },
    onSubmit(event) {
        event.preventDefault();

        // email, password, and password confirmation are all supplied by the user
        const email = event.target.email.value;
        const password = event.target.password.value;
        const confirm = event.target.confirm.value;

        // error if there's no email or password entered, or if the confirmation password does not match the first password
        const errors = {};
        if (! email) { errors.email = 'Email required'; }
        if (! password) { errors.password = 'Password required'; }
        if (confirm !== password) { errors.confirm = 'Please confirm your password'; }

        this.setState({
            errors: errors
        });
        
        // Don't continue if there are errors (shouldn't this be this.state.errors?)
        if (! _.isEmpty(errors)) { return; }

        // If there haven't been any errors, we can create the user
        Accounts.createUser({
            email: email,
            password: password
        }, (error) => {
        // above - ES6 syntax for function(error) { ... }
            if (error) {
                this.setState({
                    // I don't understand what this "errors.none" thing is supposed to be
                    errors: { 'none': error.reason }
                });
                // if there's an error at this stage, return so that we don't transitionTo('root')
                return;
            }

            this.transitionTo('root');
        });
    },
    
    render() {
        return (
            <div className="page-auth">
        {/* <nav>
          <MenuOpenToggle />
        </nav> */}

                <div className="content-scrollable">
                    <div className="wrapper-auth">
                        <h1 className="title-auth">Join.</h1>
                        <p className="subtitle-auth">
                            Joining allows you to keep track of your progress, and receive suggestions for what you should practise next.
                        </p>

                        <form onSubmit={ this.onSubmit }>
                            <AuthErrors errors={this.state.errors} />

                            <AuthFormInput
                                hasError={!!this.state.errors.email}
                                type="email"
                                name="email"
                                label="Your Email"
                                iconClass="icon-email" />

                            <AuthFormInput
                                hasError={!!this.state.errors.password}
                                type="password"
                                name="password"
                                label="Password"
                                iconClass="icon-lock" />

                            <AuthFormInput
                                hasError={!!this.state.errors.confirm}
                                type="password"
                                name="confirm"
                                label="Confirm Password"
                                iconClass="icon-lock" />

                            <button type="submit" className="btn-primary">
                                Join Now
                            </button>
                        </form>
                    </div>

                    <Link to="login" className="link-auth-alt">
                        Have an account? Sign in.
                    </Link>
                </div>
            </div>
        );
    }
});

export default AuthJoinPage;