import { useEffect, useState } from "react";
import pfp from "./images/default-profile.png";

const selectedStyle = {
  "color" : "var(--background)"
};

export function TopNav({ accountId }){
  return (
    <div className="navBar topBar">
      <h1 className="nm" onClick={()=>window.location.assign("/home")}>Control'D</h1>
      { accountId === -1 ?
        <div>
          <button onClick={()=>window.location.assign("/account/sign-up")}>Sign up</button>
          <button onClick={()=>window.location.assign("/account/log-in")}>Log in</button>
        </div> :
        <img src={pfp} alt="profile picture" className="profilePicture smallPFP"/>
      }
      
    </div>
  );
}

export function BottomNav({ accountId }){
  const [ selectedButton, setSelected ] = useState("_");

  useEffect(() => {
    if(window.location.pathname.startsWith("/"+selectedButton)){
      return;
    }
    switch(selectedButton){
      case "home":
        window.location.assign("/home");
        break;
      case "search":
        window.location.assign("/search");
        break;
      case "account":
        if(accountId === -1){
          window.location.assign("/account/sign-up");
        }else{
          window.location.assign(`/account/${accountId}`);
        }
        break;
      default:
        const path = window.location.pathname;
        if(path.startsWith("/home")){
          setSelected("home");
        }else if(path.startsWith("/search")){
          setSelected("search");
        }else{
          setSelected("account");
        }
    }
  }, [selectedButton]);

  return (
    <div className="navBar bottomBar">
      <div onClick={()=>setSelected("home")}>
        <p style={selectedButton === "home" ? selectedStyle : {}}>Home</p>
      </div>
      <div onClick={()=>setSelected("search")}>
        <p style={selectedButton === "search" ? selectedStyle : {}}>Search</p>
      </div>
      <div onClick={()=>setSelected("account")}>
        <p style={selectedButton === "account" ? selectedStyle : {}}>Account</p>
      </div>
    </div>
  );

}