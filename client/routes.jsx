import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

// route components
import AppBody from './app'
import Home from './static/home'
import { JoinPageWithData } from './auth/joinpage'
import AuthSignInPage from './auth/loginpage'
import { RecordPageWithData } from './audio/record'
import TrainPage from './training/train' // takes place of arena
import About from './static/about'
import Contact from './suggestions/contact'
import EditingPage from './audio/edit'
import NotFound from './static/notfound'
// For development / debugging purposes only - not for deployment!
// This allows for easy viewing of the loading screen during development.
//import LoadingPage from './auxiliary/loading'
//import Dummy from './auxiliary/dummy'


const renderRoutes = () => (
    <Router history={browserHistory} >
        <Route path="/" component={AppBody} >
            <IndexRoute component={Home} />
            <Route path="train" component={TrainPage} />
            <Route path="about" component={About} />
            <Route path="record" component={RecordPageWithData} />
            <Route path="register" component={JoinPageWithData} />
            <Route path="login" component={AuthSignInPage} />
            <Route path="edit" component={EditingPage} />
            <Route path="contact" component={Contact} />
            {/*<Route path="dummy" component={Dummy} />
            <Route path="loading" component={LoadingPage} />  -- for development / debugging purposes only */}
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
)

export default renderRoutes
