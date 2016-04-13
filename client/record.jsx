import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import INTERPRETED from '../client/static/translations';

RecordPage = React.createClass({    
    render() {
        return (
            <div id='record'>
                <p>This is the record page</p>
            </div>
        )
    }
});

export default RecordPage;