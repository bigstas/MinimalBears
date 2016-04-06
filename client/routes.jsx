import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// route components
import AppBody from '../client/app';
import Home from '../client/home';
import TrainPage from '../client/train'; // takes place of arena
//import ArenaContainer from '../client/arena';
import ProfileContainer from '../client/profile';
import About from '../client/about';
import NotFound from '../client/notfound';


export const renderRoutes = () => (
    <Router history={browserHistory} >
        <Route path="/" component={AppBody} >
            <IndexRoute component={Home} />
            <Route path="train" component={TrainPage} />
            <Route path="about" component={About} />
            <Route path="profile" component={ProfileContainer} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);