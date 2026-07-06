import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AccountDebug from './Account';
import GamePage from './Games';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GamePage gameId={1} />
    <AccountDebug />
  </React.StrictMode>
);
