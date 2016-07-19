import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// route components
import AppBody from '../client/app';
import Home from '../client/static/home';
import AuthJoinPage from '../client/auth/joinpage';
import AuthSignInPage from '../client/auth/loginpage';
import RecordPage from '../client/record';
import TrainPage from '../client/training/train'; // takes place of arena
//import ArenaContainer from '../client/arena';
import ProfileContainer from '../client/profile';
import About from '../client/static/about';
import NotFound from '../client/static/notfound';
import Dummy from '../client/dummy';


export const renderRoutes = () => (
    <Router history={browserHistory} >
        <Route path="/" component={AppBody} >
            <IndexRoute component={Home} />
            <Route path="train" component={TrainPage} />
            <Route path="about" component={About} />
            <Route path="record" component={RecordPage} />
            <Route path="register" component={AuthJoinPage} />
            <Route path="login" component={AuthSignInPage} />
            <Route path="profile" component={ProfileContainer} />
            <Route path="dummy" component={Dummy} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);