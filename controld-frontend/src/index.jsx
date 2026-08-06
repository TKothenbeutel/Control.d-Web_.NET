import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import { TopNav, BottomNav } from './Nav';
import HomePage from './Home';
import { GamePage } from './Games';
import AccountPage from './Account';
import { SignUp, LogIn } from './AccountSignIn';

const DB_API = process.env.REACT_APP_API_URL;

function Main(){
  const [ token, setToken ] = useState("");
  const [ accId, setId ] = useState(-1);

  const refreshToken = () => {
    window.cookieStore.get("jwt").then(rt => {
      if(rt.value && rt.value !== ""){
        window.cookieStore.get("accountId").then(accountId => {
          if(accountId.value){
            fetch(DB_API+"/Account/Refresh", {
              method: "POST",
              headers: {
                "Accept": "text/plain",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                "token": rt.value,
                "accountId": accountId.value
              })
            })
              .then(result => result.json())
              .then(data => updateTokens(data));
          }else{
            window.cookieStore.delete("jwt");
          }
        });
      }else{
        setToken("");
        setId(-1);
      }
    });
  };

  useEffect(refreshToken, []);

  const updateTokens = (data) => {
    if(data !== null){
      setToken(data.token);
      setId(data.refreshToken.accountId);
      window.cookieStore.set({
        name: "jwt",
        value: data.refreshToken.token,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none"
      });
    window.cookieStore.set({
      name: "accountId",
      value: data.refreshToken.accountId,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none"
    });
    }
  };

  const logOut = () => {
    setToken("");
    setId(-1);
    window.cookieStore.delete("jwt");
    window.cookieStore.delete("accountId");
  }

  return(
    <React.StrictMode>
      <TopNav accountId={accId} />

      <button onClick={refreshToken}>Refresh Token</button>
      <button onClick={logOut}>Log Out</button>

      <SignUp />
      <div style={{height:"50px",backgroundColor:"black"}}></div>
      <LogIn updateTokens={updateTokens} />
      <div style={{height:"50px",backgroundColor:"black"}}></div>
      <HomePage />
      <div style={{height:"50px",backgroundColor:"black"}}></div>
      <AccountPage accountId={accId} />
      <div style={{height:"50px",backgroundColor:"black"}}></div>
      <GamePage gameId={1} accountId={accId} />

      <BottomNav accountId={1} />
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
