import React from 'react';

const AuthFormInput = React.createClass({
    /*
     * PropTypes validation functions are deprecated, but this may be a useful list of props, as I don't see it elsewhere.
    propTypes: {
        hasError: React.PropTypes.bool,
        label: React.PropTypes.string,
        iconClass: React.PropTypes.string,
        type: React.PropTypes.string,
        name: React.PropTypes.string
    },
    */
    render() {
        let className = "input-symbol";
        if (this.props.hasError) {
            className += " error";
        }

        return (
            <div className={ className } >
                <input
                    type={ this.props.type }
                    name={ this.props.name }
                    placeholder={ this.props.label } />

                <span
                    className={ this.props.iconClass }
                    title={ this.props.label } />
            </div>
        );
    }
});