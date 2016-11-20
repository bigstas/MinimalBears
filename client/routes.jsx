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
import NotFound from './static/notfound'
import Dummy from './dummy'


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
            <Route path="dummy" component={Dummy} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
)