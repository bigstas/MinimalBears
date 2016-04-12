import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// route components
import AppBody from '../client/app';
import Home from '../client/home';
//import RegisterPage from '../client/register';
//import LoginPage from '../client/login';
import AuthJoinPage from '../client/auth/joinpage';
import AuthSignInPage from '../client/auth/loginpage';
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
            <Route path="register" component={AuthJoinPage} />
        {/*    <Route path="register" component={RegisterPage} /> */}
            <Route path="login" component={AuthSignInPage} />
        {/*    <Route path="login" component={LoginPage} /> */}
            <Route path="profile" component={ProfileContainer} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);