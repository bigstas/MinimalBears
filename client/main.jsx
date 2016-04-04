// Meteor startup script. Runs reactRoutes, and puts the result in the 'content' div in index.html.

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../client/routes';

Meteor.startup(() => {
    render(renderRoutes(), document.getElementById('content'));
});