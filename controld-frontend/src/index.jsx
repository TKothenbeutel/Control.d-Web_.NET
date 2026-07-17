import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GamePage } from './Games';
import AccountPage from './Account';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AccountPage accountId={1}/>
    <div style={{height:"50px",backgroundColor:"black"}}></div>
    <GamePage gameId={1} accountId={1}/>
  </React.StrictMode>
);
