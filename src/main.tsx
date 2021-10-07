import { render } from 'react-dom';

import { init } from './bridge';
import { App } from './App';

init();
render(<App />, document.getElementById('root'));

// if (import.meta.env.MODE !== 'production') import('./eruda');
// else import('./sentry');
