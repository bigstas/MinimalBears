//'Gate' page with sign-up and login
var React = require('react');
var Parse = require('parse');
var ParseCCMixin = require('react-cloud-code-mixin');

var Login = React.createClass({
    handleLogin: function() {
        var username = document.getElementById("oldUsername").value;
        var password = document.getElementById("oldPassword").value;
        
        Parse.User.logIn(username, password, {
            success: function(user) {
            // Do stuff after successful login.
            console.log("Successfully logged in with username " + username);
            console.log(Parse.User.current());
            },
            error: function(user, error) {
            // The login failed. Check error to see why.
            console.log("Failed to log in because of error: " + error.code + " " + error.message);
            }
        });
    },
    
    handleLogout: function() {
        Parse.User.logOut();
        console.log(Parse.User.current());
    },
    
    render: function() {
        return (
            <div id='login'>
                <h2>Log In</h2>
                Username <br/>
                <input id="oldUsername" type="text" name="whatever" /><br/>
                Password <br/>
                <input id="oldPassword" type="text" name="whatever" /><br/>
                <button type="button" onClick={this.handleLogin}>Log in!</button>
                <button type="button" onClick={this.handleLogout}>Log out</button>
            </div>
        );
    }
});


var Signup = React.createClass({
    handleSignUp: function() {
        if (!document.getElementById("Ts&Cs").checked) {
            alert("Please confirm that you have read and agreed with the Terms and Conditions by checking the box.");
            return;
        }
        var newUsername = document.getElementById("newUsername").value;
        var newPassword = document.getElementById("newPassword").value;
        if ((newUsername === "") || (newPassword === "")) {
            alert ("Please choose both a username and a password.");
            return;
        }
        var email = document.getElementById("email").value;
        var confirm = document.getElementById("confirmEmail").value;
        // this email testing could get a lot more elaborate (check for @ sign, let them know if there's an error & what type...)
        // there are also some Parse in-built email confirmation tools which we can use
        // (Parse autochecks for duplicates, so we don't need to do this)
        var emailSupplied = true;
        if ((email !== confirm) || (email === "") || (confirm === "")) {
            emailSupplied = false;
        }
        // Also need to check database to make sure we have no duplicate usernames
        
        var user = new Parse.User();
        user.set("username", newUsername);
        user.set("password", newPassword);
        if (emailSupplied) { user.set("email", email); }
        
        user.signUp(null, {
            success: function(user) {
                console.log("New user signed up with username " + newUsername + " and password " + newPassword + ". Email supplied: " + emailSupplied);
            },
            error: function(user, error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    },
    
    render: function() {
        return (
            <div id='signup'>
                <h2>...or Sign Up</h2>
                Username <br/>
                <input id="newUsername" type="text" name="whatever" /><br/>
                Password <br/>
                <input id="newPassword" type="text" name="whatever" /><br/>
                Email <br/>
                <input id="email" type="text" name="whatever" /><br/>
                Confirm email <br/>
                <input id="confirmEmail" type="text" name="whatever" /><br/>
                <input id="Ts&Cs" type="checkbox" name="whatever" />I will give you all my money<br />
                <button type="button" onClick={this.handleSignUp}>Sign Up!</button>
            </div>
        );
    }
});

var Gate = React.createClass({
    render: function() {
        return (
            <div id='gate'>
                <Login />
                <Signup />
            </div>
        );
    }
});

module.exports = Gate;