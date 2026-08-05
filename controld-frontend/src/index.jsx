import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import { TopNav, BottomNav } from './Nav';
import HomePage from './Home';
import { GamePage } from './Games';
import AccountPage from './Account';
import { SignUp, LogIn } from './AccountSignIn';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TopNav accountId={-1} />

    <SignUp />
    <div style={{height:"50px",backgroundColor:"black"}}></div>
    <LogIn />
    <div style={{height:"50px",backgroundColor:"black"}}></div>
    <HomePage />
    <div style={{height:"50px",backgroundColor:"black"}}></div>
    <AccountPage accountId={1} />
    <div style={{height:"50px",backgroundColor:"black"}}></div>
    <GamePage gameId={1} accountId={1} />

    <BottomNav accountId={1} />
  </React.StrictMode>
);
