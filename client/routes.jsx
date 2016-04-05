import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// route components
import AppContainer from '../client/app';
import HomeContainer from '../client/home';
import ArenaContainer from '../client/arena';
import ProfileContainer from '../client/profile';
import About from '../client/about';
import NotFound from '../client/notfound';


export const renderRoutes = () => (
    <Router history={browserHistory} >
        <Route path="/" component={AppContainer} >
            <IndexRoute component={HomeContainer} />
            <Route path="train" component={ArenaContainer} />
            <Route path="about" component={About} />
            <Route path="profile" component={ProfileContainer} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);