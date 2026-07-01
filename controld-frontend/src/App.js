import { useEffect, useState } from "react";

const ACCOUNT_API = process.env.REACT_APP_API_URL + '/account';

const accountTemplate = {
  'accountId': null,
  'email': '',
  'username': ''
};

function AccountDebug(){
  //GET
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState(0);
  const [account, setAccount] = useState(accountTemplate);
  //POST
  const [postAccountData, setPostAccount] = useState({...accountTemplate, password:'', postSuccessful:[null, '']});
  //DELETE
  const [deleteAccountId, setDeleteAccountId] = useState([0,null]);

  useEffect(() => {
    fetch(ACCOUNT_API+`/${accountId}`)
      .then(response => response.json())
      .then(data => setAccount(data));
  }, [accountId]);

  const getAccounts = () => {
    fetch(ACCOUNT_API)
      .then(response => response.json())
      .then(data => setAccounts(data));
  };

  const handlePostUpdate = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setPostAccount(values => ({...values,
      [name]: value,
      postSuccessful:[!postAccountData.postSuccessful[0] ? null : false,
        postAccountData.postSuccessful[1]]
    }));
  };

  const postAccount = (e) => {
    e.preventDefault();
    fetch(ACCOUNT_API, {
      method: "POST",
      body: JSON.stringify({
        accountId : postAccountData.accountId,
        email : postAccountData.email,
        username : postAccountData.username,
        password : postAccountData.password}),
      headers: {
        "accept": "text/plain",
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .catch(rejected => console.log("REJECTION: " + rejected))
    .then(response => {
      if(response.status === 201){
        setPostAccount({...postAccountData, postSuccessful:[true, '']});
      }else{
        const data = response.json();
        data.then(response => {
          const errors = Object.getOwnPropertyNames(response.errors);
          let res = '';
          errors.map(error => {
            res += error.includes("$.") ? error.substring(2) + ", " : '';
          });
          res = res.substring(0, res.length - 2)
          setPostAccount({...postAccountData, postSuccessful:[false, "fix fields " + res]});
        });
          
      }
    });
  };

  const deleteAccount = () => {
    fetch(ACCOUNT_API+`/${deleteAccountId[0]}`, {
      method: "DELETE"
    }).then(response => {
      setDeleteAccountId([deleteAccountId[0], response.status === 204])
    });
  };

  return (
    <div>
      {/* Get all accounts */}
      <h3>Get All Accounts</h3>
      <button onClick={getAccounts}>Get Accounts</button>
      <ul>
        {accounts.map((acc) => (
          <li key={acc.accountId}>
            <p>Account Id: {acc.accountId}</p>
            <p>Email: {acc.email}</p>
            <p>Username: {acc.username}</p>
          </li>
        ))}
      </ul>
      {/* Get select account */}
      <h3>Get Specific Account</h3>
      <input type="number" value={accountId} onChange={(e) => setAccountId(e.target.value)}/>
      <ul>
          <li>
            <p>Account Id: {account.accountId}</p>
            <p>Email: {account.email}</p>
            <p>Usernmae: {account.username}</p>
          </li>
      </ul>
      {/* Create account */}
      <form onSubmit={postAccount}>
        <h3>Create Account</h3>
        <p>
          {postAccountData.postSuccessful[0] === null ? '' :
          postAccountData.postSuccessful[0] ? 'Account created successfully!' :
          `Account creation error: ${postAccountData.postSuccessful[1]}`}
        </p>
        <label>Account Id
          <input name="accountId" value={postAccountData.accountId} type="number" onChange={handlePostUpdate} required />
        </label><br/>
        <label>Email
          <input name="email" value={postAccountData.email} type="text" onChange={handlePostUpdate} required />
        </label><br/>
        <label>Username
          <input name="username" value={postAccountData.username} type="text" onChange={handlePostUpdate} required />
        </label><br/>
        <label>Password
          <input name="password" value={postAccountData.password} type="text" onChange={handlePostUpdate} required />
        </label><br/>
        <input type="submit" value="Submit Account"/>
      </form>
      {/* Delete accoount */}
      <h3>Delete Specific Account</h3>
      <input type="number" value={deleteAccountId[0]} onChange={(e) => setDeleteAccountId([e.target.value, null])}/>
      <button onClick={deleteAccount}>Delete account</button>
      <p>
        {deleteAccountId[1] == null ? '' :
        deleteAccountId[1] ? `Deleted account with id ${deleteAccountId[0]}` :
        `Could not delete account with id ${deleteAccountId[0]}`}
      </p>
    </div>
  );
}

export default AccountDebug;
