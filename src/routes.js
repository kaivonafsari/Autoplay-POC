/*Routes for React Router*/

import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './client/App';
import Home from './components/home/Home';
import Watch from './components/watch/Watch';

const Routes = (props) => (
	<Router {...props}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="/watch" component={Watch} />
		</Route>
	</Router>
);

export default Routes;