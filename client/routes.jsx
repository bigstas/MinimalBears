import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router'

// route components
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


const Routes = (props) => (
    <BrowserRouter> {/* Should not use <Switch /> outside a Router */}
        <Switch>
            <Route exact path="/" render={() => <Home {...props}/>} />
            <Route path="/train" render={() => <TrainPage {...props}/>} />
            <Route path="/about" render={() => <About {...props}/>} />
            <Route path="/record" render={() => <RecordPageWithData {...props}/>} />
            <Route path="/register" render={() => <JoinPageWithData {...props}/>} />
            <Route path="/login" render={() => <AuthSignInPage {...props}/>} />
            <Route path="/edit" render={() => <EditingPage {...props}/>} />
            <Route path="/contact" render={() => <Contact {...props}/>} />
            <Route path="*" render={() => <NotFound {...props}/>} />
        </Switch>
    </BrowserRouter>
)

export default Routes
