import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
// not sure if we need IndexRoute

// route components
import ArenaContainer from '../client/arena';
import AboutContainer from '../client/about';
import AppContainer from '../client/app';
import Home from '../client/home';

export const renderRoutes = () => (
    <Router history={browserHistory} >
        <Route path="/" component={AppContainer} >
    {/* <IndexRoute component={ArenaContainer} /> */}
            <Route path="train" component={ArenaContainer} />
            <Route path="about" component={AboutContainer} />
        </Route>
    </Router>
);