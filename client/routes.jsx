import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

// route components
import AppBody from './app'
import Home from './static/home'
import AuthJoinPage from './auth/joinpage'
import AuthSignInPage from './auth/loginpage'
import RecordPage from './record'
import TrainPage from './training/train' // takes place of arena
//import ProfileContainer from './profile'
import Profile from './profile'
import About from './static/about'
import ModerationPage from './moderation'
import NotFound from './static/notfound'
// For development / debugging purposes only - not for deployment!
// This allows for easy viewing of the loading screen during development.
//import LoadingPage from './loading'
//import Dummy from './dummy'


export const renderRoutes = () => (
    <Router history={browserHistory} >
        <Route path="/" component={AppBody} >
            <IndexRoute component={Home} />
            <Route path="train" component={TrainPage} />
            <Route path="about" component={About} />
            <Route path="record" component={RecordPage} />
            <Route path="register" component={AuthJoinPage} />
            <Route path="login" component={AuthSignInPage} />
            <Route path="profile" component={Profile} />
            <Route path="moderation" component={ModerationPage} />
            {/*<Route path="dummy" component={Dummy} />
            <Route path="loading" component={LoadingPage} />  -- for development / debugging purposes only */}
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
)