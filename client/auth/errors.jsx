import React from 'react';

// The component which tells you what errors have cropped up
const AuthErrors = React.createClass({
    render() {
        // it only renders if there are errors
        // what it renders is a sequence of one or more divs which contain error messages (no. divs === no. errors) using .map
        if (this.props.errors) {
            return (
                <div className="list-errors">
                {
                    _.values(this.props.errors).map(function (errorMessage) {
                        return <div key={errorMessage} className="list-item">
                            {errorMessage}
                        </div>;
                    })
                }
                </div>
            );
        } else {
        // don't render anything
            return <span />
        }
    }
});