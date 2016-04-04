import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// route components
import ArenaContainer from '../client/arena';

export const renderRoutes = () => (
    <Router history={browserHistory} >
        <Route path="/" component={AppContainer} />
            <IndexRoute component={Home} />
            <Route path="arena" component={ArenaContainer} />
        </Route>
    </Router>
);