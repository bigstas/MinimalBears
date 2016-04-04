import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// route components
import HomeContainer from '../client/home';
import ArenaContainer from '../client/arena';
import AboutContainer from '../client/about';
import ProfileContainer from '../client/profile';
import AppContainer from '../client/app';

export const renderRoutes = () => (
    <Router history={browserHistory} >
        <Route path="/" component={AppContainer} >
            <IndexRoute component={HomeContainer} />
            <Route path="train" component={ArenaContainer} />
            <Route path="about" component={AboutContainer} />
            <Route path="profile" component={ProfileContainer} />
        </Route>
    </Router>
);