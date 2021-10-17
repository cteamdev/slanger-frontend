import { render } from 'react-dom';

import { init } from './bridge';
import { App } from './App';

import './eruda';
// import './sentry';

init();
render(<App />, document.getElementById('root'));
