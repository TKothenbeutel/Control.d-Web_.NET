import { useState } from "react";
import "./style/account.css"

export function SignUp(){
  const [ formFields, setFields ] = useState({});

  const handleUpdate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({...formFields, [name]:value});
  };

  const createAccount = () => {

  };

  return (
    <div className="centerPage">
      <form onSubmit={createAccount} className="accountForm">
        <h2>Create Account</h2>
        <input type="email"
          name="email"
          value={formFields.email}
          onChange={handleUpdate}
          placeholder="Enter Email"
          required
        />
        <input type="text"
          name="username"
          value={formFields.username}
          onChange={handleUpdate}
          placeholder="Enter Username"
          required
        />
        <input type="password"
          name="password"
          value={formFields.password}
          onChange={handleUpdate}
          placeholder="Enter Password"
          required
        />
        <input type="password"
          name="password_confirm"
          value={formFields.password_confirm}
          onChange={handleUpdate}
          placeholder="Confirm Password"
          required
        />
        <input type="submit" value="JOIN" />
      </form>
      <div className="twoBigButtons">
        <button onClick={()=>window.location.assign("/account/log-in")}>SIGN IN</button>
        <button onClick={()=>alert("NOT IMPLEMENTED")}>RESET PASSWORD</button>
      </div>
    </div>
  );
}

export function LogIn(){
  const [ formFields, setFields ] = useState({});

  const handleUpdate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({...formFields, [name]:value});
  };

  const logInAccount = () => {

  };

  return (
    <div className="centerPage">
      <form onSubmit={logInAccount} className="accountForm">
        <h2>Sign In</h2>
        <input type="email"
          name="email"
          value={formFields.email}
          onChange={handleUpdate}
          placeholder="Enter Email"
          required
        />
        <input type="text"
          name="username"
          value={formFields.username}
          onChange={handleUpdate}
          placeholder="Enter Username"
          required
        />
        <input type="submit" value="GO"/>
      </form>
      <div className="twoBigButtons">
        <button onClick={()=>window.location.assign("/account/sign-up")}>CREATE ACCOUNT</button>
        <button onClick={()=>alert("NOT IMPLEMENTED")}>RESET PASSWORD</button>
      </div>
    </div>
  );
}