import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { LayoutProvider } from './context/LayoutContext';

ReactDOM.render(
    <LayoutProvider>
        <App />
    </LayoutProvider>
, document.getElementById('root'));
