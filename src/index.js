import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { browserHistory } from 'react-router';

import Routes from './routes';

import { Provider } from 'react-redux';
import Store from './store';

const storeInstance = Store();

ReactDOM.render(<Provider store={storeInstance}><Routes history={browserHistory} /></Provider>, document.getElementById('root'));
registerServiceWorker();
